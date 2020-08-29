import MetaKG from "@biothings-explorer/smartapi-kg";

console.log("Constructing meta kg");
const meta_kg = new MetaKG();
meta_kg.constructMetaKGSync();

/** get link to page of results for list of publications
 * @param {Array.<string>} publications Publications in the format "type:number", also must all be the same format and either "PMID" or "PMC"
 * @returns {string} Returns either the url to all of the entries or an empty string
 */
const getPublicationLink = (publications) => {
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

const findMetaPath = async (input_type, output_type) => {
    try {
        // let response = await fetch('http://localhost:8856/explorer_api/v1/find_metapath?input_cls=' + input_type + '&output_cls=' + output_type);
        // response = await response.json();
        // return response['edges'];
        let res1 = new Set(meta_kg.filter({ input_type: input_type }).map(rec => rec.association.output_type));
        if (res1.size === 0) {
            return [];
        }
 
        let res2 = [];
        res1.forEach(intermediate => {
            let tmp = meta_kg.filter({ input_type: intermediate, output_type: output_type });
            if (tmp.length > 0) {
                res2.push(intermediate);
            }
        });
        if (res2.length === 0) {
            return [];
        }
        return res2;
    } catch (err) {
        console.log(err)
        return [];
    }
}

const findNext = async (input_type) => {
    try {
        let res1 = new Set(meta_kg.filter({ input_type: input_type }).map(rec => rec.association.output_type));
        if (res1.size === 0) {
            return [];
        }
        return res1;
    } catch (err) {
        console.log(err);
        return [];
    }
}

const findPredicates = async (input_type, output_type) => {
    try {
        let res1 = new Set(meta_kg.filter({ input_type: input_type, output_type: output_type }).map(rec => rec.association.predicate));
        if (res1.size === 0) {
            return [];
        }
        return res1;
    } catch (err) {
        console.log(err);
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

export { getIntermediateNodes, fetchQueryResult, findMetaPath, recordsToD3Graph, recordsToTreeGraph, findPredicates, findNext }

