import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import AccordionComponent from './PredictHelpComponent';
import Steps from '../../components/StepsComponent';
import PredictInput from './PredictInputComponent';
import {PredictMetapath} from '../../components/PredictMetapath';
import PredictQueryResult from './PredictQueryResultComponent';
import {recordsToTreeGraph, getIntermediateNodes, findMetaPath, fetchQueryResult} from '../../shared/utils';

let _ = require('lodash');

class Predict extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            step1Complete: false,
            step2Complete: false,
            step3Complete: false,
            step1ShowError: false,
            step2ShowError: false,
            step2ShowBranchError: false,
            filterError: false,
            filterSuccess: false,
            selectedInput: {},
            selectedOutput: {},
            availableIntermediates: [], // change to availableIntermediates
            branches: [], // moving state up
            numBranches: 1,
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
        };
        this.handleStep1Submit = this.handleStep1Submit.bind(this);
        this.handleStep2Submit = this.handleStep2Submit.bind(this);
        this.handleInputSelect = this.handleInputSelect.bind(this);
        this.handleOutputSelect = this.handleOutputSelect.bind(this);
    //    this.handleMetaPathSelect = this.handleMetaPathSelect.bind(this);
        this.handleQueryResultSelect = this.handleQueryResultSelect.bind(this);
        this.handleBackToStep1 = this.handleBackToStep1.bind(this);
        this.handleBackToStep2 = this.handleBackToStep2.bind(this);
        this.handleBackToStep3 = this.handleBackToStep3.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleStep1Close = this.handleClose.bind(this, 'step1ShowError');
        this.handleStep2Close = this.handleClose.bind(this, 'step2ShowError');
        this.handleStep2BranchClose = this.handleClose.bind(this, 'step2ShowBranchError')
        this.handleAddBranch = this.handleAddBranch.bind(this);
        this.handleAddInter = this.handleAddInter.bind(this);
        this.handleRemoveBranch = this.handleRemoveBranch.bind(this);
        this.handleMergeBranches = this.handleMergeBranches.bind(this);
        this.handleContinueBranches = this.handleContinueBranches.bind(this);
        this.handleAddFilter = this.handleAddFilter.bind(this);
        this.handleFilterClose = this.handleFilterClose.bind(this);
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

  /*  handleMetaPathSelect(event){
        const selectedPaths = this.state.selectedPaths;
        if (event.target.checked) {
            selectedPaths.add(event.target.name)
        } else {
            selectedPaths.delete(event.target.name)
        }
        this.setState({ selectedPaths: selectedPaths })
    }
*/


    handleQueryResultSelect(event){
        const selectedQueryResults = this.state.selectedQueryResults;
        if (event.target.checked) {
            selectedQueryResults.add(event.target.name)
        } else {
            selectedQueryResults.delete(event.target.name)
        }
        const graph = recordsToTreeGraph(selectedQueryResults)
        this.setState({ selectedQueryResults: selectedQueryResults,
                        graph: graph })
    }

    handleClose = (item) => this.setState({
        [item]: false
    })

    async handleStep1Submit(event) {
        event.preventDefault();
        if (_.isEmpty(this.state.selectedInput) || _.isEmpty(this.state.selectedOutput)){
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
                queryResults: [],
                selectedQueryResults: new Set(),
                graph: {},
            })
            let edges = await findMetaPath(this.state.selectedInput.type,
                this.state.selectedOutput);
            this.setState({
                availableIntermediates: edges,
                branches: [{ id: this.state.numBranches, source:this.state.selectedInput, 
                             output:this.state.selectedOutput, intermediates:[], availableInters:edges, filters:[{}]}]
            });
        }
    }

    handleBackToStep1(event) {
        event.preventDefault();
        this.setState({
            currentStep: 1
        })  
    }

    checkBranches() {
        var sameInters = [];
        if (this.state.branches.length === 0 || this.state.branches.length === 1) return sameInters;
        for (var i = 0; i < this.state.branches.length - 1; i++){
            for (var j = i+1; j < this.state.branches.length; j++){
                var inters1 = JSON.stringify(this.state.branches[i].intermediates);
                var inters2 = JSON.stringify(this.state.branches[j].intermediates);
                if (inters1 === inters2){
                    sameInters.push({branch1: this.state.branches[i].id, branch2: this.state.branches[j].id})
                }
            }
        }
        return sameInters;
    }

    handleAddBranch(event) {
        event.preventDefault();
        if (this.state.numBranches >= 3) return;
        this.setState(prevState => ({
            branches: [...prevState.branches, { id: this.state.numBranches + 1, source:this.state.selectedInput,
                                output:this.state.selectedOutput, intermediates:[], 
                                availableInters:this.state.availableIntermediates, filters:[{}]}],
            numBranches: prevState.numBranches + 1
        }));
    }

    async handleAddInter(event, branch, node) {
        event.preventDefault();
        if (branch.intermediates.length === 2) return;
        let edges = await findMetaPath(node, this.state.selectedOutput);
        let tempBranches = this.state.branches;
        tempBranches[branch.id - 1].intermediates.push(node);
        tempBranches[branch.id - 1].availableInters = edges;
        if (branch.intermediates.length === 1){
            tempBranches[branch.id - 1].filters.splice(0,0,{});
        } else if (branch.intermediates.length === 2) {
            tempBranches[branch.id - 1].filters.splice(1,0,{});
        }
        this.setState({ branches: tempBranches });
    }

    // count param in filter may not matter, filters all default to 50 w/o count
    handleAddFilter(event, branch, filter) {
        event.preventDefault();
        if (!('name' in filter) || !('loc' in filter) || !('count' in filter)) {
            this.setState({
                filterError: true
            });
        } else {
            let tempBranches = this.state.branches;
            tempBranches[branch.id - 1].filters[filter['loc']] = filter;
            delete tempBranches[branch.id - 1].filters[filter['loc']].loc;
            this.setState({
                branches: tempBranches,
                filterError: false,
                filterSuccess: true
            });
        }
    }

    handleFilterClose(event) {
        event.preventDefault();
        this.setState({ filterSuccess: false,
                        filterError: false });
    }

    handleRemoveBranch(event, branch) {
        event.preventDefault();
        if (this.state.numBranches === 1) return;
        var array = [...this.state.branches];
        array.splice(branch.id - 1, 1);
        for(let i = 0; i < array.length; i++) {
            array[i].id = i+1;
        }
        this.setState(prevState => ({
            branches: array,
            numBranches: prevState.numBranches - 1
        }));
    }

    handleMergeBranches(event) {
        event.preventDefault();
        const sames = this.checkBranches();
        if (sames.length === 1) {
            this.handleRemoveBranch(event, sames[0]['branch2']);
        } else { // all 3 branches are the same
            let branch = this.state.branches[0];
            this.setState({
                branches: [branch]
            })
        }
    }

    async handleContinueBranches(event) {
        event.preventDefault();
        this.handleMergeBranches(event);
        await this.handleStep2BranchClose(event);
        this.handleStep2Submit(event);
    }

    async handleStep2Submit(event) {
        event.preventDefault();

        if (this.checkBranches().length !== 0){
            this.setState({
                step2ShowBranchError: true
            });
        }else{

            // what is the format for intermediate nodes here? 2d array?
            let intermediate_nodes = getIntermediateNodes(this.state.selectedPaths);
            if (intermediate_nodes.length === 0) {
                this.setState({
                    step2ShowError: true
                });
            } else {
                this.setState({
                    currentStep: 3,
                    step2Complete: true
                })
                let response = await fetchQueryResult(this.state.selectedInput,
                    this.state.selectedOutput,
                    intermediate_nodes)
                if (response.data.length === 0) {
                    this.setState({
                        step3Complete: true,
                        queryResults: []
                    })
                } else {
                    this.setState({
                        queryResults: response['data'],
                        table: {
                            ...this.state.table,
                            display: response['data'].slice(this.state.table.activePage*10 - 10, this.state.table.activePage*10),
                            totalPages: Math.ceil(response['data'].length/10)
                        },
                        queryLog: response['log'],
                        step3Complete: true
                    });
                }
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

    render() {
        const branchCheck = this.checkBranches();

        return (
            <Container className="feature">
                <Navigation name="Predict" />
                <AccordionComponent />
                <Steps
                    currentStep={this.state.currentStep}
                    step1Complete={this.state.step1Complete}
                    step2Complete={this.state.step2Complete}
                    step3Complete={this.state.step3Complete}
                    handleBackToStep1={this.handleBackToStep1}
                    handleBackToStep2={this.handleBackToStep2}
                    handleBackToStep3={this.handleBackToStep3}
                />
                <PredictInput
                    shouldDisplay={this.state.currentStep === 1}
                    showModal={this.state.step1ShowError}
                    handleClose={this.handleStep1Close}
                    handleStep1Submit={this.handleStep1Submit}
                    handleInputSelect={this.handleInputSelect}
                    handleOutputSelect={this.handleOutputSelect}
                />
                <PredictMetapath
                    shouldDisplay={this.state.currentStep === 2}
                    showModal={this.state.step2ShowError}
                    handleClose={this.handleStep2Close}
                    paths={this.state.paths}
                    //handleSelect={this.handleMetaPathSelect}
                    handleSubmit={this.handleStep2Submit}
                    handleBackToStep1={this.handleBackToStep1}
                    // added
                    showBranchModal={this.state.step2ShowBranchError}
                    handleBranchClose={this.handleStep2BranchClose}
                    selectedInput={this.state.selectedInput}
                    selectedOutput={this.state.selectedOutput}
                    addBranch={this.handleAddBranch}
                    branches={this.state.branches}
                    addInter={this.handleAddInter}
                    branchCheck={branchCheck}
                    removeBranch={this.handleRemoveBranch}
                    handleContinueBranches={this.handleContinueBranches}
                    addFilter={this.handleAddFilter}
                    filterError={this.state.filterError}
                    filterSuccess={this.state.filterSuccess}
                    closeFilter={this.handleFilterClose}
                />
                <PredictQueryResult
                    shouldDisplay={this.state.currentStep === 3}
                    resultReady={this.state.step3Complete}
                    content={this.state.queryResults}
                    table={this.state.table}
                    handleSort={this.handleSort}
                    handlePaginationChange={this.handlePaginationChange}
                    logs={this.state.queryLog}
                    handleSelect={this.handleQueryResultSelect}
                    graph={this.state.graph}
                />
            </Container>        
        )
    }
}

export default Predict;