import React, { Component } from 'react';
import AutoComplete from '../../components/AutoCompleteComponent';
import { Form, Button, Segment, Popup } from 'semantic-ui-react'
import ErrorMessage from '../../components/DisplayErrorComponent';

export default class ExplainInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            autocomplete1: {
                isLoading: false,
                results: [],
                value: ''
            },
            autocomplete2: {
                isLoading: false,
                results: [],
                value: ''
            }
        };
        this.handleSearchChange1 = this.handleSearchChange1.bind(this);
        this.handleSearchChange2 = this.handleSearchChange2.bind(this);
    }
    

    handleSearchChange1 = (e, { value }) => {
        this.setState({
            autocomplete1: {
                ...this.state.autocomplete1,
                isLoading: true,
                value
            }
        })
        fetch('https://geneanalysis.ncats.io/explorer_api/v1/hint?q=' + value)
        .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return {}
        }})
        .then(response => {
            var new_response = {};
            for (var semantic_type in response) {
                if (response[semantic_type].length > 0) {
                new_response[semantic_type] = {name: semantic_type, results: []};
                var content = response[semantic_type].map(function(record, i) {
                    return {
                        ...record, 
                        'title': record['name'], 
                        'description': record['display'],
                        'key': record['name'] + i.toString()
                    }
                });
                new_response[semantic_type]['results'] = content;
                }
            }
            this.setState({
                autocomplete1: {
                    ...this.state.autocomplete1,
                    isLoading: false,
                    results: new_response
                }
            })
        })
    }

    handleSearchChange2 = (e, { value }) => {
        this.setState({
            autocomplete2: {
                ...this.state.autocomplete1,
                isLoading: true,
                value
            }
        })
        fetch('https://geneanalysis.ncats.io/explorer_api/v1/hint?q=' + value)
        .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return {}
        }})
        .then(response => {
            var new_response = {};
            for (var semantic_type in response) {
                if (response[semantic_type].length > 0) {
                new_response[semantic_type] = {name: semantic_type, results: []};
                var content = response[semantic_type].map(function(record, i) {
                    return {
                    ...record, 
                    'title': record['name'], 
                    'description': record['display'],
                    'key': record['name'] + i.toString()};
                });
                new_response[semantic_type]['results'] = content;
                }
            }
            this.setState({
                autocomplete2: {
                    ...this.state.autocomplete2,
                    isLoading: false,
                    results: new_response
                }
            })
        })
    }

    setExample1 = (event) => {
        event.preventDefault();
        this.setState({
            autocomplete1: {
                ...this.setState.autocomplete1,
                value: 'IMATINIB'
            },
            autocomplete2: {
                ...this.setState.autocomplete2,
                value: 'chronic myelogenous leukemia'
            }
        });
        const IMATINIB = {"chembl": "CHEMBL941", "drugbank": "DB00619", "name": "Imatinib", "pubchem": 5291, "umls": "C0935989", "mesh": "D000068877", "chebi": "CHEBI:45783", "smiles": "Cc1ccc(NC(=O)c2ccc(CN3CCN(C)CC3)cc2)cc1Nc1nccc(-c2cccnc2)n1", "display": "chembl(CHEMBL941) drugbank(DB00619) name(Imatinib) pubchem(5291) umls(C0935989) mesh(D000068877) chebi(CHEBI:45783) smiles(Cc1ccc(NC(=O)c2ccc(CN3CCN(C)CC3)cc2)cc1Nc1nccc(-c2cccnc2)n1) ", "type": "ChemicalSubstance", "primary": {"identifier": "chembl", "cls": "ChemicalSubstance", "value": "CHEMBL941"}};
        this.props.handleInputSelect(IMATINIB);
        const CML = {"mondo": "MONDO:0011996", "doid": "DOID:8552", "umls": "C1292772", "mesh": "D015464", "name": "chronic myelogenous leukemia", "display": "mondo(MONDO:0011996) doid(DOID:8552) umls(C1292772) mesh(D015464) name(chronic myelogenous leukemia) ", "type": "DiseaseOrPhenotypicFeature", "primary": {"identifier": "mondo", "cls": "DiseaseOrPhenotypicFeature", "value": "MONDO:0011996"}};
        this.props.handleOutputSelect(CML);
    }

    setExample2 = (event) => {
        event.preventDefault();
        this.setState({
            autocomplete1: {
                ...this.setState.autocomplete1,
                value: 'cxcr4'
            },
            autocomplete2: {
                ...this.setState.autocomplete2,
                value: 'cxcr2'
            }
        });
        const CXCR4 = {"entrez": "7852", "name": "C-X-C motif chemokine receptor 4", "symbol": "CXCR4", "taxonomy": 9606, "umls": "C1332823", "uniprot": "P61073", "hgnc": "2561", "ensembl": "ENSG00000121966", "display": "entrez(7852) name(C-X-C motif chemokine receptor 4) symbol(CXCR4) taxonomy(9606) umls(C1332823) uniprot(P61073) hgnc(2561) ensembl(ENSG00000121966) ", "type": "Gene", "primary": {"identifier": "entrez", "cls": "Gene", "value": "7852"}};
        this.props.handleInputSelect(CXCR4);
        const CXCR2 = {"entrez": "3579", "name": "C-X-C motif chemokine receptor 2", "symbol": "CXCR2", "taxonomy": 9606, "umls": "C1334126", "uniprot": "P25025", "hgnc": "6027", "ensembl": "ENSG00000180871", "display": "entrez(3579) name(C-X-C motif chemokine receptor 2) symbol(CXCR2) taxonomy(9606) umls(C1334126) uniprot(P25025) hgnc(6027) ensembl(ENSG00000180871) ", "type": "Gene", "primary": {"identifier": "entrez", "cls": "Gene", "value": "3579"}};
        this.props.handleOutputSelect(CXCR2);
    }
  render() {
    return (
        <div className={this.props.shouldDisplay ? '' : 'hidden'}>
            <ErrorMessage field='input/output' modalOpen={this.props.showModal} handleClose={this.props.handleClose} />
            <Segment color="green">
                <Form onSubmit={this.props.handleStep1Submit}>
                    <Form.Group>
                        <h2> Step 1: Specify source and target nodes.</h2>
                        <hr />
                    </Form.Group>
                    <Form.Group>
                        <Button basic color='red' content='Example 1' onClick={this.setExample1}/>
                        <Button basic color='green' content='Example 2' onClick={this.setExample2}/>
                    </Form.Group>
                    <div>
                        <Popup content="The ending node of the paths" header="Source Node" trigger={<h3>Source Node</h3>}/>
                    </div>
                    <br />
                    <Form.Group>
                        <AutoComplete 
                            handleselect={this.props.handleInputSelect}
                            handleSearchChange={this.handleSearchChange1}
                            state={this.state.autocomplete1}
                        />
                    </Form.Group>
                    <div>
                    <Popup content="The ending node of the paths" header="Target Node" trigger={<h3>Target Node</h3>}/>
                    </div>
                    <br />
                    <Form.Group>
                        <AutoComplete 
                            handleselect={this.props.handleOutputSelect}
                            handleSearchChange={this.handleSearchChange2}
                            state={this.state.autocomplete2}
                        />
                    </Form.Group>
                    <div className="col text-center">
                        <Button type='submit' onClick={this.props.handleStep1Submit}>Continue</Button>
                    </div>
                </Form>
            </Segment>
        </div>
    )
  }
}

