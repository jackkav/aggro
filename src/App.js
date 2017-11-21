import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { Pb } from './Pb'
import { Ez } from './Ez'
const SimpleLayout = () => (
  <div className="App">
    <div className="App-header">
      <h2>Welcome</h2>
    </div>
    <div className="flex-container">
      <div className="flex-item">
        <div className="flex-content">
          <Pb />
        </div>
      </div>
      <div className="flex-item">
        <div className="flex-content">
          <Ez />
        </div>
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
