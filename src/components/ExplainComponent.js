import React, { Component } from 'react';
//import { BreadcrumbItem, Breadcrumb } from 'reactstrap';
import { Breadcrumb } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import AccordionComponent from './AccordionComponent';
import Steps from './StepsComponent';
import ExplainInput from './ExplainInputComponent';
import MetaPathForm from './MetaPathFormComponent';
import ExplainQueryResult from './ExplainQueryResultComponent';

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
            queryResults: {},
            selectedQueryResults: new Set(),
            graph: {nodes: [{id: 'kevin'}], links: []},
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
            queryResults: {},
            selectedQueryResults: new Set(),
            graph: {nodes: [{id: 'kevin'}], links: []},
            showInput: false,
            showMetaPath: true,
            showResult: false
        })
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
            .catch(error => { console.log('post comments', error.message); alert('Your comment could not be posted\nError: '+error.message); });
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

    recordsToGraph(records) {
        records = Array.from(records);
        let graph = {nodes: [{id: 'kevin'}], links: []};
        if (Array.isArray(records) && records.length) {
          graph['nodes'] = [{id: records[0].split('||')[0], color: 'green'},
                            {id: records[0].split('||')[14], color: 'blue'}]
        };
        for (let i = 0; i < records.length; i++) {
          let rec = records[i].split('||')
          graph['links'].push({'source': rec[0],
                               'target': rec[7],
                               'label': rec[2]})
          graph['links'].push({'source': rec[7],
                               'target': rec[14],
                               'label': rec[9]})
          graph['nodes'].push({id: rec[7], color: 'red'})
        }
        return graph
      }
    render() {
        return (
            <div className="container">
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
                    handleSelect={this.handleQueryResultSelect}
                    graph={this.state.graph}
                />
            </div>
        )
    }
}

export default Explain;


