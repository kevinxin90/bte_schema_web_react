import _ from 'lodash'
import faker from 'faker'
import React, { Component } from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'

const initialState = { isLoading: false, results: [], value: '', selected: {} }


export default class SearchExampleCategory extends Component {
  state = initialState

  handleResultSelect = (e, { result }) => this.setState({ value: result.title, selected: result })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })
    fetch('https://biothings.io/explorer_kgs/api/v1/hint?q=' + value)
    .then(response => response.json())
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
    const { isLoading, value, results } = this.state

    return (
        <Search
          category
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.handleSearchChange}
          results={results}
          value={value}
          {...this.props}
        />
    )
  }
}
