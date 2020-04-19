import React, { Component } from 'react';
import { Breadcrumb, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import AccordionComponent from './PredictHelpComponent';
import Steps from '../../components/StepsComponent';
import PredictInput from './PredictInputComponent';
import MetaPathForm from '../../components/MetaPathFormComponent';
import PredictQueryResult from './PredictQueryResultComponent';
let _ = require('lodash');

class Predict extends Component {

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
            graph: {},
            showInput: true,
            showMetaPath: false,
            showResult: false,
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
        const graph = this.recordsToTreeGraph(selectedQueryResults)
        this.setState({ selectedQueryResults: selectedQueryResults,
                        graph: graph })
    }


    handleStep1Submit(event) {
        event.preventDefault();
        this.setState({
            step1Active: false,
            step1Complete: true,
            step2Active: true,
            step3Active: false,
            step2Complete: false,
            step3Complete: false,
            selectedPaths: new Set(),
            queryResults: [],
            selectedQueryResults: new Set(),
            graph: {},
            showInput: false,
            showMetaPath: true,
            showResult: false
        })
        fetch('https://geneanalysis.ncats.io/explorer_api/v1/find_metapath?input_cls=' + this.state.selectedInput.type + '&output_cls=' + this.state.selectedOutput)
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
            .catch(error => { console.log('find metapath failed', error.message); alert('Find MetaPath Failed.\nError: '+error.message); });
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
        let intermediate_nodes = this.getIntermediateNodes(this.state.selectedPaths);
        if (intermediate_nodes.length === 0) {
            this.setState({
                showModal: true
            });
        } else {
            this.setState({
                step2Active: false,
                step2Complete: true,
                step3Active: true,
                showMetaPath: false,
                showResult: true,
                resultReady: false
            })
            let url = new URL('https://geneanalysis.ncats.io/explorer_api/v1/connect')

            var params = {input_obj: JSON.stringify(this.state.selectedInput),
                        output_obj: JSON.stringify(this.state.selectedOutput),
                        intermediate_nodes: JSON.stringify(intermediate_nodes)} 
            url.search = new URLSearchParams(params).toString();

            fetch(url)
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
                        queryLog: response['log'],
                        table: {
                            ...this.state.table,
                            display: response['data'].slice(this.state.table.activePage*10 - 10, this.state.table.activePage*10),
                            totalPages: Math.ceil(response['data'].length/10)
                        },
                        resultReady: true,
                        step3Complete: true
                    });
                })
                .catch(error => { 
                    console.log('Query returns no hits', error.message);
                    this.setState({
                        resultReady: true,
                        step3Complete: true,
                        queryResults: []
                    })
                });
        }
    }

    getIntermediateNodes(metaPaths) {
        return [...metaPaths].map(x => x.split('-').slice(1)[0])
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

    recordsToTreeGraph(records) {
        records = Array.from(records);
        let tree_dict = {};
        let tree = {children: []}
        if (Array.isArray(records) && records.length) {
          tree['name'] = records[0].split('||')[0];
        };
        for (let i = 0; i < records.length; i++) {
          let rec = records[i].split('||')
          if (!(rec[3] in tree_dict)) {
              tree_dict[rec[3]] = new Set([rec[7]]);
          } else {
              tree_dict[rec[3]].add(rec[7])
          }
        };
        for (const prop in tree_dict) {
            let rec = {name: prop, pathProps: prop, children: []};
            rec['children'] = Array.from(tree_dict[prop]).map(item=>({name: item, children: []}));
            tree['children'].push(rec);
        }
        return tree
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
                        <Breadcrumb.Section active>Predict</Breadcrumb.Section>
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
                <PredictInput
                    shouldHide={this.state.showInput}
                    handleStep1Submit={this.handleStep1Submit}
                    handleInputSelect={this.handleInputSelect}
                    handleOutputSelect={this.handleOutputSelect}
                />
                <MetaPathForm
                    shouldHide={this.state.showMetaPath}
                    showModal={this.state.showModal}
                    paths={this.state.paths}
                    handleSelect={this.handleMetaPathSelect}
                    handleSubmit={this.handleStep2Submit}
                    handleBackToStep1={this.handleBackToStep1}
                />
                <PredictQueryResult
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

export default Predict;