import getMetaKG from './metaKG';
import React from 'react';

/** get link to page of results for list of publications
 * @param {Array.<string>} publications Publications in the format "type:number", also must all be the same format and either "PMID" or "PMC"
 * @returns {string} Returns either the url to all of the entries or an empty string
 */
const getPublicationLink = (publications) => {
    if (!publications || publications.length === 0) {
        return "";
    }

    let pubType = publications[0].split(":")[0];

    if (pubType === "PMID") {
        let url = new URL("https://pubmed.ncbi.nlm.nih.gov/");
        url.searchParams.append("term", publications.map(pub => pub.replace(/\D+/g, '')).join(',')); //comma separated list of publications (number only)
        return url.toString();

    } else if (pubType === "PMC") {
        let url = new URL("https://www.ncbi.nlm.nih.gov/pmc/");
        url.searchParams.append("term", publications.map(pub => pub.replace(/\D+/g, '')).join(',')); //comma separated list of publications (number only)
        return url.toString();
    } else {
        return "";
    }
}

/** get possible values for a field in the results
 * @param {Array.<Object>} results Array of result objects
 * @param {string} field name of the field
 * @returns {Array.<string>} Array of unique strings
 */
const getFieldOptions = (results, field) => {
    let possiblities = new Set();
    results.forEach(result => {
        possiblities.add(result[field]);
    });

    return Array.from(possiblities).sort();
}

/** filter results by a filter object
 * @param {Array.<Object>} results Array of result objects
 * @param {Object.<Set>} filter filter object of sets representing which fields and for which values to filter for
 * @returns {Array.<Object>} Filtered results
 */
const getFilteredResults = (results, filter) => {
    return results.filter((result) => {
        for (const key of Object.keys(filter)) {
            if (filter[key].size > 0 && !filter[key].has(result[key])) {
                return false;
            }
        }
        return true;
    });
}

/** generate autocomplete dropdown option from biomedical-id-autocomplete record
 * @param {Object} record record object
 * @returns {Object} dropdown option object
 */
const recordToDropdownOption = (record) => {
    if (record.primary) { //avoid some problem entries
        return {
            key: record.primary.value,
            text: record.name,
            image: {spaced: 'right', src: `/explorer/assets/images/icons/${record.type}.png`},
            content: <div style={{marginTop: '-21px'}}>
                <div style={{paddingLeft: '39px', display: 'flex', alignItems: 'center', minHeight: '28px', marginBottom: '5px'}}>
                    <div>
                        <b>{record.name}</b> 
                    </div>
                </div>
                <small>{record.display}</small>
            </div>,
            data: record,
            title: record.type,
            value: record.primary.value
        };
    }   
}

const recordsToTreeGraph = (records) => {
    records = Array.from(records);
    let tree_dict = {};
    let tree = { children: [] }
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
        let rec = { name: prop, pathProps: prop, children: [] };
        rec['children'] = Array.from(tree_dict[prop]).map(item => ({ name: item, children: [] }));
        tree['children'].push(rec);
    }
    return tree
}

const getIntermediateNodes = (metaPaths) => {
    return [...metaPaths].map(x => x.split('-').slice(1)[0])
}

const findMetaPath = async (inputs, outputs) => {
    try {
        let meta_kg = getMetaKG();
        console.log(inputs, outputs);

        //get unique inputs and outputs
        let input_type = [...new Set(inputs.map(input => input.type))];
        let output_type = [...new Set(outputs.map(output => output.type))];

        let res1 = new Set(meta_kg.filter({ input_type: input_type }).map(rec => rec.association.output_type));
        if (res1.size === 0) {
            return [];
        }

        let res2 = [];
        res1.forEach(intermediate => {
            let tmp = meta_kg.filter({ input_type: intermediate, output_type: output_type });
            if (tmp.length > 0) {
                res2.push(input_type + '-' + intermediate + '-' + output_type);
            }
        });
        if (res2.length === 0) {
            return [];
        }
        return res2
    } catch (err) {
        console.log(err)
        return [];
    }
}

const fetchQueryResult = async (input, output, intermediate) => {
    let url = new URL('https://geneanalysis.ncats.io/explorer_api/v1/connect');
    let params = {
        input_obj: JSON.stringify(input),
        output_obj: JSON.stringify(output),
        intermediate_nodes: JSON.stringify(intermediate)
    };
    url.search = new URLSearchParams(params).toString();
    try {
        let response = await fetch(url);
        if (!response.ok) {
            return { 'data': [], 'log': [] }
        };
        response = await response.json();
        return response
    } catch (err) {
        return { 'data': [], 'log': [] }
    }
}

export { getIntermediateNodes, fetchQueryResult, findMetaPath, recordsToTreeGraph, getPublicationLink, getFieldOptions, getFilteredResults, recordToDropdownOption };
