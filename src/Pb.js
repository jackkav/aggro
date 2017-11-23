import React, { Component } from 'react'
import cheerio from 'cheerio'
import moment from 'moment'
import styled from 'styled-components'
import { isExpired, setExpiry } from './utils'
import { Nov21PbAll } from './test'
import { pbParse } from './parsers'

export class Pb extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
    error: '',
  }
  async componentDidMount() {
    const scrapeKey = 'aggro.pb.201'
    if (!isExpired(scrapeKey)) {
      console.log('loading cached pb scrape')
      this.setState({ shows: JSON.parse(localStorage.getItem(scrapeKey)) })
      return
    }

    console.log('loading fresh pb scrape')
    this.setState({ loading: true })
    const f = await fetch(
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
      const { title, uploadedAt, size } = pbParse(name)
      console.log(uploadedAt)
      const newItem = { name: title, magnet, uploadedAt, size }
      // if()
      this.setState({ shows: [...this.state.shows, newItem] })
    })
    if (this.state.shows.length) {
      this.setState({ loading: false })
      setExpiry(scrapeKey, this.state.shows)
    }
  }
  render() {
    if (this.state.loading) return <div>loading</div>
    const magnetId = Nov21PbAll.map(
      x => x.magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0],
    )
    return (
      <div>
        {this.state.error}
        {this.state.shows.map((x, i) => {
          const recentRelease = moment(
            moment().format('YYYY') + '-' + x.uploadedAt,
            'YYYY-MM-DD HH:SS',
          )
            .fromNow()
            .includes('days')

          return <OneRow x={x} i={i} />
        })}
      </div>
    )
  }
}
const OneRow = ({ x, i }) => (
  <Row key={i} i={i}>
    <StandingView>
      <StandingChange>></StandingChange>
      <StandingWrapper>
        <StandingPosition>{i + 1}</StandingPosition>
        <LastVisitStandingPosition>
          last visit#{i + 1}
        </LastVisitStandingPosition>
      </StandingWrapper>

      <MediaLinks>
        <a href={x.magnet}>
          <img alt="m" src="https://eztv.ag/images/magnet-icon-5.png" />
        </a>
      </MediaLinks>
    </StandingView>
    <MediaView>
      <TitleView>{x.name}</TitleView>
      <MetadataView>{x.size}</MetadataView>
    </MediaView>

    {/* <Youtubelink fullname={x.name} /> */}
    {/* {!magnetId.includes(
x.magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0],
) && '*'} */}
  </Row>
)
const Row = styled.div`
  display: flex;
  flex: 1;
  background: ${p => (p.i % 2 ? 'white' : 'lightgray')};
  height: 50px;
  padding: 2px;
`
const StandingChange = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background: black;
  color: white;
`
const StandingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 4;
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
  flex: 4;
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
  }
  onHover() {}
  render() {
    const { fullname } = this.props
    const { name, year, title, uploadedAt } = pbParse(fullname)
    const searchTerm = name + ' ' + year
    // console.log(name, uploadedAt)
    if (!searchTerm) return null
    const url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBjnMTlF9ou968qeDBc6LQpN860jJ0Juj0&q=${
      searchTerm
    }&part=snippet`
    // fetch(url)
    //   .then(x => x.json())
    //   .then(json => {
    //     const first = json.items[0]
    //     console.log(url, first)
    //     this.setState({
    //       icon: first.snippet.thumbnails.default.url,
    //       watch: `https://www.youtube.com/watch?v=${first.id.videoId}`,
    //     })
    //   })
    //   .catch(function(error) {
    //     console.log('error', JSON.stringify(error.message))
    //   })
    return (
      <a target="blank" href={this.state.watch}>
        <img alt="yt" src={this.state.icon} style={{ height: 16, width: 16 }} />
      </a>
    )
  }
}
