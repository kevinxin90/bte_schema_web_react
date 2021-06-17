import React from 'react';
import _ from 'lodash';
import { Table, Popup, Icon, List, Header, Accordion } from 'semantic-ui-react';
import { getPublicationLink } from '../../../shared/utils';
import { TOOLTIP_FIELDS_TO_IGNORE } from '../AdvancedQueryConfig';

const AttributesList = ({attributes}) => {
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
  );
}

const EdgeCell = ({edge}) => {
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
        <AttributesList attributes={edge}/>
      </Popup.Content>
    </Popup> 
  );
}

const NodeCell = ({node}) => {
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
        <AttributesList attributes={node}/>
      </Popup.Content>
    </Popup> 
  );
}

const ResultsTableCell = ({data, type}) => {
  if (type && type.toLowerCase() === 'edge') {
    return (<EdgeCell edge={data} />);
  } else if (type && type.toLowerCase() === 'node') {
    return (<NodeCell node={data} />);
  } else {
    return (<Table.Cell></Table.Cell>);
  }
};

export default ResultsTableCell;