import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';

export const MODE = {
  "edit": 1,
  "addNode": 2,
  "addEdge": 3
};

//handles input mode of graph
export default class GraphModeSwitcher extends Component {
  render() {
    return (
      <Button.Group basic>
        <Button compact 
          active={this.props.mode === MODE.edit} 
          onClick={() => {this.props.setMode(MODE.edit)}}
        >
          <Icon name="mouse pointer" />Edit
        </Button>
        <Button compact 
          active={this.props.mode === MODE.addNode} 
          onClick={() => {this.props.setMode(MODE.addNode)}}
        >
          <Icon name="dot circle outline" />Add Node
        </Button>
        <Button compact 
          active={this.props.mode === MODE.addEdge} 
          onClick={() => {this.props.setMode(MODE.addEdge)}}
        >
          <Icon name="share alternate" />Add Edge
        </Button>
      </Button.Group>
    )
  }
}