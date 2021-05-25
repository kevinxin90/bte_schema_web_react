import React, { Component } from 'react';
import _ from 'lodash';
import { Table, Popup, Icon, List, Header, Accordion } from 'semantic-ui-react';
import { getPublicationLink } from '../../../shared/utils';
import { TOOLTIP_FIELDS_TO_IGNORE } from '../AdvancedQueryConfig';

export default class ResultsTableCell extends Component {
  //format array of attributes
  getAttributesContent(attributes) {
    return (
      <List>
        {Object.entries(attributes).filter(([key, value]) => (!TOOLTIP_FIELDS_TO_IGNORE.includes(key))).map(([key, value]) => {
          if (key === 'publications') { //handle special case publication attribute
            return (
              <List.Item key={`list-item-${_.uniqueId()}`}>
                <List.Content>Publications</List.Content>
                <List.Description as='a' href={getPublicationLink(value)} target="_blank" rel="noopener noreferrer">
                  Open All Publications({value.length})&nbsp;<Icon name='external alternate' color='grey' fitted size='small'/>
                </List.Description>
              </List.Item>
            );
          } else if (Array.isArray(value) && value.length > 0) { //handle list attributes
            let panel = [{
              key: `accordion-${_.uniqueId()}`,
              title: {
                children:(
                  <span>
                    {key}&nbsp;<Icon name='plus' size='small'/>
                  </span>
                )
              },
              content: {
                content: (
                  <List.Description>
                    <List items={value} style={{paddingTop: 0}}/>
                  </List.Description>
                )
              }
            }]
            return (
              <List.Item key={`list-item-${_.uniqueId()}`}>
                <List.Content><Accordion panels={panel}/></List.Content>
              </List.Item>
            )
          } else { //handle all other attributes
            return (
              <List.Item key={`list-item-${_.uniqueId()}`}>
                <List.Content>{key}</List.Content>
                <List.Description>
                  {value}
                </List.Description>
              </List.Item>
            )
          }
        })}
      </List>
    )
  }

  //create table cell based on node
  getNodeCell(node) {
    return (
      <Popup on='click' trigger={
        <Table.Cell style={{cursor: 'pointer'}} key={`cell-${_.uniqueId()}`}>
          {node.name}
        </Table.Cell>
      }>
        <Popup.Header>
          <Header as='h3'>
            {node.name}
            <Header.Subheader>
              {node.category}
            </Header.Subheader>
          </Header>
        </Popup.Header>
        <Popup.Content>
          {this.getAttributesContent(node)}
        </Popup.Content>
      </Popup> 
    )
  }
  
  //create table cell based on edge
  getEdgeCell(edge) {
    return (
      <Popup on='click' trigger={
        <Table.Cell style={{cursor: 'pointer'}} key={`cell-${_.uniqueId()}`}>
          {edge.predicate}
        </Table.Cell>
      }>
        <Popup.Header>
          <Header as='h3'>
            {edge.predicate}
            <Header.Subheader>
              {edge.subject} &#8594; {edge.object}
            </Header.Subheader>
          </Header>
        </Popup.Header>
        <Popup.Content>
          {this.getAttributesContent(edge)}
        </Popup.Content>
      </Popup> 
    )
  }

  render() {
    if (this.props.type && this.props.type.toLowerCase() === 'edge') {
      return this.getEdgeCell(this.props.data);
    } else if (this.props.type && this.props.type.toLowerCase() === 'node') {
      return this.getNodeCell(this.props.data);
    } else {
      return (<Table.Cell></Table.Cell>);
    }
  }
}