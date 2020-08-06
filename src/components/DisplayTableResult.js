import _ from 'lodash'
import React from 'react'
import { Table, Pagination, Checkbox, Icon } from 'semantic-ui-react'
import { getPublicationLink } from '../shared/utils'

export default function BTETable(props) {
    const headers = props.table.display.length > 0 ? Object.keys(props.table.display[0]) : [];
        
    return (
        <div>
            <h3>Your Query Results</h3>
            <div style={{overflowX: "auto", marginBottom: "1em"}}>
                <Table sortable unstackable celled compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Display</Table.HeaderCell>
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
                        <Table.Row key={Object.values(item).join('||') + _.uniqueId()}>
                            <Table.Cell key='checkbox' textAlign='center'>
                                <Checkbox toggle
                                    name={Object.values(item).join('||')}
                                    onClick={props.handleSelect}
                                    checked={props.selectedQueryResults.has(Object.values(item).join('||'))}
                                /> 
                            </Table.Cell>
                            {_.map(headers, (col, i) => {
                                if (Array.isArray(item[col])) { //if the item is an array, make it a space separated string (only applies to publications)
                                    return ( // use collapsing to prevent icon from wrapping
                                        <Table.Cell key={i} collapsing>
                                            <div>
                                                <a href={getPublicationLink(item[col])} target="_blank" rel="noopener noreferrer">Publications ({item[col].length})&nbsp;&nbsp;<Icon name='external alternate' /></a>
                                            </div>
                                        </Table.Cell>
                                    );
                                } else {
                                    return (
                                        <Table.Cell key={i}>
                                            {item[col]}
                                        </Table.Cell>
                                    );
                                }
                            })}
                        </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Pagination
                onPageChange={props.handlePaginationChange}
                defaultActivePage={1}
                totalPages={props.table.totalPages}
                siblingRange={2}
                // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
            />
        </div>
    )
}
