import React, { Component } from 'react';
import { Grid, Icon, Button, Popup } from 'semantic-ui-react';

import GraphModeSwitcher, { MODE } from './GraphModeSwitcher';

import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import popper from 'cytoscape-popper';
import Tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// cytoscape.use(popper);
cytoscape.use(edgehandles);

export default class GraphQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cy: {},
      eh: {},
      mode: 1
    };
  }

  //set mode (for mode switcher component)
  setMode(mode) {
    if (mode === MODE.addEdge) {
      this.state.eh.enable();
      this.state.eh.enableDrawMode();
    } else {
      this.state.eh.disableDrawMode();
      this.state.eh.disable();
    }
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
      data: {
        label: "Any"
      },
      renderedPosition: {
        x: e.renderedPosition.x,
        y: e.renderedPosition.y,
      },
    }]);
  }

  removeElement(e) {
    this.state.cy.remove(e);
  }

  showEdgeOptions(edge) {
    let dummy = document.createElement('div');

    let tip = new Tippy(dummy, {
      trigger: 'manual',
      lazy: false,
      interactive: true,
      appendTo: document.body,
      onCreate(instance) { 
        instance.popperInstance.reference = edge.popperRef(); 
      },
      content() {
        let content = document.createElement('div');
        content.innerHTML = `
          <h3>${edge.id()}</h3>
        `;
        return content;
      },
      onUntrigger(instance) {
        instance.destroy();
      }

    });

    tip.show();
  }

  showNodeOptions(node) {
    let dummy = document.createElement('div');

    let tip = new Tippy(dummy, {
      trigger: 'manual',
      lazy: false,
      interactive: true,
      appendTo: document.body,
      onCreate(instance) { 
        instance.popperInstance.reference = node.popperRef(); 
      },
      content() {
        let content = document.createElement('div');
        content.innerHTML = `
          <h3>${node.id()}</h3>
        `;
        return content;
      },
      onUntrigger(instance) {
        instance.destroy();
      }

    });

    tip.show();
  }

  componentDidMount() {
    const container = document.getElementById('cy');
    const cy = cytoscape({
      container: container,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
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
      } else if (this.state.mode === MODE.edit) {
        if (event.target !== cy && event.target.isNode()) {
          this.showNodeOptions(event.target);
        } else if (event.target !== cy && event.target.isEdge()) {
          this.showEdgeOptions(event.target);
        }
      }
    });

    //delete elements on right click
    cy.on('cxttap', (event) => {
      if (event.target !== cy) {
        this.removeElement(event.target);
      }
    });

    let eh = cy.edgehandles({hoverDelay: 50});

    this.setState({cy: cy, eh: eh}); 
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