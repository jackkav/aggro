import React, { Component } from 'react'
import cheerio from 'cheerio'
import moment from 'moment'
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
      const { title, uploadedAt } = pbParse(name)
      console.log(uploadedAt)
      const newItem = { name: title, magnet, uploadedAt }
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

          return (
            <div key={i} style={{ color: recentRelease ? 'black' : 'gray' }}>
              <a href={x.magnet}>
                <img alt="m" src="https://eztv.ag/images/magnet-icon-5.png" />
              </a>
              {/* <Youtubelink fullname={x.name} /> */}
              {/* {!magnetId.includes(
              x.magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0],
            ) && '*'} */}
              {i + 1})
              {x.name}
            </div>
          )
        })}
      </div>
    )
  }
}

class Youtubelink extends Component {
  state = {
    icon: '',
  }
  render() {
    const { fullname } = this.props
    const { name, year, title, uploadedAt } = pbParse(fullname)
    const searchTerm = name + ' ' + year
    // console.log(name, uploadedAt)
    if (!searchTerm) return null
    const url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBjnMTlF9ou968qeDBc6LQpN860jJ0Juj0&q=${searchTerm}&part=snippet`
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
