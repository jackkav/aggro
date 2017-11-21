import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { Pb } from './Pb'
const SimpleLayout = () => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Title</h2>
    </div>
    <div className="flex-container">
      <div className="flex-item">
        <div className="flex-content">
          <Pb />
        </div>
      </div>
      <div className="flex-item">
        <div className="flex-content" />
      </div>
    </div>
  </div>
)

class App extends Component {
  render() {
    return <SimpleLayout />
  }
}

export default App
