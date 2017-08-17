import { h, Component } from 'preact'
import * as escher from 'escher-vis'
import 'escher-vis/css/dist/builder.css'
import tooltipComponentFactory from './TooltipComponent.js'
//  const d3_select = escher.libs.d3_select
const _ = escher.libs.underscore
const Builder = escher.Builder

class EscherContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      builder: null,
      isCurrentObjective: false,
      koMarkersSel: null,
      lowerRange: this.props.lowerRange,
      upperRange: this.props.upperRange
    }
  }

  //  Enables Escher handling DOM
  shouldComponentUpdate = () => false

  componentWillReceiveProps (nextProps) {
    if (this.state.builder === null) {
      console.warn('Builder not loaded yet')
      return
    }

    // console.log('Setting reaction data')
    this.state.builder.set_reaction_data(nextProps.reactionData)
    if (this.props.reactionData !== undefined) {
      this.state.builder.map.set_status(
      `<div>Current Objective: ${this.props.currentObjective}</div>
      <div>Flux Through Objective: ${this.props.reactionData[this.props.currentObjective]}</div>`)
    }
  }

  kosAddGroup (builder) {
    // at the beginning
    const koMarkersSel = builder.selection
      .select('.zoom-g')
      .append('g').attr('id', 'ko-markers')
    this.setState({koMarkersSel})

    _.values(builder.map.reactions, r => r.bigg_id === 'GAPD')
  }

  /**
   *
   * @param {string[]} reactionList - List of knocked out reactions.
   */
  koDrawRectanges (reactionList) {
    if (this.state.koMarkersSel === null) {
      console.warn('this.state.koMarkersSel is not defined')
      return
    }
    // every time this changes
    const sel = this.state.koMarkersSel.selectAll('.ko')
      .data(['GAPD'])
    const g = sel.enter()
      .append('g')
    g.append('rect')
      .style('fill', 'red')
    g.append('rect')
      .style('fill', 'red')
  }
  /**
   * Used to remotely set the state of the tooltip component.
   * @param {string} biggId - The BiGG ID of the reaction.
   */
  getData (biggId) {
    // Get attributes from reaction
    // see story on indexing objects by bigg id
    // console.log('Running') //  Tracks getData being called
    this.setState({
      sliderChange: f => this.props.sliderChange(f, biggId),
      resetReaction: f => this.props.resetReaction(f),
      setObjective: f => this.props.setObjective(f),
      step: this.props.step
    })
    for (let i = 0, l = this.props.model.reactions.length; i < l; i++) {
      if (this.props.model.reactions[i].id === biggId) {
        this.setState({
          lowerBound: this.props.model.reactions[i].lower_bound,
          upperBound: this.props.model.reactions[i].upper_bound,
          name: this.props.model.reactions[i].name
        })
        if (this.props.currentObjective === biggId) {
          this.setState({
            isCurrentObjective: true
          })
          // this.props.map.set_status('Current Objective: ' + biggId)
        } else {
          this.setState({
            isCurrentObjective: false
          })
        }
        if (this.props.reactionData !== null) {
          this.setState({
            currentFlux: this.props.reactionData[biggId]
          })
        }
        break
      }
    }

    let markerPosition = (this.state.currentFlux + this.state.upperRange) / (2 * (1 + this.state.upperRange))
    let markerLabelStyle = {
      position: 'relative',
      color: 'black'
    }
    if (markerPosition > 0.8875 && markerPosition < 0.963) {
      markerLabelStyle = {
        position: 'relative',
        left: -(475 * (markerPosition - 0.8875)) + '%'
      }
    } else if (markerPosition < 0.075 && markerPosition >= 0) {
      markerLabelStyle = {
        position: 'relative',
        left: -(450 * (markerPosition - 0.075)) + '%'
      }
    } else if (markerPosition >= 0.963) {
      markerLabelStyle = {
        position: 'relative',
        left: -45 + '%'
      }
    } else if (markerPosition < 0) {
      markerLabelStyle = {
        position: 'relative',
        left: 42.5 + '%'
      }
    }
    this.setState({markerLabelStyle})
    return this.state
  }

  componentDidMount () {
    // need a story to fix the first_load_callback
    const builder = new Builder(this.props.map, this.props.model, null, this.base, {
      fill_screen: true,
      // first_load_callback: builder => {
      //   builder.selection.select('.menu').selectAll('button').each(function () => {
      //     if (button.text === 'Load reaction data') {
      //       this.style('color', 'grey')
      //       this.attr('disabled', true)
      //     }
      //   })
      // },
      enable_keys: false,
      tooltip_component: tooltipComponentFactory(this.getData.bind(this))
    })
    this.setState({ builder })
  }

  render () {
    return (
      <div className='EscherContainer' />
    )
  }
}

export default EscherContainer
