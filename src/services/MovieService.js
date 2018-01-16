import movies from './movies.json'
import { pbParse } from '../parsers'

export default class MovieService {
  static getMovies() {
    const scrapeKey = 'aggro.pb.201'
    const j = JSON.parse(localStorage.getItem(scrapeKey))
    console.log(j[0])
    const k = j.map(x => ({
      ...x,
      title: pbParse(x.name).name,
    }))
    return k ? k : []
  }
}
