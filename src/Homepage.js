/** @jsx h */

import { h, Component } from 'preact'
import Help from './Help.js'
import logo from './img/escher-logo.png'
import logo2x from './img/escher-logo@2x.png'
import screenshot from './img/screen.png'
import screenshot2x from './img/screen@2x.png'
import './Homepage.css'

class Homepage extends Component {
  componentWillMount () {
    // The Escher fill-screen option breaks the homepage
    if (document.body.classList.contains('fill-screen')) {
      document.body.classList.remove('fill-screen')
    }
  }

  render () {
    return (
      <div id='homepage-container'>
        <div id='homepage-body'>

          <div id='homepage-title-box'>
            <img
              id='homepage-logo'
              alt=''
              src={logo}
              srcset={`${logo} 1x, ${logo2x} 2x`}
            />
            <div id='homepage-title'>ESCHER-FBA</div>
          </div>

          <div id='homepage-description'>
            Escher-FBA is an interactive pathway visualization tool for
            on-the-fly flux balance analysis (FBA) calculations.
          </div>

          <div id='homepage-launch-box'>
            <a href='/app' id='homepage-launch-box-centered'>
              <img id='homepage-launch-screen'
                   alt=''
                   src={screenshot}
                   srcset={`${screenshot} 1x, ${screenshot2x} 2x`}
              />
              <div id='homepage-launch-button'>
                Launch Escher-FBA
              </div>
            </a>
          </div>

          <hr />

          <Help />

        </div>
      </div>
    )
  }
}

export default Homepage