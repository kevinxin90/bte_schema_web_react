import callApis from "@biothings-explorer/call-apis";
import _ from 'lodash'

const ID_WITH_PREFIXES = ["MONDO", "DOID", "UBERON", "EFO", "HP", "CHEBI", "CL", "MGI"];


/* Used to fetch query results after metapath selection*/
const queryAPIs = async (edges, inputs) => {

    let annotated_edges = [], new_edge;

    for (let edge = 0; edge < edges.length; edge++) {
            
        if (edges[edge].query_operation.supportBatch === true) {
            let input_ids = new Set();
            let original_input = {};
            new_edge = _.cloneDeep(edges[edge]);

            inputs.map(input => {

                if (new_edge.association.input_id in input) {
                    input_ids.add(input[new_edge.association.input_id]);
                    if (!(ID_WITH_PREFIXES.includes(new_edge.association.input_id))) {
                        original_input = {
                            ...original_input, ...{
                                [new_edge.association.input_id + ':' + input[new_edge.association.input_id]]: input
                            }
                        }
                    } else {
                        original_input = {
                            ...original_input, ...{
                                [input[new_edge.association.input_id]]: input
                            }
                        }
                    }
                } else if ("db_ids" in input) {
                    if (new_edge.association.input_id in input["db_ids"]) {
                        for (let i = 0; i < input["db_ids"][new_edge.association.input_id].length; i++) {
                            input_ids.add(input["db_ids"][new_edge.association.input_id][i]);
                            if (!(ID_WITH_PREFIXES.includes(new_edge.association.input_id))) {
                                original_input = {
                                    ...original_input, ...{
                                        [new_edge.association.input_id + ':' + input["db_ids"][new_edge.association.input_id][i]]: input
                                    }
                                }
                            } else {
                                original_input = {
                                    ...original_input, ...{
                                        [input["db_ids"][new_edge.association.input_id][i]]: input
                                    }
                                }
                            }
                        }
                    }
                }
            
            });
            input_ids = Array.from(input_ids);
            for (let i = 0; i < input_ids.length; i+=1000) {
                new_edge["input"] = input_ids.slice(i,i+1000);
                new_edge["original_input"] = original_input;
                annotated_edges.push(new_edge);
            }
        } else { // no batch query supported
            inputs.map(input => {
                new_edge = _.cloneDeep(edges[edge]);

                if (new_edge.association.input_id in input) {
                    new_edge["input"] = input[new_edge.association.input_id]
                    if (!(ID_WITH_PREFIXES.includes(new_edge.association.input_id))) {
                        new_edge["original_input"] = { [new_edge.association.input_id + ':' + input[new_edge.association.input_id]]: input }
                    } else {
                        new_edge["original_input"] = { [input[new_edge.association.input_id]]: input }
                    }
                    annotated_edges.push(new_edge);
                } else if ("db_ids" in input) {
                    if (new_edge.association.input_id in input["db_ids"]) {
                        for (let i = 0; i < input["db_ids"][new_edge.association.input_id].length; i++) {
                            new_edge["input"].push(input["db_ids"][new_edge.association.input_id][i]);
                            if (!(ID_WITH_PREFIXES.includes(new_edge.association.input_id))) {
                                new_edge["original_input"] = { [new_edge.association.input_id + ':' + input["db_ids"][new_edge.association.input_id]]: input }
                            } else {
                                new_edge["original_input"] = { [input["db_ids"][new_edge.association.input_id]]: input }
                            }
                        }
                        annotated_edges.push(new_edge);
                    }
                }
            });
        }
    }
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
    }));
    let nextInput = queryExecutor.result.map(item => {

        // issue $output_id_mapping not in some of the results, so can't get db_ids,
        // this affects subsequent levels in the query
        
        if ("$output_id_mapping" in item) {
            return ({
                db_ids: item.$output_id_mapping.resolved.db_ids
            });
        } else {
            return [];
        }
    });

    return [queryResults, nextInput];
}

export { queryAPIs }