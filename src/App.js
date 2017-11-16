import React, { Component } from 'react'
import cheerio from 'cheerio'
import styled from 'styled-components'
import { Table, Icon } from 'antd'
import { old, notold } from './test'
import './App.css'
const columns = [
  {
    title: 'Magnet',
    key: 'magnet',
    render: (text, record) => (
      <span>
        <a href={record.magnet}>
          <img src="https://eztv.ag/images/magnet-icon-5.png" />
        </a>
      </span>
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
]
class App extends Component {
  render() {
    return (
      <Root>
        <Ez />
        {/* <Pb /> */}
      </Root>
    )
  }
}
const Root = styled.div`
  display: flex;
  flex: 1;
`
const BorderBottom = styled.div`
  display: flex;
  flex: 1;
  border-bottom: 1px solid #000;
`
const Column = styled.div`
  flex: 1;
  flex-direction: column;
`
const EpisodeName = styled.div`flex: 1;`

const Actions = styled.div`
  width: 30;
  padding: 20;
`
const Heading = styled.div`
  display: flex;
  flex: 1;
  padding: 20;
`
export default App
const expected = (a, b) =>
  a.map((item, index) => ({
    ...item,
    lastIndex: b.findIndex(x => x.magnet === item.magnet),
  }))

class Pb extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
  }
  componentDidMount() {
    //TODO: invalidate cache after one hour
    if (localStorage.getItem('aggro.pb205')) {
      console.log(
        'loading cached scrape',
        JSON.parse(localStorage.getItem('aggro.pb205')),
      )
      this.setState({ shows: JSON.parse(localStorage.getItem('aggro.pb205')) })
    } else {
      localStorage.setItem('aggro.updated', JSON.stringify(new Date()))
      console.log('loading fresh scrape')
      this.setState({ loading: true })
      fetch('https://cors-anywhere.herokuapp.com/thepiratebay.org/top/205')
        .then(resp => resp.text())
        .then(body => {
          const $ = cheerio.load(body)
          $('a[title="Download this torrent using magnet"]').each((a, item) => {
            const magnet = item.attribs.href
            const name = $(item)
              .parent()
              .text()
            // console.log({ index: a, name, magnet })
            this.setState({
              shows: [...this.state.shows, { index: a, name, magnet }],
            })
            // this.setState({ shows: [{ name, magnet }] })
            this.setState({ loading: false })
          })
          localStorage.setItem('aggro.pb205', JSON.stringify(this.state.shows))
        })
        .catch(function(error) {
          console.log(JSON.stringify(error))
        })
    }
  }
  render() {
    return (
      <div>
        <Table
          loading={this.state.loading}
          dataSource={this.state.shows}
          columns={columns}
          pagination={false}
        />
      </div>
    )
  }
}
//TODO: only load youtube link on hover
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
        console.log(first.id.videoId)
        if (first)
          this.setState({
            icon: first.snippet.thumbnails.default.url,
            watch: `https://www.youtube.com/watch?v=${first.id.videoId}`,
          })
      })
    return (
      <a href={this.state.watch}>
        <img src={this.state.icon} style={{ height: 16, width: 16 }} />
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
class Ez extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
    whitelist: [],
  }
  componentDidMount() {
    this.setState({ loading: true })
    fetch('https://eztv.ag')
      .then(resp => resp.text())
      .then(body => {
        // console.log(body)
        const $ = cheerio.load(body)
        $('.magnet').each((a, item) => {
          const name = item.attribs.title
          const magnet = item.attribs.href
          this.setState({ shows: [...this.state.shows, { name, magnet }] })
          this.setState({ loading: false })
        })
      })
      .catch(function(error) {
        console.log(JSON.stringify(error))
      })
  }
  more = () => {
    this.setState({ page: this.state.page++ })
    fetch('https://eztv.ag/page_' + this.state.page)
      .then(resp => resp.text())
      .then(body => {
        const $ = cheerio.load(body)
        $('.magnet').each((a, item) => {
          const name = item.attribs.title
          const magnet = item.attribs.href
          this.setState({ shows: [...this.state.shows, { name, magnet }] })
        })
      })
      .catch(function(error) {
        console.log(JSON.stringify(error))
      })
  }
  click = e => {
    console.log(e.name)
    //get e.name and add to whitelist
  }
  render() {
    return (
      <div>
        <Table
          loading={this.state.loading}
          dataSource={this.state.shows}
          columns={columns}
          pagination={false}
          onRowClick={e => this.click(e)}
        />
        <button onClick={() => this.more()}>more</button>
      </div>
    )
  }
}
