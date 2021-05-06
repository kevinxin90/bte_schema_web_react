import React, { Component } from 'react';
import { Popup, Accordion, Button } from 'semantic-ui-react';
import { SORT_FIELDS_TO_IGNORE } from '../AdvancedQueryConfig';

export default class ResultsTableSort extends Component {
  getSortPanels(selectedFilters, tableParameters) {
    let panels = Object.entries(selectedFilters).map(([key, value]) => {
      let nestedContent = <Button.Group basic vertical labeled icon>
        {Object.keys(value).filter(k => !SORT_FIELDS_TO_IGNORE.includes(k)).map(nestedKey => {
          let selected = (tableParameters.sortColumn === key && tableParameters.sortProperty === nestedKey);
          return <Button 
            icon={selected ? `sort ${tableParameters.sortDirection}` : 'sort'}
            data={{sortColumn: key, sortProperty: nestedKey}}
            content={nestedKey} 
            active={selected} 
            onClick={this.props.handleSort}
          />;
        })}
      </Button.Group>;

      return { key: `sort-panel-${key}`, title: key, content: {content: nestedContent} };
    });

    return panels;
  }

  render() {
    return (
      <Popup 
        trigger={<Button content='Sort Results' icon='sort' labelPosition='left' />}
        flowing
        pinned
        position='bottom left'
        on='click'
        style={{padding: 0}}
      >
        <Accordion styled panels={this.getSortPanels(this.props.selectedFilters, this.props.tableParameters)}/>
      </Popup>
    )
  }
}