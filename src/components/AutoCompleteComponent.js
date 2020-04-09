import React, { Component } from 'react';
import { Search } from 'semantic-ui-react'

export default class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false,
                  results: [],
                  value: this.props.value ? this.props.value : '',
                  selected: this.props.selected ? this.props.selected : {} }
  }
  //This needs to be moved to the parent class
  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title, selected: result });
    this.props.handleselect(result);
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })
    fetch('https://geneanalysis.ncats.io/explorer_api/v1/hint?q=' + value)
    .then(response => {
      if (response.ok) {
          return response.json();
      } else {
        return {}
      }})
    .then(response => {
      var new_response = {};
      for (var semantic_type in response) {
        if (response[semantic_type].length > 0) {
          new_response[semantic_type] = {name: semantic_type, results: []};
          var content = response[semantic_type].map(function(record) {
            var new_record = record;
            new_record['title'] = record['name'];
            new_record['description'] = record['display'];
            return new_record;
          });
          new_response[semantic_type]['results'] = content;
        }
      }
      this.setState({
        isLoading: false,
        results: new_response,
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <Search
          category
          loading={this.state.isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.handleSearchChange}
          results={this.state.results}
          value={this.state.value}
          {...this.props}
        />
      </React.Fragment>
    )
  }
}
