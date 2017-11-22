import React, { Component } from 'react'
import cheerio from 'cheerio'
import moment from 'moment'
const isExpired = key => {
  const expire = localStorage.getItem(key)
  console.log(key + 'has Expired', moment().isAfter(expire))
  return moment().isAfter(expire)
}
const setExpiry = key => {
  localStorage.setItem(
    key,
    moment()
      .add(1, 'hour')
      .format(),
  )
}
export class Pb extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
  }
  componentDidMount() {
    //TODO: invalidate cache after one hour

    if (
      !isExpired('aggro.pb.all.lastScrape') &&
      localStorage.getItem('aggro.pb.all')
    )
      console.log('loading cached scrape')
    // this.setState({ shows: JSON.parse(localStorage.getItem('aggro.pb.all')) })
    return

    setExpiry('aggro.pb.all.lastScrape')
    console.log('loading fresh scrape')
    this.setState({ loading: true })
    fetch('https://cors-anywhere.herokuapp.com/thepiratebay.org/top/all')
      .then(resp => resp.text())
      .then(body => {
        const $ = cheerio.load(body)
        $('a[title="Download this torrent using magnet"]').each((a, item) => {
          const magnet = item.attribs.href
          const name = $(item)
            .parent()
            .text()
          this.setState({ shows: [...this.state.shows, { name, magnet }] })
          // this.setState({ shows: [{ name, magnet }] })
        })
        if (this.state.shows.length) {
          this.setState({ loading: false })
          localStorage.setItem('aggro.pb.all', JSON.stringify(this.state.shows))
        }
      })
      .catch(function(error) {
        console.log(JSON.stringify(error))
      })
  }
  render() {
    return (
      <div>
        {this.state.loading && <div>loading</div>}
        <div>
          {this.state.shows.map((x, i) => (
            <div key={i}>
              <a href={x.magnet}>
                <img alt="m" src="https://eztv.ag/images/magnet-icon-5.png" />
              </a>
              {/* <Youtubelink fullname={x.name} /> */}
              {x.name}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
class Youtubelink extends Component {
  state = {
    icon: 'https://i.ytimg.com/vi/ue80QwXMRHg/default.jpg',
  }
  render() {
    // console.log('123', pbParse(fullname).title)
    const { fullname } = this.props
    const title = pbParse(fullname).title
    if (!title) return null
    const url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBjnMTlF9ou968qeDBc6LQpN860jJ0Juj0&q=${title}&part=snippet`
    fetch(url)
      .then(x => x.json())
      .then(json => {
        const first = json.items[0]
        this.setState({
          icon: first.snippet.thumbnails.default.url,
          watch: `https://www.youtube.com/watch?v=${first.id.videoId}`,
        })
      })
    return (
      <a href={this.state.watch}>
        <img alt="yt" src={this.state.icon} style={{ height: 16, width: 16 }} />
      </a>
    )
  }
}

export const pbParse = input => {
  if (!input) return false
  if (input.includes('Season') && input.includes('Complete')) return false
  if (!input.includes('[ettv]')) return false
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
  const episodeIndex = input.indexOf(episode)
  const uploadedIndex = input.indexOf('Uploaded')
  const endOfTitleIndex = episodeIndex
  const title = input
    .slice(0, endOfTitleIndex - 1)
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
  const name = input
    .slice(0, uploadedIndex - 1)
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
  return {
    episode,
    quality,
    size,
    title,
    name,
    uploader: 'ettv',
  }
}
