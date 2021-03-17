import React, { Component } from 'react';
import { Grid, Icon, Button, Popup } from 'semantic-ui-react';

import GraphModeSwitcher, { MODE } from './GraphModeSwitcher';

import cytoscape from 'cytoscape';

export default class GraphQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cy: {},
      mode: 1
    };
  }

  //set mode (for mode switcher component)
  setMode(mode) {
    console.log(this.state.mode);
    this.setState({mode: mode});
  }

  //get dimensions of enclosing div (for node positioning purposes)
  getDimensions() { 
    let domRect = document.getElementById('cy').getBoundingClientRect();

    return [domRect.width, domRect.height];
  }

  zoomFit() {
    let [width, height] = this.getDimensions();
    this.state.cy.fit();
    this.state.cy.zoom({level: this.state.cy.zoom() * 0.99, position: {x: width/2, y: height/2}});
  }

  //create node based on mouse position
  createNode(e) {
    this.state.cy.add([{
      group: "nodes",
      renderedPosition: {
        x: e.renderedPosition.x,
        y: e.renderedPosition.y,
      },
    }]);
  }

  componentDidMount() {
    const container = document.getElementById('cy');
    const cy = cytoscape({
      container: container,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(id)',
            'background-color': 'black'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 2,
            'label': 'data(label)',
            'text-rotation': 'autorotate',
            'text-margin-y': '-6',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'opacity': 0.5
          }
        }
      ],
      minZoom: 0.1,
      maxZoom: 15,
      wheelSensitivity: 0.4,
    });
    

    cy.on('tap', (event) => {
      console.log(this.state.mode);
      if (this.state.mode === MODE.addNode) {
        this.createNode(event);
      }
    })

    this.setState({cy: cy}); 
  } 

  render() {
    return (
      <div style={{ paddingTop: "1rem" }}>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column width="4">
              <h2>
                Graph &nbsp;&nbsp;
                <Popup 
                  content="Stuff"
                  trigger={ <Icon circular name="info" size="tiny" style={{verticalAlign: 4}}/> }
                /> 
                </h2>
            </Grid.Column>
            <Grid.Column style={{textAlign: "center"}}  width="8">
              <GraphModeSwitcher mode={this.state.mode} setMode={this.setMode.bind(this)} />
            </Grid.Column>
            <Grid.Column style={{textAlign: "right"}} width="4">
              <Button basic compact style={{marginRight: 0, marginBottom: 5}} onClick={this.zoomFit}><Icon name="search" />Zoom Fit</Button>
              </Grid.Column>
          </Grid.Row>
        </Grid>
        <div id="cy" style={{ height: 600, border: "1px solid #ddd" }}></div>
      </div>
    )
  }
}