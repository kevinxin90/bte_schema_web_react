import _ from 'lodash'
import React from 'react'
import { Table, Pagination, Accordion, Checkbox } from 'semantic-ui-react'

export default function BTETable(props) {

    const headers = props.table.display.length > 0 ? Object.keys(props.table.display[0]) : [];
        
    return (
        <div>
            <h3>Your Query Results</h3>
            <div style={{overflowX: "auto"}}>
                <Table sortable celled compact>
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
                        <Table.Row key={Object.values(item).join('||')}>
                            <Table.Cell key='checkbox' textAlign='center'>
                                <Checkbox toggle
                                    name={Object.values(item).join('||')}
                                    onClick={props.handleSelect}
                                    checked={props.selectedQueryResults.has(Object.values(item).join('||'))}
                                /> 
                            </Table.Cell>
                            {_.map(headers, (col, i) => (
                                <Table.Cell key={i}>
                                    {Array.isArray(item[col]) //if the item is an array, make it a space separated string
                                    ? (item[col].length > 5 //make an accordion if the item's length is greater than 5
                                        ? <Accordion exclusive={false} fluid panels={[{
                                            key: `panel-${i}`,
                                            title: `Show All (${item[col].length})`,
                                            content: item[col].join(' ')
                                        }]} />
                                        : item[col].join(' ')
                                    ) 
                                    : item[col]}
                                </Table.Cell>
                            ))}
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
                style={{ marginTop: 5 }}
                // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
            />
        </div>
    )
}
