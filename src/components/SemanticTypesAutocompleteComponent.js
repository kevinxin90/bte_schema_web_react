import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import {semanticTypeShorthand} from '../shared/semanticTypes'

const initialState = { isLoading: false, results: [], value: '' }

export default class SearchSemanticTypeComponent extends Component {
    state = initialState


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
            results: _.filter(_.keys(semanticTypeShorthand), isMatch).map(item => ({'title': item})),
            })
        }, 300)
    }

  render() {
    const { isLoading, value, results } = this.state

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
