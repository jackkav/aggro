import movies from './movies.json'
import { pbParse } from '../parsers'

const getOmdb = async (name, year) => {
  const url = `http://www.omdbapi.com/?apikey=6cf170d0&t=${name}&y=${year}`
  let f = await fetch(url)
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
    const j = JSON.parse(localStorage.getItem(scrapeKey))
    for (let i = 0; i <= 3; i++) {
      if (!j[i].rating) {
        let p = pbParse(j[i].name)
        let o = await getOmdb(p.name, p.year)
        j[i].rating = o.rating
        j[i].imageUrl = o.imageUrl
      }
    }
    // add to localstorageobject
    localStorage.setItem(scrapeKey, JSON.stringify(j))
    // show on page
    const k = [j[0], j[1], j[2], j[3]].map(x => {
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
