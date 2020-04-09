import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'

const initialState = { isLoading: false, results: [], value: '', data: [] }

export default class SearchSemanticTypeComponent extends Component {
  state = initialState
  
  componentDidMount() {
    fetch('https://geneanalysis.ncats.io/explorer_api/v1/semantictypes')
            .then(response => {
                if (response.ok) {
                    return response;
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statsText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
            .then(response => response.json())
            .then(response => {
                console.log('response', response)
                this.setState({
                    data: response,
                });
            })
            .catch(error => { console.log('semantic types could not be fetched', error.message); alert('Semantic Types could not be fetched: '+error.message); });
    }
  handleResultSelect = (e, { result }) => {
      this.setState({ value: result.title });
      this.props.handleSelect(result.title);
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })
    setTimeout(() => {
        if (this.state.value.length < 1) return this.setState(initialState)

        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = (result) => re.test(result)

        this.setState({
        isLoading: false,
        results: _.filter(this.state.data, isMatch).map(item => ({'title': item})),
        })
    }, 300)
  }

  render() {
    const { data, isLoading, value, results } = this.state

    return (
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
            {...this.props}
          />
    )
  }
}
