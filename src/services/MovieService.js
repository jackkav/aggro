import cheerio from 'cheerio'
import { pbParse } from '../parsers'
import { setExpiry } from '../utils'

const getOmdb = async (name, year) => {
  const url = `http://www.omdbapi.com/?apikey=6cf170d0&t=${name}&y=${year}`
  let f = await fetch(url)
  if (!f.response) {
    console.log(f.Error, name, year)
  }
  let json = await f.json()
  // console.log(json)
  return {
    rating: json.imdbRating,
    imageUrl: json.Poster,
    imdbID: json.imdbID,
  }
}

export default class MovieService {
  static getMovies = async () => {
    const scrapeKey = 'aggro.pb.201'
    let s = localStorage.getItem(scrapeKey)
    let j = s && s.length > 20 && JSON.parse(s)

    if (!j) {
      const x = await getPB()
      setExpiry(scrapeKey, x, 12)
      j = x
    }
    for (let i = 0; i < j.length; i++) {
      if (!j[i].rating) {
        let o = await getOmdb(j[i].movieTitle, j[i].year)
        j[i].rating = o.rating
        j[i].imageUrl = o.imageUrl
        j[i].imdbID = o.imdbID
      }
    }
    localStorage.setItem(scrapeKey, JSON.stringify(j))
    return j ? j : []
  }
}

const getPB = async () => {
  let cors = 'https://cors-anywhere.herokuapp.com/'
  let f = await fetch(cors + 'thepiratebay.rocks/top/201')
  if (f.status === 404) f = await fetch(cors + 'thepiratebay.org/top/201')
  if (!f.ok) {
    return
  }
  alert('connected: ' + f.ok)
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
    // const { title, uploadedAt, size, movieTitle, year } = pbParse(fullTag)
    const p = pbParse(fullTag)
    const newItem = {
      id,
      magnet,
      url,
      ...p,
    }
    s.push(newItem)
  })
  alert('total: ' + s.length)
  return s
}
