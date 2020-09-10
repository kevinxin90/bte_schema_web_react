import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import AccordionComponent from './PredictHelpComponent';
import Steps from '../../components/StepsComponent';
import PredictInput from './PredictInputComponent';
import { PredictMetapath } from '../../components/PredictMetapath';
import PredictQueryResult from './PredictQueryResultComponent';
import { recordsToTreeGraph, findSmartAPIEdgesByInputAndOutput, findPredicates, findNext } from '../../shared/utils';
import { queryAPIs } from '../../shared/query';

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
            filterPredError: false,
            filterCountError: false,
            filterSuccess: false,
            selectedInput: {},
            // selectedOutput: {},
            availablePaths: [], //initial available paths
            initialPredicates: [],
            branches: [],
            smartapiEdges: [],
            numBranches: 1,
            // selectedPaths: new Set(),
            queryResults: [],
            queryLog: [],
            table: {
                column: null,
                display: [],
                direction: null,
                activePage: 1,
                totalPages: 1
            },
            filteredResults: [],
            filter: {
                pred1: new Set(),
                pred1_api: new Set(),
                node1_name: new Set(),
                node1_type: new Set(),
                pred2: new Set(),
                pred2_api: new Set()
            },
            filterOptions: {},
            selectedQueryResults: new Set(),
            graph: {},
            result: [],
            
        };
        this.handleStep1Submit = this.handleStep1Submit.bind(this);
        this.handleStep2Submit = this.handleStep2Submit.bind(this);
        this.handleInputSelect = this.handleInputSelect.bind(this);
        //    this.handleOutputSelect = this.handleOutputSelect.bind(this);
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
        this.handleAddNode = this.handleAddNode.bind(this);
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

    handleMetaPathSelect(event) {

        const selectedPaths = this.state.selectedPaths;
        if (event.target.checked) {
            selectedPaths.add(event.target.name)
        } else {
            selectedPaths.delete(event.target.name)
        }
        this.setState({ selectedPaths: selectedPaths })
    }


    handleQueryResultSelect(event) {
        const selectedQueryResults = this.state.selectedQueryResults;
        if (event.target.checked) {
            selectedQueryResults.add(event.target.name)
        } else {
            selectedQueryResults.delete(event.target.name)
        }
        const graph = recordsToTreeGraph(selectedQueryResults)
        this.setState({
            selectedQueryResults: selectedQueryResults,
            graph: graph
        })
    }

    handleClose = (item) => this.setState({
        [item]: false
    })

    async handleStep1Submit(event) {
        event.preventDefault();
        if (_.isEmpty(this.state.selectedInput)) /* || _.isEmpty(this.state.selectedOutput)) */ {
            this.setState({
                step1ShowError: true
            });
        } else {
            this.setState({
                currentStep: 2,
                step1Complete: true,
                step2Complete: false,
                step3Complete: false,
                //selectedPaths: new Set(),
                queryResults: [],
                selectedQueryResults: new Set(),
                graph: {},
            })
            //let edges = await findMetaPath(this.state.selectedInput.type, this.state.selectedOutput);
            //let preds = Array.from(await findPredicates(this.state.selectedInput.type, this.state.selectedOutput));
            let availableNext = Array.from(await findNext(this.state.selectedInput.type));
            this.setState({
                //    availableIntermediates: edges,
                //    initialPredicates: preds,
                availablePaths: availableNext,
                branches: [{
                    id: this.state.numBranches, source: this.state.selectedInput,
                    path: [], availablePaths: availableNext, filters: [], predicates: []
                }]
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
        var sames = [];
        var noPath = [];
        if (this.state.branches.length === 0 || this.state.branches.length === 1) return [sames, noPath];
        for (let i = 0; i < this.state.branches.length - 1; i++) {
            for (let j = i + 1; j < this.state.branches.length; j++) {
                let path1 = JSON.stringify(this.state.branches[i].path);
                let path2 = JSON.stringify(this.state.branches[j].path);
                let filters1 = JSON.stringify(this.state.branches[i].filters);
                let filters2 = JSON.stringify(this.state.branches[j].filters);
                if (path1 === path2 && filters1 === filters2) {
                    sames.push({ branch1: this.state.branches[i].id, branch2: this.state.branches[j].id })
                }
            }
        }
        for (let i = 0; i < this.state.branches.length; i++) {
            if (this.state.branches[i].path.length === 0) {
                noPath.push(this.state.branches[i]);
            }
        }
        return [sames, noPath];
    }

    handleAddBranch(event) {
        event.preventDefault();
        if (this.state.numBranches >= 3) return;
        this.setState(prevState => ({
            branches: [...prevState.branches, {
                id: this.state.numBranches + 1, source: this.state.selectedInput,
                path: [], availablePaths: this.state.availablePaths, filters: [], predicates: []
            }],
            numBranches: prevState.numBranches + 1
        }));
    }

    // originally handleAddInter
    async handleAddNode(event, branch, node) {
        event.preventDefault();
        if (branch.path.length === 3) return;
        let edges = Array.from(await findNext(node));
        var preds;
        if (branch.path.length === 0) {
            preds = Array.from(await findPredicates(this.state.selectedInput.type, node));
        } else {
            preds = Array.from(await findPredicates(branch.path[branch.path.length - 1], node));
        }
        let tempBranches = this.state.branches;
        tempBranches[branch.id - 1].path.push(node);
        tempBranches[branch.id - 1].availablePaths = edges;
        tempBranches[branch.id - 1].filters.push({});
        tempBranches[branch.id - 1].predicates.push(preds);
        this.setState({ branches: tempBranches });
    }

    // count param in filter may not matter, filters all default to 50 w/o count
    handleAddFilter(event, branch, filter, label) {
        event.preventDefault();
        if (!('name' in filter) || !('loc' in filter) || !('count' in filter)) {
            this.setState({
                filterError: true
            });
        } else if (filter['name'] === 'EdgeLabel (predicate)' && label.length === 0) {
            this.setState({
                filterPredError: true
            });
        } else if (filter['count'] <= 0) {
            this.setState({
                filterCountError: true
            });
        } else {
            let tempBranches = this.state.branches;
            tempBranches[branch.id - 1].filters[filter['loc']] = filter;
            if (filter['name'] === 'EdgeLabel (predicate)') {
                tempBranches[branch.id - 1].filters[filter['loc']]['label'] = label;
            }
            delete tempBranches[branch.id - 1].filters[filter['loc']].loc;
            this.setState({
                branches: tempBranches,
                filterError: false,
                filterPredError: false,
                filterCountError: false,
                filterSuccess: true
            });
        }
    }

    handleFilterClose(event) {
        event.preventDefault();
        this.setState({
            filterSuccess: false,
            filterError: false,
            filterPredError: false,
            filterCountError: false
        });
    }

    handleRemoveBranch(event, branch) {
        event.preventDefault();
        if (this.state.numBranches === 1) {
            this.setState({
                branches: [{
                    id: this.state.numBranches, source: this.state.selectedInput,
                    path: [], availablePaths: this.state.availablePaths, filters: [], predicates: []
                }]
            });
        } else{
            var array = [...this.state.branches];
            array.splice(branch.id - 1, 1);
            for (let i = 0; i < array.length; i++) {
                array[i].id = i + 1;
            }
            this.setState(prevState => ({
                branches: array,
                numBranches: prevState.numBranches - 1
            }));
        }
    }

    handleMergeBranches(event) {
        event.preventDefault();
        const sames = this.checkBranches()[0];
        const noPath = this.checkBranches()[1];
        if (sames.length === 1) {
            this.handleRemoveBranch(event, sames[0]['branch2']);
        } else { // all 3 branches are the same
            let branch = this.state.branches[0];
            this.setState({
                branches: [branch]
            });
        }
        for (let i = 0; i < noPath.length; i++) {
            this.handleRemoveBranch(event, noPath[i]);
        }
    }

    async handleContinueBranches(event) {
        event.preventDefault();
        this.handleMergeBranches(event);
        await this.handleStep2BranchClose(event);
        console.log(this.state.branches);
        this.handleStep2Submit(event);
    }

    async handleStep2Submit(event) {
        event.preventDefault();

        if (this.state.branches.length === 1 && this.state.branches[0].path.length === 0) {
            this.setState({
                step2ShowError: true
            });
        } else if (this.checkBranches()[0].length !== 0 || this.checkBranches()[1].length !== 0) {
            this.setState({
                step2ShowBranchError: true
            });
        } else {

            this.setState({
                currentStep: 3,
                step2Complete: true,
                queryResults: [],
                filteredResults: [],
                table: {
                    ...this.state.table,
                    display: [],
                    totalPages: [],
                    activePage: []
                },
                queryLog: [],
                step3Complete: true,
            });

            const levels = Math.max(...this.state.branches.map(branch => branch.path.length));
            let input = this.state.selectedInput;
            let queryResults = [];
            let next_input = [];
            let tempReady = new Array(this.state.branches.length).fill(false);
            for (let i = 0; i < levels; i++) { // for each level...
                let edges = []
                let result = [];
                
                console.log(i);
                
                for (let branch = 0; branch < this.state.branches.length; branch++) {
                    if (this.state.branches[branch].path.length >= i + 1) { // if the level exists in the branch
                        if (i === 0) { // level 1 use input
                            edges = findSmartAPIEdgesByInputAndOutput(input.type, this.state.branches[branch].path[i]);
                            result = await queryAPIs(edges, [input]);
                            queryResults.push([result[0]]);
                            next_input.push(result[1]);
                            console.log('first');
                        
                        } else { // other level use prev level's outputs
                            edges = findSmartAPIEdgesByInputAndOutput(this.state.branches[branch].path[i-1], this.state.branches[branch].path[i]);
                            result = await queryAPIs(edges, next_input[branch]);
                            next_input[branch] = result[1];
                            queryResults[branch].push(result[0]);
                        }
                        if (this.state.branches[branch].path.length === i + 1) { // if it is the last level for the branch
                            tempReady[branch] = true;
                            console.log('last level')
                        }
                    }
                }

                console.log(queryResults);
                let display = []
                let totalPages = []
                let activePage = []
                for (let branch = 0; branch < queryResults.length; branch++) {
                    let d = [], t = [], a = [];
                    for (let level = 0; level < queryResults[branch].length; level++) {
                        d.push(queryResults[branch][level].slice(0,5));
                        a.push(1);
                        t.push(Math.ceil(queryResults[branch][level].length / 5))
                    }
                    display.push(d);
                    totalPages.push(t);
                    activePage.push(a);
                }

                this.setState({
                    queryResults: queryResults,
                    filteredResults: queryResults,
                    table: {
                        ...this.state.table,
                        display: display,
                        activePage: activePage,
                        totalPages: totalPages
                    },
                    filter: { // reset filter on new search
                        pred1: new Set(),
                        pred1_api: new Set(),
                    },
                    resultReady: true, // these 2 might not be needed/used?
                    step3Complete: true
                });
                
            }

            /*
            let edges = findSmartAPIEdgesByInputAndOutput('Gene', 'Disease');
            let queryResults = await queryAPIs(edges, [this.state.selectedInput])
            this.setState({
                queryResults: queryResults,
                filteredResults: queryResults,
                table: {
                    ...this.state.table,
                    display: queryResults.slice(0, 10),
                    activePage: 1,
                    totalPages: Math.ceil(queryResults.length / 10)
                },
                filter: { // reset filter on new search
                    pred1: new Set(),
                    pred1_api: new Set(),
                },
                resultReady: true,
                step3Complete: true
            })
            */
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
                display: this.state.queryResults.slice(this.state.table.activePage * 10 - 10, this.state.table.activePage * 10),
            },
            queryResults: this.state.queryResults.reverse(),
        });
    }

    handlePaginationChange = (e, { activePage }, branch, level) => {

        let display = this.state.table.display;
        let active = this.state.table.activePage;

        display[branch][level] = this.state.queryResults[branch][level].slice(activePage * 5 - 5, activePage * 5);
        active[branch][level] = activePage;

        this.setState({
            table: {
                ...this.state.table,
                display: display,
                activePage: active
            }
        });
    }

    render() {
        const branchCheck = this.checkBranches();
        console.log(branchCheck);

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
                    //paths={this.state.paths}
                    //handleSelect={this.handleMetaPathSelect}
                    handleSubmit={this.handleStep2Submit}
                    handleBackToStep1={this.handleBackToStep1}
                    // added
                    showBranchModal={this.state.step2ShowBranchError}
                    handleBranchClose={this.handleStep2BranchClose}
                    selectedInput={this.state.selectedInput}
                    //selectedOutput={this.state.selectedOutput}
                    addBranch={this.handleAddBranch}
                    branches={this.state.branches}
                    addNode={this.handleAddNode}
                    branchCheck={branchCheck}
                    removeBranch={this.handleRemoveBranch}
                    handleContinueBranches={this.handleContinueBranches}
                    addFilter={this.handleAddFilter}
                    filterError={this.state.filterError}
                    filterPredError={this.state.filterPredError}
                    filterCountError={this.state.filterCountError}
                    filterSuccess={this.state.filterSuccess}
                    closeFilter={this.handleFilterClose}
                />
                <PredictQueryResult
                    shouldDisplay={this.state.currentStep === 3}


                    table={this.state.table}
                    filter={this.state.filter}
                    filterOptions={this.state.filterOptions}
                    selectedQueryResults={this.state.selectedQueryResults}
                    queryResults={this.state.queryResults}
                    branches={this.state.branches}
                    // smartapiEdges={this.state.smartapiEdges}
                    
                    source={this.state.selectedInput}
                    handleSort={this.handleSort}
                    handlePaginationChange={this.handlePaginationChange}
                    logs={this.state.queryLog}
                    handleSelect={this.handleQueryResultSelect}
                />
            </Container>
        )
    }
}

export default Predict;