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
