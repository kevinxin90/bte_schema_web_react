import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import AccordionComponent from '../../components/AccordionComponent';
import Steps from '../../components/StepsComponent';
import ExplainInput from './ExplainInputComponent';
import { MetaPathForm } from '../../components/MetaPathFormComponent';
import ExplainQueryResult from './ExplainQueryResultComponent';
import { getIntermediateNodes, findMetaPath } from '../../shared/utils';
import query from "@biothings-explorer/explain";

let _ = require('lodash');

//forward ref so we can call addConnection and deleteConnection in CytoscapeGraphComponent
const ExplainQueryResultWrapper = React.forwardRef((props, ref) => {
    return (<ExplainQueryResult graphRef={ref} {...props} />);
});

class Explain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            step1Complete: false,
            step2Complete: false,
            step3Complete: false,
            resultReady: false,
            selectedInput: {},
            selectedOutput: {},
            paths: [],
            selectedPaths: new Set(),
            queryResults: { 'data': [], 'log': [] },
            table: {
                column: null,
                display: [],
                direction: null,
                activePage: 1,
                totalPages: 1
            },
            selectedQueryResults: new Set(),
            step1ShowError: false,
            step2ShowError: false
        };

        this.graphRef = React.createRef();

        this.handleStep1Submit = this.handleStep1Submit.bind(this);
        this.handleStep2Submit = this.handleStep2Submit.bind(this);
        this.handleInputSelect = this.handleInputSelect.bind(this);
        this.handleOutputSelect = this.handleOutputSelect.bind(this);
        this.handleMetaPathSelect = this.handleMetaPathSelect.bind(this);
        this.handleQueryResultSelect = this.handleQueryResultSelect.bind(this);
        this.handleBackToStep1 = this.handleBackToStep1.bind(this);
        this.handleBackToStep2 = this.handleBackToStep2.bind(this);
        this.handleBackToStep3 = this.handleBackToStep3.bind(this);
        this.handleStep1Close = this.handleClose.bind(this, 'step1ShowError');
        this.handleStep2Close = this.handleClose.bind(this, 'step2ShowError');
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
    };

    //this function will be passed to autocomplete component
    //in order to retrieve the selected input
    handleInputSelect(value) {
        this.setState({
            selectedInput: value
        });
    }

    //this function will be passed to autocomplete component
    //in order to retrieve the selected output
    handleOutputSelect(value) {
        this.setState({
            selectedOutput: value
        });
    }

    handleMetaPathSelect(event) {
        const selectedPaths = this.state.selectedPaths;
        if (event.target.checked) {
            selectedPaths.add(event.target.name)
        } else {
            selectedPaths.delete(event.target.name)
        }
        this.setState({ selectedPaths: selectedPaths })
    }

    handleQueryResultSelect(event, data) {
        const selectedQueryResults = this.state.selectedQueryResults;
        if (data.checked) {
            selectedQueryResults.add(data.name);
            this.graphRef.current.addConnection(data.name, this.state.selectedInput.type, this.state.selectedOutput.type);
        } else {
            selectedQueryResults.delete(data.name);
            this.graphRef.current.deleteConnection(data.name);
        }
        
        this.setState({
            selectedQueryResults: selectedQueryResults,
        });
    }

    handleClose = (item) => this.setState({
        [item]: false
    })

    async handleStep1Submit(event) {
        event.preventDefault();
        if (_.isEmpty(this.state.selectedInput) || _.isEmpty(this.state.selectedOutput)) {
            this.setState({
                step1ShowError: true
            });
        } else {
            this.setState({
                currentStep: 2,
                step1Complete: true,
                step2Complete: false,
                step3Complete: false,
                selectedPaths: new Set(),
                queryResults: { 'data': [], 'log': [] },
                selectedQueryResults: new Set(),
                graph: { nodes: [], links: [] },
                table: {
                    column: null,
                    display: [],
                    direction: null,
                    activePage: 1,
                    totalPages: 1
                },
            });
            let edges = await findMetaPath(this.state.selectedInput.type,
                this.state.selectedOutput.type);
            console.log('edges', edges);
            this.setState({
                paths: edges
            });
        }
    }

    handleBackToStep1(event) {
        event.preventDefault();
        this.setState({
            currentStep: 1
        })
    }

    async handleStep2Submit(event) {
        event.preventDefault();
        let intermediate_nodes = getIntermediateNodes(this.state.selectedPaths);
        if (intermediate_nodes.length === 0) {
            this.setState({
                step2ShowError: true
            });
        } else {
            this.setState({
                currentStep: 3,
                step2Complete: true,
                resultReady: false,
                table: {
                    column: null,
                    display: [],
                    direction: null,
                    activePage: 1,
                    totalPages: 1
                },
            });
            // let response = await fetchQueryResult(this.state.selectedInput,
            //     this.state.selectedOutput,
            //     intermediate_nodes)
            let q = new query();
            q.meta_kg.ops = q.meta_kg.ops.filter(item => item.query_operation.tags.includes('biothings'));
            let response = await q.query(this.state.selectedInput, this.state.selectedOutput, intermediate_nodes);
            if (response.data.length === 0) {
                this.setState({
                    resultReady: true,
                    step3Complete: true,
                    queryResults: { 'data': [], 'log': [] }
                })
            } else {
                this.setState({
                    queryResults: response,
                    table: {
                        ...this.state.table,
                        display: response['data'].slice(this.state.table.activePage * 10 - 10, this.state.table.activePage * 10),
                        totalPages: Math.ceil(response['data'].length / 10)
                    },
                    resultReady: true,
                    step3Complete: true
                });
            }
        }
    }

    handleBackToStep2(event) {
        event.preventDefault();
        this.setState({
            currentStep: 2
        })
    }

    handleBackToStep3(event) {
        event.preventDefault();
        this.setState({
            currentStep: 3
        })
    }

    handleSort(event) {
        let clickedColumn = event.target.className.split(' ').slice(-1)[0];

        const { column, direction } = this.state.table;

        if (column !== clickedColumn) {
            this.setState({
                table: {
                    ...this.state.table,
                    column: clickedColumn,
                    direction: 'descending',
                },
                queryResults: {
                    ...this.state.queryResults,
                    data: _.sortBy(this.state.queryResults['data'], [clickedColumn])
                }
            });
            return
        }

        this.setState({
            table: {
                ...this.state.table,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
                display: this.state.queryResults['data'].slice(this.state.table.activePage * 10 - 10, this.state.table.activePage * 10),
            },
            queryResults: {
                ...this.state.queryResults,
                data: this.state.queryResults['data'].reverse()
            }
        });
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({
            table: {
                ...this.state.table,
                display: this.state.queryResults['data'].slice(activePage * 10 - 10, activePage * 10),
                activePage: activePage
            }
        });
    }

    render() {
        return (
            <Container className="feature">
                <Navigation name="Explain"></Navigation>
                <AccordionComponent />
                <hr />
                <Steps
                    currentStep={this.state.currentStep}
                    step1Complete={this.state.step1Complete}
                    step2Complete={this.state.step2Complete}
                    step3Complete={this.state.step3Complete}
                    handleBackToStep1={this.handleBackToStep1}
                    handleBackToStep2={this.handleBackToStep2}
                    handleBackToStep3={this.handleBackToStep3}
                />
                <ExplainInput
                    shouldDisplay={this.state.currentStep === 1}
                    showModal={this.state.step1ShowError}
                    handleClose={this.handleStep1Close}
                    handleStep1Submit={this.handleStep1Submit}
                    handleInputSelect={this.handleInputSelect}
                    handleOutputSelect={this.handleOutputSelect}
                />
                <MetaPathForm
                    shouldDisplay={this.state.currentStep === 2}
                    showModal={this.state.step2ShowError}
                    handleClose={this.handleStep2Close}
                    paths={this.state.paths}
                    handleSelect={this.handleMetaPathSelect}
                    handleSubmit={this.handleStep2Submit}
                    handleBackToStep1={this.handleBackToStep1}
                />
                <ExplainQueryResultWrapper
                    shouldDisplay={this.state.currentStep === 3}
                    resultReady={this.state.resultReady}
                    content={this.state.queryResults['data']}
                    table={this.state.table}
                    handleSort={this.handleSort}
                    handlePaginationChange={this.handlePaginationChange}
                    logs={this.state.queryResults['log']}
                    handleSelect={this.handleQueryResultSelect}
                    graph={this.state.graph}
                    ref={this.graphRef}
                    selectedQueryResults={this.state.selectedQueryResults}
                />
            </Container>
        )
    }
}

export default Explain;
