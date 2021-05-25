import React, { Component } from 'react';
import { Checkbox, Popup, Accordion, Dropdown, Button } from 'semantic-ui-react';
import _ from 'lodash';

export default class ResultsTableFilter extends Component {
  //convert one selectedFilters parameter (which is a set) into a display section for the filter
  convertSetToFilterValue(selectedFilters, set, objectName, key) {
    let attribute_values = Array.from(set);
    if (attribute_values.length > 5) {
      let options = attribute_values.map((value) => ({key: value, text: value, value: value}));
      return <div><Dropdown multiple search selection options={options} value={Array.from(selectedFilters[objectName][key])} onChange={this.props.updateFilters} data={{objectName: objectName, key: key}}/></div>;
    } else {
      return <div>{attribute_values.map(value => <div><Checkbox key={`checkbox-${_.uniqueId}`} label={value} checked={selectedFilters[objectName][key].has(value)} onClick={this.props.updateFilters} data={{objectName: objectName, key: key}}/></div>)}</div>;
    }
  }

  //visual filter accordion panels
  getFilterPanels(filters, selectedFilters) {
    let panels = Object.entries(filters).map(([key, value]) => {
      let nestedPanels = Object.entries(value).map(([nestedKey, nestedValue]) => {
        return { key: `panel-${nestedKey}`, title: nestedKey, content: { content: this.convertSetToFilterValue(selectedFilters, nestedValue, key, nestedKey) }};
      });

      let nestedContent = <div><Accordion.Accordion panels={nestedPanels}/></div>;

      return { key: `panel-${key}`, title: key, content: {content: nestedContent} };
    });

    return panels;
  }

  render() {
    return (
      <Popup 
        trigger={<Button content='Filter Results' icon='filter' labelPosition='left' />}
        flowing
        pinned
        position='bottom left'
        on='click'
        style={{padding: 0}}
      >
        <Accordion styled panels={this.getFilterPanels(this.props.filters, this.props.selectedFilters)}/>
      </Popup>
    )
  }
}