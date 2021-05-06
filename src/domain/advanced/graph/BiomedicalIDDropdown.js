import React, { Component } from 'react';
import { autocomplete } from 'biomedical-id-autocomplete';
import { Dropdown } from 'semantic-ui-react';
import { recordToDropdownOption } from '../../../shared/utils';

export default class BiomedicalIDDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autocompleteOptions: [],
    };
  }

  handleAddItem(e, { value }) {
    this.props.handleIDChange(e, {
      options: [{text: value, value: value}, ...this.props.nodeIDOptions],
      value: [value, ...this.props.nodeIDs]
    });
  }

  handleSearchChange(e, { searchQuery }) {
    autocomplete(searchQuery).then(response => {
      console.log("Autocomplete response", response);
      let new_options = [];
      for (let record of Object.keys(response).map((key) => response[key]).flat().sort((a, b) => (b._score - a._score))) {
        new_options.push(recordToDropdownOption(record));
      }
      this.setState({autocompleteOptions: new_options});
    });
  }

  handleChange(e, data) {
    this.props.handleIDChange(e, data);
  }

  render () {
    return (
      <Dropdown 
        placeholder='IDs  eg.MONDO:0016575'
        multiple
        search
        selection
        allowAdditions
        onSearchChange={this.handleSearchChange.bind(this)}
        onChange={this.handleChange.bind(this)}
        onAddItem={this.handleAddItem.bind(this)}
        options={[...this.props.nodeIDOptions, ...this.state.autocompleteOptions]}
        value={this.props.nodeIDs}
      />
    );
  }
}