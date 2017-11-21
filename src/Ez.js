import React, { Component } from 'react'
import cheerio from 'cheerio'
export class Ez extends Component {
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
          if (this.state.page < 5) this.more()
        })
      })
      .catch(function(error) {
        console.log(JSON.stringify(error))
      })
  }
  more = () => {
    this.setState({ page: this.state.page + 1 })
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
        <button onClick={() => this.more()}>more</button>
      </div>
    )
  }
}
