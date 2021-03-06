import React, { Component } from 'react'
import cheerio from 'cheerio'
import moment, { updateLocale } from 'moment'
import styled from 'styled-components'
import { isExpired, setExpiry } from './utils'
import { Nov21PbAll } from './test'
import { pbParse } from './parsers'

export class Pb extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
    fresh: false,
    error: '',
  }
  async componentDidMount() {
    const scrapeKey = 'aggro.pb.201'
    if (!isExpired(scrapeKey)) {
      console.log('loading cached pb scrape')
      this.setState({
        shows: JSON.parse(localStorage.getItem(scrapeKey)),
        fresh: false,
      })
      return
    }

    console.log('loading fresh pb scrape')
    this.setState({
      loading: true,
    })

    let f = await fetch(
      'https://cors-anywhere.herokuapp.com/thepiratebay.org/top/201',
    )
    if (f.status === 404)
      f = await fetch(
        'https://cors-anywhere.herokuapp.com/thepiratebay.rocks/top/201',
      )
    if (!f.ok) {
      this.setState({
        error: 'broken link',
        loading: false,
      })
      return
    }
    const body = await f.text()
    const $ = cheerio.load(body)
    $('a[title="Download this torrent using magnet"]').each((a, item) => {
      const magnet = item.attribs.href
      const name = $(item)
        .parent()
        .text()

      const url = $(item)
        .parent()
        .find('.detName a')[0].attribs.href
      const id = magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0]
      const { title, uploadedAt, size } = pbParse(name)
      console.log('url', url)
      const newItem = {
        id,
        name: title,
        magnet,
        uploadedAt,
        size,
        url,
      }
      this.setState({
        shows: [...this.state.shows, newItem],
      })
    })
    if (this.state.shows.length) {
      this.setState({
        loading: false,
        fresh: true,
      })
      setExpiry(scrapeKey, this.state.shows, 12)
    }
  }
  render() {
    if (this.state.loading) return <div> loading </div>
    const magnetId = Nov21PbAll
    return (
      <div>
        {this.state.error}
        <div>
          {this.state.fresh ? 'Fresh ' : 'Old '}
          Tomatoes
        </div>
        <div> This week </div>
        {this.state.shows
          .map((x, i) => ({
            ...x,
            pos: i,
          }))
          .filter(x => isReleasedThisWeek(x.uploadedAt))
          .map((x, i) => {
            const last = getLastVisitPostion(x.magnet)
            const current = x.pos + 1
            return (
              <OneRow
                key={x.magnet}
                x={x}
                i={current}
                last={last}
                timeSinceRelease={parseReleaseTime(x.uploadedAt)}
              />
            )
          })}
        <div> All time </div>
        {this.state.shows.map((x, i) => {
          const last = getLastVisitPostion(x.magnet)
          const current = i + 1
          return (
            <OneRow
              key={x.magnet}
              x={x}
              i={current}
              last={last}
              timeSinceRelease={parseReleaseTime(x.uploadedAt)}
            />
          )
        })}
      </div>
    )
  }
}
const parse = uploadedAt => {
  let timeSinceRelease
  if (uploadedAt.includes('Y-day'))
    timeSinceRelease = moment().subtract(1, 'day')
  else if (uploadedAt.includes(':'))
    timeSinceRelease = moment(uploadedAt, 'MM-DD HH:SS')
  else timeSinceRelease = moment(uploadedAt, 'MM-DD YYYY')
  return timeSinceRelease
}
const parseReleaseTime = uploadedAt => parse(uploadedAt).fromNow()
const isReleasedThisWeek = uploadedAt =>
  parse(uploadedAt).isAfter(moment().subtract(7, 'day'))

const getLastVisitPostion = magnet => {
  // const lastScrapeDate = localStorage.getItem('aggro.pb.201.lastScrape')
  // const refreshedToday = moment().isSameOrAfter(lastScrapeDate, 'day')
  //hmm logic too complicated
  // const lastVisitIds = refreshedToday
  //   ? JSON.parse(localStorage.getItem('aggro.pb.201.lastScrapeData'))
  //   : Nov21PbAll

  return (
    Nov21PbAll.findIndex(
      y => y === magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0],
    ) + 1
  )
}
const getStandingChange = (prev, current) => {
  if (!prev)
    return 'http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/16/new-icon.png'
  if (current < prev)
    return 'http://icons.iconarchive.com/icons/visualpharm/must-have/16/Stock-Index-Up-icon.png'
  if (current > prev)
    return 'http://icons.iconarchive.com/icons/visualpharm/must-have/16/Stock-Index-Down-icon.png'
  return 'http://icons.iconarchive.com/icons/famfamfam/silk/16/resultset-next-icon.png'
}
const getUsefulLastVisit = () => {
  //if last visit was over a day use local storage
  //maybe create a first visit store?
  //if not use local
}
const getLastPosition = (prev, current) => {
  if (!prev) return `new`
  if (prev === current) return 'no change'
  return 'prev #' + prev
}
const OneRow = ({ x, i, last, timeSinceRelease }) => (
  <Row i={i}>
    <StandingView>
      <StandingChange>
        <img alt="." src={getStandingChange(last, i)} />
      </StandingChange>
      <StandingWrapper>
        <StandingPosition> {i} </StandingPosition>
        <LastVisitStandingPosition>
          {getLastPosition(last, i)}
        </LastVisitStandingPosition>
      </StandingWrapper>
      <MediaLinks>
        <Youtubelink fullname={x.name} />
      </MediaLinks>
    </StandingView>
    <MediaView>
      <TitleView> {x.name} </TitleView>
      <MetadataView>
        Size: {x.size}
        Released: {x.uploadedAt} {timeSinceRelease}
        <a href={x.magnet}>
          <img
            alt="m"
            src="http://icons.iconarchive.com/icons/emey87/trainee/16/Magnet-icon.png"
          />
        </a>
        {/* <MoreInfo url={x.url} /> */}
      </MetadataView>
    </MediaView>
    {/* {!magnetId.includes(
    x.magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0],
    ) && '*'} */}
  </Row>
)
class MoreInfo extends Component {
  state = {
    summary: '',
    loading: false,
  }
  onHover = () => {
    const url = 'https://cors-anywhere.herokuapp.com/' + this.props.url

    console.log('event', url)
    this.setState({
      loading: true,
    })
    fetch(url)
      .then(x => x.text())
      .then(body => {
        const $ = cheerio.load(body)
        const summary = $('.nfo pre').text()
        this.setState({
          loading: false,
          summary,
        })
        console.log($('#comments .comment').text())
      })
      .catch(function(error) {
        console.log('error', JSON.stringify(error.message))
      })
  }
  render() {
    const a = 5
    return (
      <span onMouseOver={this.onHover}>
        {this.state.loading ? 'loading' : 'summary'}
      </span>
    )
  }
}
const Row = styled.div`
  display: flex;
  flex: 1;
  background: ${p => (p.i % 2 ? 'white' : 'rgba(0,0,0,0.15)')};
  height: 50px;
  padding-bottom: 2px;
`
const StandingChange = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background: black;
  color: ${p => p.color};
`
const StandingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 4;
  min-width: 70;
`
const StandingPosition = styled.div`
  flex: 2;
  font-size: 1.5rem;
`
const LastVisitStandingPosition = styled.div`
  flex: 4;
  color: gray;
`

const MediaLinks = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  align-items: center;
  justify-content: center;
`
const StandingView = styled.div`
  display: flex;
  text-align: center;
  flex: 1;
`
const MediaView = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`

const TitleView = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
`
const MetadataView = styled.div`
  flex: 1;
  color: gray;
`
class Youtubelink extends Component {
  state = {
    icon: '',
    loading: false,
  }
  onHover = e => {
    if (this.state.watch) return
    const { fullname } = this.props
    const { name, year, title, uploadedAt } = pbParse(fullname)
    const searchTerm = name + ' ' + year + ' trailer'
    if (!searchTerm) return null
    const url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBjnMTlF9ou968qeDBc6LQpN860jJ0Juj0&q=${searchTerm}&part=snippet`
    this.setState({
      loading: true,
    })
    fetch(url)
      .then(x => x.json())
      .then(json => {
        const first = json.items[0]
        // console.log(url, first)
        this.setState({
          icon: first.snippet.thumbnails.default.url,
          watch: `https://www.youtube.com/watch?v=${first.id.videoId}`,
          loading: false,
        })
      })
      .catch(function(error) {
        console.log('error', JSON.stringify(error.message))
      })
    // timed load? only load top of the list?
    fetch(`http://www.omdbapi.com/?apikey=6cf170d0&t=${name}&y=${year}`)
      .then(x => x.json())
      .then(json => {
        console.log(json)
        this.setState({ rating: json.imdbRating })
      })
  }
  render() {
    return (
      <div onMouseOver={this.onHover}>
        <a target="blank" href={this.state.watch}>
          {this.state.loading ? (
            <img src="http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/96/Youtube-icon.png" />
          ) : (
            <img
              alt="yt"
              src={
                this.state.icon ||
                'http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/72/Youtube-icon.png'
              }
              style={{
                height: 50,
              }}
            />
          )}
        </a>
        <div>{this.state.rating}</div>
      </div>
    )
  }
}
