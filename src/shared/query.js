import callApis from "@biothings-explorer/call-apis";
import _ from 'lodash'

const ID_WITH_PREFIXES = ["MONDO", "DOID", "UBERON", "EFO", "HP", "CHEBI", "CL", "MGI"];

const queryAPIs = async (edges, inputs) => {
    let annotated_edges = [], new_edge;

    edges.map(edge => {

       // console.log(edge);
        
        new_edge = _.cloneDeep(edge);

      //  console.log(new_edge);
        
        inputs.map(input => {

         //   console.log(input)
            
            if (new_edge.association.input_id in input) {
                
                if (!(new_edge.query_operation.supportBatch === true)) {
                    new_edge.input = input[new_edge.association.input_id];
                    if (!(ID_WITH_PREFIXES.includes(new_edge.association.input_id))) {
                        new_edge.original_input = {
                            [new_edge.association.input_id + ':' + new_edge.input]: input
                        }
                    } else {
                        new_edge.original_input = {
                            [new_edge.input]: input
                        }
                    }
                    annotated_edges.push(new_edge);
                } else {
                    if (!("input" in new_edge)) {
                        new_edge.input = [];
                        new_edge.original_input = {};
                    }
                    new_edge.input.push(input[new_edge.association.input_id]);
                    if (!(ID_WITH_PREFIXES.includes(new_edge.association.input_id))) {
                        new_edge.original_input = {
                            ...new_edge.original_input, ...{
                                [new_edge.association.input_id + ':' + new_edge.input]: input
                            }
                        }
                    } else {
                        new_edge.original_input = {
                            ...new_edge.original_input, ...{
                                [new_edge.input]: input
                            }
                        }
                    }
                }
            }
            
        });
        if (new_edge.query_operation.supportBatch === true && "input" in new_edge) {
            annotated_edges.push(new_edge);
        }
    });

    console.log(annotated_edges);

    const queryExecutor = new callApis(annotated_edges);
    await queryExecutor.query();
    console.log(queryExecutor.result);
    let queryResults = queryExecutor.result.map(item => ({
        input_id: item.$original_input[item.$input][item.$association.input_id],
        input_type: item.$association.input_type,
        pred1: item.$association.predicate,
        pred1_api: item.$association.api_name,
        pred1_publications: item.publications,
        output_id: item.$association.output_id, // item.$output_id_mapping.resolved.id.identifier,
        output_label: item.label, // item.$output_id_mapping.resolved.id.label,
        output_type: item.$association.output_type,
        UMLS: item.UMLS
    }));
    return queryResults;
}

export { queryAPIs }