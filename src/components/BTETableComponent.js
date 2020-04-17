import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Form, Pagination } from 'semantic-ui-react'

export default class BTETable extends Component {
  render() {
    const headers = this.props.table.display.length > 0 ? Object.keys(this.props.table.display[0]) : [];
    const formData = () => (
        <Form>
            <h3>Your Query Results</h3>
            <Table sortable celled compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        {_.map(headers, (item) => (
                            <Table.HeaderCell
                                key={item}
                                className={item}
                                value={item}
                                sorted={this.props.table.column === item ? this.props.table.direction : null}
                                onClick={this.props.handleSort}
                            >
                                {item}
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(this.props.table.display, (item) => (
                    <Table.Row key={Object.values(item).join('||')}>
                        <Table.Cell key='checkbox'>
                            <label>
                            <input type="checkbox"
                                name={Object.values(item).join('||')}
                                onChange={this.props.handleSelect} 
                                defaultChecked={false} /> 
                            display
                            </label>
                        </Table.Cell>
                        {_.map(headers, (col, i) => (
                            <Table.Cell key={i}>{item[col]}</Table.Cell>
                        ))}
                    </Table.Row>
                ))}
                </Table.Body>
            </Table>
            <Pagination
                onPageChange={this.props.handlePaginationChange}
                defaultActivePage={1}
                totalPages={this.props.table.totalPages}
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
