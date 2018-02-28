import React, { Component } from 'react'
import MovieList from './MovieList'
import MovieService from '../../services/MovieService'

export default class Movies extends Component {
  constructor() {
    super()

    this.state = {
      movies: [],
    }
  }

  async componentDidMount() {
    let movies = await MovieService.getMovies()
    this.setState(() => ({ movies }))
  }

  render() {
    return (
      <div className="container-fluid" style={{ marginLeft: '-15px' }}>
        <div className="d-flex flex-row">
          <div className="col-sm-12">
            <MovieList movies={this.state.movies} />
          </div>
        </div>
      </div>
    )
  }
}
