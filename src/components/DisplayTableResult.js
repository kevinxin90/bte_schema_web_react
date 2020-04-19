import _ from 'lodash'
import React from 'react'
import { Table, Form, Pagination } from 'semantic-ui-react'

export default function BTETable(props) {

    const headers = props.table.display.length > 0 ? Object.keys(props.table.display[0]) : [];
        
    return (
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
                                sorted={props.table.column === item ? props.table.direction : null}
                                onClick={props.handleSort}
                            >
                                {item}
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(props.table.display, (item) => (
                    <Table.Row key={Object.values(item).join('||')}>
                        <Table.Cell key='checkbox'>
                            <label>
                            <input type="checkbox"
                                name={Object.values(item).join('||')}
                                onChange={props.handleSelect} 
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
                onPageChange={props.handlePaginationChange}
                defaultActivePage={1}
                totalPages={props.table.totalPages}
                siblingRange={1}
                // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
            />
        </Form>
    )
}
