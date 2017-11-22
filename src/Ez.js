import React, { Component } from 'react'
import cheerio from 'cheerio'
import { isExpired, setExpiry } from './utils'
export class Ez extends Component {
  state = {
    shows: [],
    page: 0,
    loading: false,
  }
  componentDidMount() {
    const scrapeKey = 'aggro.ez.all'
    if (!isExpired(scrapeKey)) {
      console.log('loading cached ez scrape')
      this.setState({ shows: JSON.parse(localStorage.getItem(scrapeKey)) })
      return
    }
    console.log('loading fresh ez scrape')
    this.setState({ loading: true })

    fetch('https://cors-anywhere.herokuapp.com/https://eztv.ag')
      .then(resp => resp.text())
      .then(body => {
        // console.log(body)y build
        const $ = cheerio.load(body)
        $('.magnet').each((a, item) => {
          const name = item.attribs.title
          const magnet = item.attribs.href
          this.setState({ shows: [...this.state.shows, { name, magnet }] })

          // if (this.state.page < 5) this.more()
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
  // more = () => {
  //   this.setState({ page: this.state.page + 1 })
  //   fetch(
  //     'https://cors-anywhere.herokuapp.com/https://eztv.ag/page_' +
  //       this.state.page,
  //   )
  //     .then(resp => resp.text())
  //     .then(body => {
  //       const $ = cheerio.load(body)
  //       $('.magnet').each((a, item) => {
  //         const name = item.attribs.title
  //         const magnet = item.attribs.href
  //         this.setState({ shows: [...this.state.shows, { name, magnet }] })
  //       })
  //     })
  //     .catch(function(error) {
  //       console.log(JSON.stringify(error))
  //     })
  // }
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
              {x.name}
            </div>
          ))}
        </div>
        {/* <button onClick={() => this.more()}>more</button> */}
      </div>
    )
  }
}
