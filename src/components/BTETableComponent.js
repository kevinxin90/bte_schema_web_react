import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Form, Pagination } from 'semantic-ui-react'

export default class BTETable extends Component {
  render() {

    const formData = () => (
        <Form>
            <h3>Your Query Results</h3>
            <Table sortable celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        {_.map(['source_node', 'pred1', 'intermediate_node', 'pred2', 'targetNode'], (item) => (
                            <Table.HeaderCell
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
