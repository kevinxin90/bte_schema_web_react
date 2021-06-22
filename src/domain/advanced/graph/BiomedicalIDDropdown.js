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

    this.currentSearchQuery = '';

    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //update options only (select handled by handleChange)
  handleAddItem(e, { value }) {
    this.props.handleAddItem([{text: value, value: value}, ...this.props.node.data('options')], this.props.node);
  }

  //refresh the options when the search query changes
  handleSearchChange(e, { searchQuery }) {
    this.currentSearchQuery = searchQuery;
    autocomplete(searchQuery).then(response => {
      if (this.currentSearchQuery === searchQuery) { //prevent old queries returning from updating the autocomplete to an unwanted value
        let new_options = [];
        for (let record of Object.keys(response).map((key) => response[key]).flat().sort((a, b) => (b._score - a._score))) {
          let new_option = recordToDropdownOption(record);
          if (new_option) { //avoid pushing undefined
            new_options.push(new_option);
          }
        }
        this.setState({autocompleteOptions: new_options});
      }
    });
  }

  //handle selection
  handleChange(e, data) {
    this.props.handleIDChange(data, this.props.node);
  }

  render () {
    return (
      <Dropdown 
        placeholder='IDs  eg.MONDO:0016575'
        multiple
        search
        selection
        allowAdditions
        onSearchChange={this.handleSearchChange}
        onChange={this.handleChange}
        onAddItem={this.handleAddItem}
        options={[...this.props.node.data('options'), ...this.state.autocompleteOptions]}
        value={this.props.node.data('ids')}
      />
    );
  }
}