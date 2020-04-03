import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Form, Pagination } from 'semantic-ui-react'

export default class ExplainTable extends Component {
  state = {
    column: null,
    data: [],
    display: [],
    direction: null,
    activePage: 1,
    totalPages: 1
  };

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.content !== prevProps.content) {
      this.setState({data: this.props.content})
      if (Array.isArray(this.props.content)){
        this.setState({display: this.props.content.slice(0, 10),
                       totalPages: Math.floor(this.props.content.length/10) + 1})
      }
    }
  }

  handleSort = (clickedColumn) => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      });

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
      display: this.state.data.slice(this.state.activePage*10 - 10, this.state.activePage*10),
    });
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({display: this.state.data.slice(activePage*10 - 10, activePage*10),
                   activePage: activePage});
  }


  render() {
    const { column, data, direction } = this.state

    const formData = () => (
      <Form>
            <h2> Step 3: Select the Query Result you want to display.</h2>
            <hr />
            <h3>Your Query Results</h3>
            <Table sortable celled fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell
                    sorted={column === 'source_node' ? direction : null}
                    onClick={this.handleSort('source_node')}
                  >
                    sourceNode
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'pred1' ? direction : null}
                    onClick={this.handleSort('pred1')}
                  >
                    pred1
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'intermediate_node' ? direction : null}
                    onClick={this.handleSort('intermediate_node')}
                  >
                    intermediateNode
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'pred2' ? direction : null}
                    onClick={this.handleSort('pred2')}
                  >
                    pred2
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'target_node' ? direction : null}
                    onClick={this.handleSort('target_node')}
                  >
                    targetNode
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {_.map(this.state.display, (item) => (
                <Table.Row key={Object.values(item).join('||')}>
                  <Table.Cell collapsing>
                      <label>
                      <input type="checkbox"
                        name={Object.values(item).join('||')}
                        onChange={this.props.handleSelect} 
                        defaultChecked={false} /> 
                      display
                    </label>
                  </Table.Cell>
                  <Table.Cell>{item['input']}</Table.Cell>
                  <Table.Cell>{item['pred1']}</Table.Cell>
                  <Table.Cell>{item['node1_name']}</Table.Cell>
                  <Table.Cell>{item['pred2']}</Table.Cell>
                  <Table.Cell>{item['output_name']}</Table.Cell>
                </Table.Row>
              ))}
              </Table.Body>
            </Table>
            <Pagination
              onPageChange={this.handlePaginationChange}
              defaultActivePage={1}
              totalPages={this.state.totalPages}
              siblingRange={1}
              // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
            />
          </Form>
    )

    return (
      this.props.resultReady ? formData(): null
    )
  }
}
