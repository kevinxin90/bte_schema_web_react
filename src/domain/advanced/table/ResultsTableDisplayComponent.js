import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Pagination, Checkbox, Icon } from 'semantic-ui-react';
import ResultsTableCell from './ResultsTableCellComponent';
import ResultsTableFilter from './ResultsTableFilterComponent';
import ResultsTableSort from './ResultsTableSortComponent';
import { FILTER_FIELDS_TO_IGNORE } from '../AdvancedQueryConfig';
import { recordToDropdownOption } from '../../../shared/utils';

export default class ResultsTable extends Component {
  constructor(props) {
    super(props);

    let filters, selectedFilters;
    if (props.results.length > 0) {
      ({filters, selectedFilters} = this.calculateFilters(props.results));
    }

    this.state = {
      filteredResults: props.results || [],
      filters: filters || {}, //all possible filter values
      selectedFilters: selectedFilters || {}, //current filter selections
      table: {
        sortColumn: null,
        sortProperty: null,
        sortDirection: null,
        activePage: 1,
      },
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  getDisplay() {
    return this.state.filteredResults.slice(this.state.table.activePage * 10 - 10, this.state.table.activePage * 10);
  }

  getTotalPages() {
    return Math.max(Math.ceil(this.state.filteredResults.length / 10), 1);
  }

  handlePaginationChange(e, {activePage}) {
    this.setState({
      table: {
        ...this.state.table,
        activePage: activePage
      }
    });
  }

  //handle checkbox select and synchronize with graph
  handleSelect(e, { data }) {
    let node = this.props.cy.getElementById(data.qg_id);
    let entity_id = data.entity_id;

    //if entity is already selected remove it else add it
    let idx = node.data('ids').indexOf(entity_id);
    if (idx === -1) {
      node.data('ids').push(entity_id);
      node.data('options').push(recordToDropdownOption({
        display: data.entity_id,
        name: data.name,
        primary: {
          value: data.entity_id
        },
        type: data.categories[0].split(':')[1] //get type without the biolink:
      }));
    } else {
      node.data('ids').splice(idx, 1);
      node.data('options', node.data('options').filter(option => node.data('ids').includes(option.value)));
    }
    this.props.setCy(this.props.cy);
  }

  //from an array of entries, calculate the properties that can be filtered by
  calculateFilters(entries) {
    let temp = {};
    let filters  = {};
    let selectedFilters = {};
    
    entries.forEach(entry => {
      Object.keys(entry).forEach(key => {
        temp[key] = (temp[key] || []).concat(entry[key]);
      });
    })

    Object.keys(temp).forEach(category => {
      filters[category] = {};
      selectedFilters[category] = {};

      temp[category].forEach(element => {
        Object.keys(element).filter(key => (!FILTER_FIELDS_TO_IGNORE.includes(key))).forEach(key => { //ignore these fields
          if (Array.isArray(element[key])) {
            filters[category][key] = new Set([...(filters[category][key] || []), ...(element[key])]);
          } else {
            filters[category][key] = (filters[category][key] || new Set()).add(element[key]);
          }

          selectedFilters[category][key] = new Set();
          
        })
      });
    });

    return {filters: filters, selectedFilters: selectedFilters};
  }

  //using the selected filters, filter results and update filteredResults
  filterResults(updateFilters = false) {
    let filteredResults = this.props.results.filter((obj) => {
      for (const key of Object.keys(obj)) {
        for (const k of Object.keys(this.state.selectedFilters[key])) {
          if (obj[key].hasOwnProperty(k) && this.state.selectedFilters[key][k].size > 0) {
            if (Array.isArray(obj[key][k])) { //return false for entry if no array values are in the set
              let hasValueInSet = false;
              for (const val of obj[key][k]) {
                if (this.state.selectedFilters[key][k].has(val)) {
                  hasValueInSet = true;
                }
              }
              if (!hasValueInSet) {
                return false;
              }
            } else {
              if (!this.state.selectedFilters[key][k].has(obj[key][k])) {
                return false;
              }
            }
          }
        }
      }
      return true;
    });

    if (updateFilters) {
      let filters;
      ({ filters } = this.calculateFilters(filteredResults));
      this.setState({filters: filters})
    }

    this.setState({
      filteredResults: filteredResults, 
      table: {
        ...this.state.table,
        activePage: 1,
      }
    });
  }

  //update selected filters when dropdown/checkbox is clicked/selected
  updateFilters(e, data ) {
    if (data.hasOwnProperty('value')) { //handle multiselect dropdown
      let selectedFilters = this.state.selectedFilters;
      selectedFilters[data.data.objectName][data.data.key] = new Set(data.value);
      this.setState({selectedFilters: selectedFilters});
    } else { //handle checkbox
      let selectedFilters = this.state.selectedFilters;
      if (selectedFilters[data.data.objectName][data.data.key].has(data.label)) {
        selectedFilters[data.data.objectName][data.data.key].delete(data.label);
      } else {
        selectedFilters[data.data.objectName][data.data.key].add(data.label);
      }
      this.setState({selectedFilters: selectedFilters});
    }
    this.filterResults();
  }

  sortResults() {
    if (this.state.table.sortColumn && this.state.table.sortProperty && this.state.table.sortDirection) {
      let newResults;
      if (this.state.table.sortDirection === 'descending') { //do not recalculate filter b/c it must have been sorted when sortDirection was up 
        newResults = this.state.filteredResults.reverse();
      } else {
        newResults = _.sortBy(this.state.filteredResults, [result => {  
          //sort publications and array fields by length and everything else by alphabetical order
          if (Array.isArray(_.get(result, [this.state.table.sortColumn, this.state.table.sortProperty], 0)) ||
            this.state.table.sortProperty === 'publications'
          ) {
            return _.get(result, [this.state.table.sortColumn, this.state.table.sortProperty], []).length;
          } else {
            return _.get(result, [this.state.table.sortColumn, this.state.table.sortProperty], 0);
          }
        }]);
      }

      this.setState({
        filteredResults: newResults,
        table: {
          ...this.state.table,
        }
      });
    }
  }

  handleSort(e, data) {
    if (data.active || (data.source === 'table' && this.state.table.sortColumn === data.data.sortColumn)) { //flip direction of sort
      if (this.state.table.sortDirection === 'ascending') {
        this.setState({
          table: {
            ...this.state.table,
            sortDirection: 'descending'
          }
        }, () => {this.sortResults();});
      } else {
        this.setState({
          table: {
            ...this.state.table,
            sortColumn: null,
            sortProperty: null,
            sortDirection: null
          }
        });
      }
      
    } else { //set new sort
      this.setState({
        table: {
          ...this.state.table,
          sortColumn: data.data.sortColumn,
          sortProperty: data.data.sortProperty,
          sortDirection: 'ascending',
        }
      }, () => {this.sortResults();});
    }
  }

  render() {
    let tableContents;

    if (this.props.mode === "edge") {
      tableContents = <>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>
              Add Source To Query Graph
            </Table.HeaderCell>
            <Table.HeaderCell width={2}
              sorted={this.state.table.sortColumn === 'source' ? this.state.table.sortDirection : null}
              onClick={() => {this.handleSort(undefined, {data: {sortColumn: 'source', sortProperty: 'name'}, source: 'table'} )}}
            >
              Source
            </Table.HeaderCell>
            <Table.HeaderCell width={2}
              sorted={this.state.table.sortColumn === 'edge' ? this.state.table.sortDirection : null}
              onClick={() => {this.handleSort(undefined, {data: {sortColumn: 'edge', sortProperty: 'predicate'}, source: 'table'} )}}
            >
              Edge
            </Table.HeaderCell>
            <Table.HeaderCell width={2}
              sorted={this.state.table.sortColumn === 'target' ? this.state.table.sortDirection : null}
              onClick={() => {this.handleSort(undefined, {data: {sortColumn: 'target', sortProperty: 'name'}, source: 'table'} )}}
            >
              Target
            </Table.HeaderCell>
            <Table.HeaderCell width={1}>
              Add Target To Query Graph
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(this.getDisplay(), (entry) => {
            return (
              <Table.Row key={`row-${_.uniqueId()}`}>
                <Table.Cell key={`checkbox-${_.uniqueId()}`} textAlign='center'>
                  <Checkbox onClick={this.handleSelect} 
                    data={entry.source} 
                    defaultChecked={this.props.cy.getElementById(entry.source.qg_id).data('ids').includes(entry.source.entity_id)}
                  />
                </Table.Cell>
                <ResultsTableCell data={entry.source} type="node" />
                <ResultsTableCell data={entry.edge} type="edge" />
                <ResultsTableCell data={entry.target} type="node" />
                <Table.Cell key={`checkbox-${_.uniqueId()}`} textAlign='center'>
                  <Checkbox onClick={this.handleSelect} 
                    data={entry.target} 
                    defaultChecked={this.props.cy.getElementById(entry.target.qg_id).data('ids').includes(entry.target.entity_id)}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </>;
    } else {
      tableContents = <>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>
              Add Node To Query Graph
            </Table.HeaderCell>
            <Table.HeaderCell  width={3}
              sorted={this.state.table.sortColumn === 'node' ? this.state.table.sortDirection : null}
              onClick={() => {this.handleSort(undefined, {data: {sortColumn: 'node', sortProperty: 'name'}, source: 'table'} )}}
            >
              Nodes
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(this.getDisplay(), (entry) => {
            return (
              <Table.Row key={`row-${_.uniqueId()}`}>
                <Table.Cell key={`checkbox-${_.uniqueId()}`} textAlign='center'>
                  <Checkbox onClick={this.handleSelect} 
                    data={entry.node} 
                    defaultChecked={this.props.cy.getElementById(entry.node.qg_id).data('ids').includes(entry.node.entity_id)}
                  />
                </Table.Cell>
                <ResultsTableCell data={entry.node} type='node'/>
              </Table.Row>
            );
          })}
        </Table.Body>
      </>;
    }
    
    return (
      <div style={{overflowX: "auto", marginBottom: "1em", marginTop: "0.5em"}}>
        <ResultsTableFilter filters={this.state.filters} selectedFilters={this.state.selectedFilters} updateFilters={this.updateFilters} />
        <ResultsTableSort selectedFilters={this.state.selectedFilters} tableParameters={this.state.table} handleSort={this.handleSort} />
        <Table sortable unstackable celled>
          {tableContents}
        </Table>
        <Pagination
            onPageChange={this.handlePaginationChange}
            defaultActivePage={1}
            totalPages={this.getTotalPages()}
            siblingRange={2}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
          />
      </div>
    );
  }
};