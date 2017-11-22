import React, { Component } from 'react'
import cheerio from 'cheerio'
import { isExpired, setExpiry } from './utils'
import { Nov21PbAll } from './test'
export class Pb extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
  }
  componentDidMount() {
    const scrapeKey = 'aggro.pb.201'
    if (!isExpired(scrapeKey)) {
      console.log('loading cached pb scrape')
      this.setState({ shows: JSON.parse(localStorage.getItem(scrapeKey)) })
      return
    }

    console.log('loading fresh pb scrape')
    this.setState({ loading: true })

    fetch('https://cors-anywhere.herokuapp.com/thepiratebay.rocks/top/201')
      .then(resp => resp.text())
      .then(body => {
        const $ = cheerio.load(body)
        $('a[title="Download this torrent using magnet"]').each((a, item) => {
          const magnet = item.attribs.href
          const name = $(item)
            .parent()
            .text()
          const newItem = { name: pbParse(name).title, magnet }
          // if()
          this.setState({ shows: [...this.state.shows, newItem] })
        })
        if (this.state.shows.length) {
          this.setState({ loading: false })
          setExpiry(scrapeKey, this.state.shows)
        }
      })
      .catch(function(error) {
        console.log(JSON.stringify(error))
      })
  }
  render() {
    if (this.state.loading) return <div>loading</div>
    const magnetId = Nov21PbAll.map(
      x => x.magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0],
    )
    return (
      <div>
        {this.state.shows.map((x, i) => (
          <div
            key={i}
            style={{
              color: magnetId.includes(
                x.magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0],
              )
                ? 'gray'
                : 'white',
            }}
          >
            <a href={x.magnet}>
              <img alt="m" src="https://eztv.ag/images/magnet-icon-5.png" />
            </a>
            <Youtubelink fullname={x.name} />
            {i + 1})
            {x.name}
          </div>
        ))}
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
    const { name, year, title } = pbParse(fullname)
    const searchTerm = name + ' ' + year
    // console.log(title)
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

export const pbParse = input => {
  if (!input) return false
  if (
    input.match(/(Home And Away)|(Judge Judy)|(Coronation Street)|(Emmerdale)/)
  )
    return false
  const e =
    input.match(/S\d\dE\d\d/) ||
    input.match(/\d{4} \d{2} \d{2}/) ||
    input.match(/Series \d \d{1,2}of\d{1,2}/)
  const episode = e ? e.toString() : ''
  const q = input.match(/1080p/) || input.match(/720p/)
  const size =
    input.match(/Size (.*?), ULed/) &&
    input.match(/Size (.*?), ULed/).length > 1 &&
    input
      .match(/Size (.*?), ULed/)[1]
      .replace('MiB', 'MB')
      .replace('GiB', 'GB')
  const quality = q ? q.toString() : 'HDTV'
  const year = input.match(/2015/) || input.match(/2016/) || input.match(/2017/)
  const yearIndex = input.indexOf(year)
  const episodeIndex = input.indexOf(episode)
  const uploadedIndex = input.indexOf('Uploaded')
  const endOfTitleIndex = uploadedIndex
  const title =
    input
      .slice(0, endOfTitleIndex - 1)
      .replace(/\./g, ' ')
      .replace(/\n/g, '')
      .replace(/\t/g, '') +
    ' ' +
    size
  const name = input
    .slice(0, yearIndex - 1)
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
  return {
    episode,
    quality,
    size,
    title,
    name,
    year,
  }
}
