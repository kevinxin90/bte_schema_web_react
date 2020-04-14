import React, { Component } from 'react';
import { Breadcrumb, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import AccordionComponent from './AccordionComponent';
import Steps from './StepsComponent';
import ExplainInput from './ExplainInputComponent';
import MetaPathForm from './MetaPathFormComponent';
import ExplainQueryResult from './ExplainQueryResultComponent';
let _ = require('lodash');

class Explain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step1Active: true,
            step2Active: false,
            step3Active: false,
            step1Complete: false,
            step2Complete: false,
            step3Complete: false,
            resultReady: false,
            selectedInput: {},
            selectedOutput: {},
            paths: [],
            selectedPaths: new Set(),
            queryResults: [],
            queryLog: [],
            table: {
                column: null,
                display: [],
                direction: null,
                activePage: 1,
                totalPages: 1
            },
            selectedQueryResults: new Set(),
            graph: {nodes: [{id: 'kevin'}], links: []},
            showInput: true,
            showMetaPath: false,
            showResult: false,
            showModal: false,
        };
        this.handleStep1Submit = this.handleStep1Submit.bind(this);
        this.handleStep2Submit = this.handleStep2Submit.bind(this);
        this.handleInputSelect = this.handleInputSelect.bind(this);
        this.handleOutputSelect = this.handleOutputSelect.bind(this);
        this.handleMetaPathSelect = this.handleMetaPathSelect.bind(this);
        this.handleQueryResultSelect = this.handleQueryResultSelect.bind(this);
        this.handleBackToStep1 = this.handleBackToStep1.bind(this);
        this.handleBackToStep2 = this.handleBackToStep2.bind(this);
        this.handleBackToStep3 = this.handleBackToStep3.bind(this);
        this.handleClose = this.handleClose.bind(this);
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

    handleMetaPathSelect(event){
        const selectedPaths = this.state.selectedPaths;
        if (event.target.checked) {
            selectedPaths.add(event.target.name)
        } else {
            selectedPaths.delete(event.target.name)
        }
        this.setState({ selectedPaths: selectedPaths })
    }

    handleQueryResultSelect(event){
        const selectedQueryResults = this.state.selectedQueryResults;
        if (event.target.checked) {
            selectedQueryResults.add(event.target.name)
        } else {
            selectedQueryResults.delete(event.target.name)
        }
        const graph = this.recordsToGraph(selectedQueryResults)
        this.setState({ selectedQueryResults: selectedQueryResults,
                        graph: graph })
    }

    handleClose = () => this.setState({
        showModal: false
    })


    handleStep1Submit(event) {
        event.preventDefault();
        if (_.isEmpty(this.state.selectedInput) || _.isEmpty(this.state.selectedOutput)){
            this.setState({
                showModal: true
            });
        } else {
            this.setState({
                step1Active: false,
                step1Complete: true,
                step2Active: true,
                step3Active: false,
                step2Complete: false,
                step3Complete: false,
                selectedPaths: new Set(),
                queryResults: {},
                selectedQueryResults: new Set(),
                graph: {nodes: [{id: 'kevin'}], links: []},
                showInput: false,
                showMetaPath: true,
                showResult: false
            });
            fetch('https://geneanalysis.ncats.io/explorer_api/v1/find_metapath?input_cls=' + this.state.selectedInput.type + '&output_cls=' + this.state.selectedOutput.type)
                .then(response => {
                    if (response.ok) {
                        return response;
                    }
                    else {
                        var error = new Error('Error ' + response.status + ': ' + response.statsText);
                        error.response = response;
                        throw error;
                    }
                },
                error => {
                    var errmess = new Error(error.message);
                    throw errmess;
                })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        paths: response['edges']
                    });
                })
                .catch(error => { console.log('MetaPath could not be found', error.message); alert('Sorry! Metapath could not be found.\nError: '+error.message); });
        }
        
    }

    handleBackToStep1(event) {
        event.preventDefault();
        this.setState({
            step1Active: true,
            step2Active: false,
            step3Active: false,
            showInput: true,
            showMetaPath: false,
            showResult: false
        }) 
    }

    handleStep2Submit(event) {
        event.preventDefault();
        this.setState({
            step2Active: false,
            step2Complete: true,
            step3Active: true,
            showMetaPath: false,
            showResult: true,
            resultReady: false
        })
        let url = new URL('https:/geneanalysis.ncats.io/explorer_api/v1/connect')

        var params = {input_obj: JSON.stringify(this.state.selectedInput),
                      output_obj: JSON.stringify(this.state.selectedOutput),
                      intermediate_nodes: JSON.stringify(['Gene'])} 
        url.search = new URLSearchParams(params).toString();

        fetch(url
        )
            .then(response => {
                if (response.ok) {
                    return response;
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statsText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    queryResults: response['data'],
                    table: {
                        ...this.state.table,
                        display: response['data'].slice(this.state.table.activePage*10 - 10, this.state.table.activePage*10),
                        totalPages: Math.ceil(response['data'].length/10)
                    },
                    queryLog: response['log'],
                    resultReady: true,
                    step3Complete: true
                });
            })
            .catch(error => { console.log('post comments', error.message); alert('Your comment could not be posted\nError: '+error.message); });
    }

    handleBackToStep2(event) {
        event.preventDefault();
        this.setState({
            step1Active: false,
            step2Active: true,
            step3Active: false,
            showInput: false,
            showMetaPath: true,
            showResult: false
        }) 
    }

    handleBackToStep3(event) {
        event.preventDefault();
        this.setState({
            step1Active: false,
            step2Active: false,
            step3Active: true,
            showInput: false,
            showMetaPath: false,
            showResult: true
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
                queryResults: _.sortBy(this.state.queryResults, [clickedColumn])
          });
          return
        }
    
        this.setState({
            table: {
                ...this.state.table,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
                display: this.state.queryResults.slice(this.state.table.activePage*10 - 10, this.state.table.activePage*10),
            },
            queryResults: this.state.queryResults.reverse(),
        });
    }
    
    handlePaginationChange = (e, { activePage }) => {
        this.setState({
            table:{
                ...this.state.table,
                display: this.state.queryResults.slice(activePage*10 - 10, activePage*10),
                activePage: activePage
            }      
        });
    }

    posOrNeg(num) {
        if (num === 0) {
            return 0
        } else if (num % 2 === 0) {
            return 1
        } else {
            return -1
        }
    }

    recordsToGraph(records) {
        records = Array.from(records);
        let graph = {nodes: [{id: 'kevin'}], links: []};
        if (Array.isArray(records) && records.length) {
            graph['nodes'] = [
                {
                    id: records[0].split('||')[0],
                    color: 'green',
                    x: 20,
                    y: 200
                },
                {
                    id: records[0].split('||')[7],
                    color: 'blue',
                    x: 700,
                    y:200
                }
            ]
        };
        for (let i = 0; i < records.length; i++) {
            if (i < 10) {
                let rec = records[i].split('||')
                graph['links'].push({'source': rec[0],
                                     'target': rec[3],
                                     'label': rec[1]})
                graph['links'].push({'source': rec[3],
                                     'target': rec[7],
                                     'label': rec[5]})
                graph['nodes'].push({id: rec[3], color: 'red', x: 360, y: 200 + this.posOrNeg(i) * Math.ceil(i/2) * 30})
            }
        }
        return graph
      }
    render() {
        return (
            <div className="feature">
                <Container>
                <div className="row">
                    <div className="col-12">
                        <Breadcrumb>
                        <Breadcrumb.Section><Link to='/'>Home</Link></Breadcrumb.Section>
                        <Breadcrumb.Divider />
                        <Breadcrumb.Section active>Explain</Breadcrumb.Section>
                        </Breadcrumb>
                    </div>
                    <div className="col-12">
                        <AccordionComponent />
                        
                        <hr />
                    </div>
                </div>
                
                <Steps
                    step1Active={this.state.step1Active}
                    step2Active={this.state.step2Active}
                    step3Active={this.state.step3Active}
                    step1Complete={this.state.step1Complete}
                    step2Complete={this.state.step2Complete}
                    step3Complete={this.state.step3Complete}
                    handleBackToStep1={this.handleBackToStep1}
                    handleBackToStep2={this.handleBackToStep2}
                    handleBackToStep3={this.handleBackToStep3}
                />
                <ExplainInput
                    shouldHide={this.state.showInput}
                    showModal={this.state.showModal}
                    handleClose={this.handleClose}
                    handleStep1Submit={this.handleStep1Submit}
                    handleInputSelect={this.handleInputSelect}
                    handleOutputSelect={this.handleOutputSelect}
                />
                <MetaPathForm
                    shouldHide={this.state.showMetaPath}
                    paths={this.state.paths}
                    handleSelect={this.handleMetaPathSelect}
                    handleSubmit={this.handleStep2Submit}
                    handleBackToStep1={this.handleBackToStep1}
                />
                <ExplainQueryResult
                    shouldHide={this.state.showResult}
                    resultReady={this.state.resultReady}
                    content={this.state.queryResults}
                    table={this.state.table}
                    handleSort={this.handleSort}
                    handlePaginationChange={this.handlePaginationChange}
                    logs={this.state.queryLog}
                    handleSelect={this.handleQueryResultSelect}
                    graph={this.state.graph}
                />
            </Container>
            </div>
        )
    }
}

export default Explain;


