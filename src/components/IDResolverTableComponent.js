import React from 'react';
import RenderTable from './TableComponent';

const IDResolverTable = ({content}) => {
    if (Object.keys(content).length > 0) {
        var ordered_semantic_types = ['Gene', 'ChemicalSubstance', 'DiseaseOrPhenotypicFeature',
                                      'SequenceVariant', 'Pathway', 'BiologicalProcess',
                                      'MolecularActivity', 'CellularComponent', 'PhenotypicFeature',
                                      'Anatomy']
        return ordered_semantic_types.map(function(semantic_type) {
            if (content[semantic_type].length > 0) {
                var fields = Object.keys(content[semantic_type][0]);
                var exclude_fields= ['primary', 'display', 'type'];
                fields = fields.filter(function(item) {
                    return !exclude_fields.includes(item)
                });
                var contents = content[semantic_type].map(function(item) {
                    return fields.map((field) => item[field] ? item[field] : 'NAN')
                });
                return (<RenderTable semantic_type={semantic_type}
                            fields={fields}
                            content={contents} />)
            }
        });
    }
    else {
        return (<div></div>)
    }
    
}

export default IDResolverTable;