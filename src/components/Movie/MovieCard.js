import React from 'react'
import PropTypes from 'prop-types'
const Title = props => (
  <div>
    {props.movie.title ? (
      <h4 className="card-title">{props.movie.title}</h4>
    ) : (
      <h4
        className="card-title"
        style={{
          background: 'gray',
          minWidth: 50,
          minHeight: 50,
        }}
      />
    )}
  </div>
)
const Image = props => (
  <div>
    {props.movie.imageUrl ? (
      <img
        src={props.movie.imageUrl}
        alt={props.movie.name}
        width={298}
        height={400}
        mode="fill"
      />
    ) : (
      <div
        style={{
          background: 'gray',
          width: 298,
          height: 400,
        }}
      >
        {props.movie.name}
      </div>
    )}
  </div>
)
const MovieCard = props => (
  <div className="movie-card">
    <div className="movie-card card">
      <Image movie={props.movie} />
      {/* <Title movie={props.movie} />
        <h6 className="card-subtitle mb-2 text-muted">
          {props.movie.subtitle}
        </h6>
        <p className="text-justify" style={{ fontSize: '14px' }}>
          {props.movie.description}
        </p> */}
      <div className="card-footer">
        <div className="clearfix">
          <div className="float-left">
            <img
              src="http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/96/Youtube-icon.png"
              style={{
                height: 30,
              }}
            />
            <img
              src="http://icons.iconarchive.com/icons/emey87/trainee/16/Magnet-icon.png"
              style={{
                height: 30,
              }}
            />
          </div>
          <div className="card-footer-badge float-right badge badge-primary badge-pill">
            {props.movie.rating || '?'}
          </div>
          <div className="card-footer-badge float-right badge badge-secondary badge-pill">
            {props.movie.quality || 'HD'}
          </div>
        </div>
      </div>
    </div>
  </div>
)
const MovieCardOld = props => (
  <div className="movie-card">
    <div className="movie-card card">
      <img className="card-img-top" src={props.movie.imageUrl} alt="" />
      <div className="card-body">
        <h4 className="card-title">{props.movie.title}</h4>
        <h6 className="card-subtitle mb-2 text-muted">
          {props.movie.subtitle}
        </h6>
        <p className="text-justify" style={{ fontSize: '14px' }}>
          {props.movie.description}
        </p>
      </div>
      <div className="card-footer">
        <div className="clearfix">
          <div className="float-left">
            <img
              src="http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/96/Youtube-icon.png"
              style={{
                height: 30,
              }}
            />
            <img
              src="http://icons.iconarchive.com/icons/emey87/trainee/16/Magnet-icon.png"
              style={{
                height: 30,
              }}
            />
          </div>
          <div className="card-footer-badge float-right badge badge-primary badge-pill">
            {props.movie.rating}
          </div>
        </div>
      </div>
    </div>
  </div>
)
MovieCard.defaultProps = {
  movie: {},
}

MovieCard.propTypes = {
  movie: PropTypes.object,
}

export default MovieCard
