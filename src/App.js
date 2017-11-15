import React, { Component } from 'react'
import cheerio from 'cheerio'
import styled from 'styled-components'

class App extends Component {
  render() {
    return (
      <Root>
        {/* <Column>
          <Heading>desc</Heading>123123123123123
        </Column>
        <Column>
          <Heading>desc</Heading>
          <Pb />
        </Column>
        <Column>
          <Heading>desc</Heading>
          <Ez />
        </Column> */}
        <Pb />
      </Root>
    )
  }
}
const Root = styled.div`
  display: flex;
  flex: 1;
`
const Column = styled.div`
  flex: 1;
  background-color: #444;
  color: #fff;
  padding: 20;
`
const Heading = styled.div`
  flex: 1;
  background-color: #444;
  color: #fff;
  padding: 20;
`
export default App
class Pb extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
  }
  componentDidMount() {
    //TODO: invalidate cache after one hour
    if (localStorage.getItem('aggro.pb')) {
      console.log('loading cached scrape')
      this.setState({ shows: JSON.parse(localStorage.getItem('aggro.pb')) })
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
            this.setState({ shows: [...this.state.shows, { name, magnet }] })
            // this.setState({ shows: [{ name, magnet }] })
            this.setState({ loading: false })
          })
          localStorage.setItem('aggro.pb', JSON.stringify(this.state.shows))
        })
        .catch(function(error) {
          console.log(JSON.stringify(error))
        })
    }
  }
  render() {
    return (
      <div>
        {this.state.loading && <div>loading</div>}
        <ul id="authors" style={{ listStyleType: 'none', textAlign: 'left' }}>
          {this.state.shows.map((x, i) => (
            <li key={i}>
              <a href={x.magnet}>
                <img src="https://eztv.ag/images/magnet-icon-5.png" />
              </a>
              {x.name}
              {/* <a href="https://www.googleapis.com/youtube/v3/search?key=AIzaSyBjnMTlF9ou968qeDBc6LQpN860jJ0Juj0&q=thor&part=snippet">
                <img
                  src="https://i.ytimg.com/vi/ue80QwXMRHg/default.jpg"
                  style={{ height: 16, width: 16 }}
                />
              </a> */}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

class Ez extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
  }
  componentDidMount() {
    this.setState({ loading: true })
    fetch('https://eztv.ag')
      .then(resp => resp.text())
      .then(body => {
        console.log(body)
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
  render() {
    return (
      <div>
        {this.state.loading && <div>loading</div>}
        <ul id="authors" style={{ listStyleType: 'none', textAlign: 'left' }}>
          {this.state.shows.map((x, i) => (
            <li key={i}>
              <a href={x.magnet}>
                <img src="https://eztv.ag/images/magnet-icon-5.png" />
              </a>
              {x.name}
            </li>
          ))}
        </ul>
        <button onClick={() => this.more()}>more</button>
      </div>
    )
  }
}
