import React from 'react';
import { Search } from 'semantic-ui-react'

export default function AutoComplete(props) {

    const handleResultSelect = (e, { result }) => {
        //this.setState({ value: result.title, selected: result });
        props.handleSelect(result);
    }


    return (
        <React.Fragment>
            <Search
            category
            loading={props.state.isLoading}
            onResultSelect={handleResultSelect}
            onSearchChange={props.handleSearchChange}
            results={props.state.results}
            value={props.state.value}
            />
        </React.Fragment>
    )
}
