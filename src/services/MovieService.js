import movies from './movies.json'
import cheerio from 'cheerio'
import moment from 'moment'
import { pbParse } from '../parsers'
import { isExpired, setExpiry } from '../utils'

const getOmdb = async (name, year) => {
  const url = `http://www.omdbapi.com/?apikey=6cf170d0&t=${name}&y=${year}`
  let f = await fetch(url)
  if (!f.response) {
    console.log(f.Error, name, year)
  }
  let json = await f.json()
  console.log(json)
  return {
    rating: json.imdbRating,
    imageUrl: json.Poster,
  }
}

export default class MovieService {
  static getMovies = async () => {
    // return movies
    // scrape pb, filter this week, for each scrape
    const scrapeKey = 'aggro.pb.201'
    let j = JSON.parse(localStorage.getItem(scrapeKey))
    if (!j) {
      const x = await getPB()
      console.log('123', x)
      setExpiry(scrapeKey, x, 12)
      j = JSON.parse(localStorage.getItem(scrapeKey))
    }
    for (let i = 0; i <= 7; i++) {
      if (!j[i].rating) {
        let o = await getOmdb(j[i].movieTitle, j[i].year)
        j[i].rating = o.rating
        j[i].imageUrl = o.imageUrl
      }
    }
    // add to localstorageobject
    localStorage.setItem(scrapeKey, JSON.stringify(j))
    // show on page
    const k = [j[0], j[1], j[2], j[3], j[4], j[5], j[6]].map(x => {
      const p = pbParse(x.name)
      return {
        ...x,
        title: p.name,
        quality: p.quality,
        rating: x.rating,
        imageUrl: x.imageUrl,
      }
    })
    return k ? k : []
  }
}

const getPB = async () => {
  let f = await fetch(
    'https://cors-anywhere.herokuapp.com/thepiratebay.org/top/201',
  )
  if (f.status === 404)
    f = await fetch(
      'https://cors-anywhere.herokuapp.com/thepiratebay.rocks/top/201',
    )
  if (!f.ok) {
    return
  }
  const body = await f.text()
  const $ = cheerio.load(body)

  const s = []
  $('a[title="Download this torrent using magnet"]').each((a, item) => {
    const magnet = item.attribs.href
    const fullTag = $(item)
      .parent()
      .text()
    const url = $(item)
      .parent()
      .find('.detName a')[0].attribs.href
    const id = magnet.match(/(?![magnet:?xt=urn:btih:])(.*)(?=&dn)/)[0]
    const { title, uploadedAt, size, movieTitle, year } = pbParse(fullTag)

    const newItem = {
      id,
      movieTitle,
      title,
      magnet,
      uploadedAt,
      size,
      url,
      year,
    }
    s.push(newItem)
  })
  return s
}
