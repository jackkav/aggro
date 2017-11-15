import React, { Component } from 'react'
import cheerio from 'cheerio'
import Grid from 'react-css-grid'
import styled from 'styled-components'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {/* <Ez /> */}
        {/* <Pb /> */}
      </div>
    )
  }
}
const Box = styled.div`
  background-color: #444;
  color: #fff;
  border-radius: 5;
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
      })
      .catch(function(error) {
        console.log(JSON.stringify(error))
      })
  }
  render() {
    return (
      <div>
        <h1>Authors</h1>
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
        <h1>Authors</h1>
        {this.state.loading && <div>loading</div>}
        <ul id="authors" style={{ listStyleType: 'none', textAlign: 'left' }}>
          {this.state.shows.map((x, i) => (
            <li key={i}>
              <a href={x.magnet}>{x.name}</a>
            </li>
          ))}
        </ul>
        <button onClick={() => this.more()}>more</button>
      </div>
    )
  }
}
