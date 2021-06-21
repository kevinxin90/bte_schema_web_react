import React, { Component } from 'react';
import { autocomplete } from 'biomedical-id-autocomplete';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

export default class InputSelect extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange = (e, data) => {
    autocomplete(data.searchQuery)
      .then(response => {
        let new_options = [];
        
        for (let record of Object.keys(response).map((key) => response[key]).flat().sort((a, b) => (b._score - a._score))) {
          new_options.push({
            key: record.display + _.uniqueId(),
            text: record.name,
            image: {spaced: 'right', src: `/explorer/assets/images/icons/${record.type}.png`},
            content: <span>
                <b>{record.name}</b> <br /><br />
                <small>{record.display}</small>
              </span>,
            data: record,
            title: record.type,
            value: record.name
          });
        }

        this.props.setState({
          options: [...this.props.selectedOptions, ...new_options]
        })
      })
  }

  handleChange = (e, data) => {
    this.props.setState({
      value: data.value,
      selectedOptions: this.props.options.filter(option => data.value.includes(option.value))
    })
  }

  render() {
    return (
      <Dropdown 
        placeholder='Add 1 or more nodes'
        fluid
        multiple
        search={options => options} //bypass default search in favor of using autocomplete to resolve search
        selection
        onChange={this.handleChange}
        onSearchChange={this.handleSearchChange}
        options={this.props.options}
        value={this.props.value}
      />
    )
  }

}