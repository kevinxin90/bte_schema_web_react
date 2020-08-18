import React, { Component } from 'react';
import { Form, Button, Segment, Popup } from 'semantic-ui-react'
import ErrorMessage from '../../components/DisplayErrorComponent';

import InputSelect from '../../components/InputSelectComponent';

export default class ExplainInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            value1: [],
            selectedOptions1: [],
            options1: [],
            value2: [],
            selectedOptions2: [],
            options2: [],
        };
        
        this.setState1 = this.setState1.bind(this);
        this.setState2 = this.setState2.bind(this);
    }

    setState1 = (state) => {
        this.setState({
            value1: state.value || this.state.value1,
            selectedOptions1: state.selectedOptions || this.state.selectedOptions1,
            options1: state.options || this.state.options1,
        })

        this.props.handleInputSelect(state.selectedOptions || this.state.selectedOptions1);
    }

    setState2 = (state) => {
        this.setState({
            value2: state.value || this.state.value2,
            selectedOptions2: state.selectedOptions || this.state.selectedOptions2,
            options2: state.options || this.state.options2,
        })

        this.props.handleOutputSelect(state.selectedOptions || this.state.selectedOptions2);
    }

    setExample1 = (event) => {
        event.preventDefault();

        const imatinib = {
            key: "Imatinib",
            text: "Imatinib",
            value: "Imatinib",
            image: {spaced: 'right', src: `/assets/images/icons/ChemicalSubstance.png`},
            data: { "CHEMBL.COMPOUND": "CHEMBL941", "DRUGBANK": "DB00619", "name": "Imatinib", "PUBCHEM": 5291, "UMLS": "C0935989", "MESH": "D000068877", "CHEBI": "CHEBI:45783", "smiles": "Cc1ccc(NC(=O)c2ccc(CN3CCN(C)CC3)cc2)cc1Nc1nccc(-c2cccnc2)n1", "display": "chembl(CHEMBL941) drugbank(DB00619) name(Imatinib) pubchem(5291) umls(C0935989) mesh(D000068877) chebi(CHEBI:45783) smiles(Cc1ccc(NC(=O)c2ccc(CN3CCN(C)CC3)cc2)cc1Nc1nccc(-c2cccnc2)n1) ", "type": "ChemicalSubstance", "primary": { "identifier": "CHEMBL.COMPOUND", "cls": "ChemicalSubstance", "value": "CHEMBL941" } }
        };
        
        const CML = {
            key: "chronic myelogenous leukemia",
            text: "chronic myelogenous leukemia",
            value: "chronic myelogenous leukemia",
            image: {spaced: 'right', src: `/assets/images/icons/Disease.png`},
            data: { "MONDO": "MONDO:0011996", "DOID": "DOID:8552", "UMLS": "C1292772", "MESH": "D015464", "name": "chronic myelogenous leukemia", "display": "mondo(MONDO:0011996) doid(DOID:8552) umls(C1292772) mesh(D015464) name(chronic myelogenous leukemia) ", "type": "Disease", "primary": { "identifier": "MONDO", "cls": "Disease", "value": "MONDO:0011996" } }
        };

        this.setState1({
            options: [imatinib],
            value: [imatinib.value],
            selectedOptions: [imatinib]
        });

        this.setState2({
            options: [CML],
            value: [CML.value],
            selectedOptions: [CML]
        });
    }

    setExample2 = (event) => {
        event.preventDefault();

        const cxcr4 = {
            key: "C-X-C motif chemokine receptor 4",
            text: "C-X-C motif chemokine receptor 4",
            value: "C-X-C motif chemokine receptor 4",
            image: {spaced: 'right', src: `/assets/images/icons/Gene.png`},
            data: { "NCBIGene": "7852", "name": "C-X-C motif chemokine receptor 4", "SYMBOL": "CXCR4", "UMLS": "C1332823", "UNIPROTKB": "P61073", "HGNC": "2561", "ENSEMBL": "ENSG00000121966", "display": "NCBIGene(7852) ENSEMBL(ENSG00000121966) HGNC(2561) UMLS(C1332823) UNIPROTKB(P61073) SYMBOL(CXCR4)", "type": "Gene", "primary": { "identifier": "NCBIGene", "cls": "Gene", "value": "7852" } }
        };
        
        const cxcr2 = {
            key: "C-X-C motif chemokine receptor 2",
            text: "C-X-C motif chemokine receptor 2",
            value: "C-X-C motif chemokine receptor 2",
            image: {spaced: 'right', src: `/assets/images/icons/Gene.png`},
            data: { "NCBIGene": "3579", "name": "C-X-C motif chemokine receptor 2", "SYMBOL": "CXCR2", "UMLS": "C1334126", "UNIPROTKB": "P25025", "HGNC": "6027", "ENSEMBL": "ENSG00000180871", "display": "NCBIGene(3579) ENSEMBL(ENSG00000180871) HGNC(6027) UMLS(C1334126) UNIPROTKB(P25025) SYMBOL(CXCR2)", "type": "Gene", "primary": { "identifier": "NCBIGene", "cls": "Gene", "value": "3579" } }
        };

        this.setState1({
            options: [cxcr4],
            value: [cxcr4.value],
            selectedOptions: [cxcr4]
        });

        this.setState2({
            options: [cxcr2],
            value: [cxcr2.value],
            selectedOptions: [cxcr2]
        });
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
                            <Button basic color='red' content='Example 1' onClick={this.setExample1} />
                            <Button basic color='green' content='Example 2' onClick={this.setExample2} />
                        </Form.Group>

                        <div>
                            <Popup content="The ending node of the paths" header="Source Node" trigger={<h3>Source Nodes</h3>} />
                        </div>
                        <br />
                        <InputSelect 
                            options={this.state.options1}
                            value={this.state.value1}
                            selectedOptions={this.state.selectedOptions1}
                            setState={this.setState1}
                        />
                        <br />

                        <div>
                            <Popup content="The ending node of the paths" header="Target Node" trigger={<h3>Target Nodes</h3>} />
                        </div>
                        <br />
                        <InputSelect 
                            options={this.state.options2}
                            value={this.state.value2}
                            selectedOptions={this.state.selectedOptions2}
                            setState={this.setState2}
                        />
                        <br />

                        <div className="col text-center">
                            <Button type='submit' onClick={this.props.handleStep1Submit}>Continue</Button>
                        </div>
                    </Form>
                </Segment>
            </div>
        )
    }
}

