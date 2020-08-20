import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import AccordionComponent from '../../components/AccordionComponent';
import Steps from '../../components/StepsComponent';
import ExplainInput from './ExplainInputComponent';
import { MetaPathForm } from '../../components/MetaPathFormComponent';
import ExplainQueryResult from './ExplainQueryResultComponent';
import { getIntermediateNodes, findMetaPath, getFieldOptions, getFilteredResults, getPublicationLink } from '../../shared/utils';
import query from "@biothings-explorer/explain";

let _ = require('lodash');

//forward ref so we can call addConnection and deleteConnection in CytoscapeGraphComponent from this component
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
            step2Loading: false,
            step3Loading: false,
            resultReady: false,
            selectedInput: [],
            selectedOutput: [],
            paths: [],
            selectedPaths: new Set(),
            queryResults: { 'data': {'result': []}, 'log': [] },
            resolvedIds: {},
            filteredResults: [],
            filter: {
                pred1: new Set(),
                pred1_api: new Set(),
                node1_label: new Set(),
                node1_type: new Set(),
                pred2: new Set(),
                pred2_api: new Set()
            },
            filterOptions: {},
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
        this.handleFilterSelect = this.handleFilterSelect.bind(this);
        this.export = this.export.bind(this);
    };

    // handle calculating of metapaths and querying of results

    // use setTimeout and window.requestAnimationFrame to ensure 
    // that there has been a visual update before performing expensive computation tasks
    // (otherwise it freezes for a moment)
    componentDidUpdate() {
        setTimeout(() => {
            window.requestAnimationFrame(() => {
                if (this.state.step2Loading) {
                    findMetaPath(this.state.selectedInput, this.state.selectedOutput).then((edges) => {
                        console.log(edges);
                        this.setState({
                            paths: edges,
                            step2Loading: false,
                        });
                    });
                } else if (this.state.step3Loading) {
                    let intermediate_nodes = getIntermediateNodes(this.state.selectedPaths);
                    let q = new query();
                    q.meta_kg.ops = q.meta_kg.ops.filter(item => item.query_operation.tags.includes('biothings'));
                    q.query(this.state.selectedInput, this.state.selectedOutput, intermediate_nodes).then((response) => {
                        if (response.data.length === 0) {
                            this.setState({
                                resultReady: true,
                                step3Loading: false,
                                step3Complete: true,
                                queryResults: { 'data': {'result': []}, 'log': [] },
                            })
                        } else {
                            this.setState({
                                resolvedIds: response.data.resolved_ids,
                                queryResults: response,
                                filteredResults: response.data.result,
                                table: {
                                    ...this.state.table,
                                    display: response.data.result.slice(0, 10),
                                    activePage: 1,
                                    totalPages: Math.ceil(response.data.result.length / 10)
                                },
                                filter: { // reset filter on new search
                                    pred1: new Set(),
                                    pred1_api: new Set(),
                                    node1_label: new Set(),
                                    node1_type: new Set(),
                                    pred2: new Set(),
                                    pred2_api: new Set()
                                },
                                filterOptions: {
                                    pred1: getFieldOptions(response.data.result, 'pred1'),
                                    pred1_api: getFieldOptions(response.data.result, 'pred1_api'),
                                    node1_label: getFieldOptions(response.data.result, 'node1_label'),
                                    node1_type: getFieldOptions(response.data.result, 'node1_type'),
                                    pred2: getFieldOptions(response.data.result, 'pred2'),
                                    pred2_api: getFieldOptions(response.data.result, 'pred2_api'),
                                },
                                resultReady: true,
                                step3Loading: false,
                                step3Complete: true
                            });
                        }
                    });
                }
            });
        });
    }

    //this function will be passed to autocomplete component
    //in order to retrieve the selected input
    handleInputSelect(value) {
        this.setState({
            selectedInput: value.map(v => v.data)
        });
    }

    //this function will be passed to autocomplete component
    //in order to retrieve the selected output
    handleOutputSelect(value) {
        this.setState({
            selectedOutput: value.map(v => v.data)
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

    handleFilterSelect(event, data) {
        const filter = this.state.filter;
        if (data.checked) {
            filter[data.name].add(data.label);
        } else {
            filter[data.name].delete(data.label);
        }

        this.updateTable(filter);
        this.setState({ filter: filter });
    }

    //update table when filter is modified
    updateTable(newFilter) {
        const newFilteredResults = getFilteredResults(this.state.queryResults.data.result, newFilter);
        this.setState({
            filteredResults: newFilteredResults,
            table: {
                column: null,
                display: newFilteredResults.slice(0, 10),
                totalPages: Math.ceil(newFilteredResults.length / 10),
                direction: null,
                activePage: 1,
            }
        });
    }

    handleQueryResultSelect(event, data) {
        const selectedQueryResults = this.state.selectedQueryResults;
        if (data.checked) {
            selectedQueryResults.add(data.name);
            console.log(data.data);
            this.graphRef.current.addConnection(data.data, this.state.queryResults.data.resolved_ids);
        } else {
            selectedQueryResults.delete(data.name);
            this.graphRef.current.deleteConnection(data.data);
        }
        this.setState({
            selectedQueryResults: selectedQueryResults,
        });
    }

    handleClose = (item) => this.setState({
        [item]: false
    })

    handleStep1Submit(event) {
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
                step2Loading: true,
                selectedPaths: new Set(),
                queryResults: { 'data': {'result': []}, 'log': [] },
                selectedQueryResults: new Set(),
            });
        }
    }

    handleBackToStep1(event) {
        event.preventDefault();
        this.setState({
            currentStep: 1
        })
    }

    handleStep2Submit(event) {
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
                step3Loading: true,
                resultReady: false,
                table: {
                    column: null,
                    display: [],
                    direction: null,
                    activePage: 1,
                    totalPages: 1
                },
            });
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

        let new_data;
        if (column !== clickedColumn) { //sort new column
            if (clickedColumn.includes("publications")) {//sort publications by length and everything else by alphabetical order
                new_data = _.sortBy(this.state.filteredResults, [function (result) { return _.get(result[clickedColumn], 'length', 0) }]);
            } else {
                new_data = _.sortBy(this.state.filteredResults, [clickedColumn]);
            }

            this.setState({
                table: {
                    ...this.state.table,
                    column: clickedColumn,
                    direction: 'ascending',
                    display: new_data.slice(this.state.table.activePage * 10 - 10, this.state.table.activePage * 10),
                },
                filteredResults: new_data,
            });
        } else { //reverse sorted column
            new_data = this.state.filteredResults.reverse()
            this.setState({
                table: {
                    ...this.state.table,
                    direction: direction === 'ascending' ? 'descending' : 'ascending',
                    display: this.state.filteredResults.slice(this.state.table.activePage * 10 - 10, this.state.table.activePage * 10),
                },
                filteredResults: new_data
            });
        }
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({
            table: {
                ...this.state.table,
                display: this.state.filteredResults.slice(activePage * 10 - 10, activePage * 10),
                activePage: activePage
            }
        });
    }

    //export table as a csv file
    export = () => {
        if (this.state.filteredResults.length === 0) {
            console.log("No results to export.");
            return;
        }

        //assemble csv content
        let colNames = Object.keys(this.state.filteredResults[0]);
        let tableContent = this.state.filteredResults.map((result) => {
            return Object.keys(result).map((key) => {
                if (key.includes("publications")) {
                    return getPublicationLink(result[key]); //map publication to publication link
                } else {
                    return result[key];
                }
            }).join(',');
        });
        let csvContent = [colNames, ...tableContent].join('\n');

        //download content as a csv file
        let blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        if (navigator.msSaveBlob) { //for IE 
            navigator.msSaveBlob(blob, "table.csv");
        } else { //all other browsers
            let link = document.createElement("a");
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", "table.csv"); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        return null;
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
                    isLoading={this.state.step2Loading}
                    handleClose={this.handleStep2Close}
                    paths={this.state.paths}
                    selectedPaths={this.state.selectedPaths}
                    handleSelect={this.handleMetaPathSelect}
                    handleSubmit={this.handleStep2Submit}
                    handleBackToStep1={this.handleBackToStep1}
                />
                <ExplainQueryResultWrapper
                    shouldDisplay={this.state.currentStep === 3}
                    resultReady={this.state.resultReady}
                    export={this.export}
                    content={this.state.queryResults.data.result}
                    equivalentIds={this.state.queryResults.data.resolved_ids}
                    table={this.state.table}
                    filter={this.state.filter}
                    filterOptions={this.state.filterOptions}
                    handleFilterSelect={this.handleFilterSelect}
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
