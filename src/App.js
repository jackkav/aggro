import React, { Component } from 'react'
import { Router, browserHistory, Route, Link } from 'react-router'
import logo from './logo.svg'
import './App.css'

const Page = ({ title }) => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>{title}</h2>
    </div>
    <ul class="flex-container">
      <div class="flex-item">1</div>
      <div class="flex-item">2</div>
    </ul>
    <p className="App-intro">This is the {title} page.</p>
    <p>
      <Link to="/">Home</Link>
    </p>
    <p>
      <Link to="/about">About</Link>
    </p>
    <p>
      <Link to="/settings">Settings</Link>
    </p>
  </div>
)
const Simple = () => (
  <div className="App">
    <div class="flex-container">
      <div class="flex-item">
        <div class="flex-content">
          <img src="https://eztv.ag/images/magnet-icon-5.png" />
          The.Walking.Dead.S08E03.HDTV.x264-SVA[ettv] Uploaded 11-06 04:05, Size
          484.97 MiB, ULed by ettv
        </div>
      </div>
      <div class="flex-item">
        <div class="flex-content">
          <img src="https://eztv.ag/images/magnet-icon-5.png" />
          The.Walking.Dead.S08E03.HDTV.x264-SVA[ettv] Uploaded 11-06 04:05, Size
          484.97 MiB, ULed by ettv
        </div>
      </div>
    </div>
  </div>
)
const Home = props => <Simple title="Home" />

const About = props => <Page title="About" />

const Settings = props => <Page title="Settings" />

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/settings" component={Settings} />
      </Router>
    )
  }
}

export default App
