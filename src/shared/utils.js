const posOrNeg = (num) => {
    if (num === 0) {
        return 0
    } else if (num % 2 === 0) {
        return 1
    } else {
        return -1
    }
}

export const recordsToD3Graph = (records) => {
    records = Array.from(records);
    let graph = {nodes: [{id: 'kevin'}], links: []};
    if (Array.isArray(records) && records.length) {
        graph['nodes'] = [
            {
                id: records[0].split('||')[0],
                color: 'green',
                x: 20,
                y: 200
            },
            {
                id: records[0].split('||')[7],
                color: 'blue',
                x: 700,
                y:200
            }
        ]
    };
    for (let i = 0; i < records.length; i++) {
        if (i < 10) {
            let rec = records[i].split('||')
            graph['links'].push({'source': rec[0],
                                 'target': rec[3],
                                 'label': rec[1]})
            graph['links'].push({'source': rec[3],
                                 'target': rec[7],
                                 'label': rec[5]})
            graph['nodes'].push({id: rec[3], color: 'red', x: 360, y: 200 + posOrNeg(i) * Math.ceil(i/2) * 30})
        }
    }
    return graph
}

export const recordsToTreeGraph = (records) => {
    records = Array.from(records);
    let tree_dict = {};
    let tree = {children: []}
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
        let rec = {name: prop, pathProps: prop, children: []};
        rec['children'] = Array.from(tree_dict[prop]).map(item=>({name: item, children: []}));
        tree['children'].push(rec);
    }
    return tree
}

export const getIntermediateNodes = (metaPaths) => {
    return [...metaPaths].map(x => x.split('-').slice(1)[0])
}

export async function findMetaPath(input_type, output_type) {
    try {
        let response = await fetch('https://geneanalysis.ncats.io/explorer_api/v1/find_metapath?input_cls=' + input_type + '&output_cls=' + output_type);
        response = await response.json();
        return response['edges'];
    } catch(err) {
        return [];
    }
}

export async function fetchQueryResult(input, output, intermediate) {
    let url = new URL('https:/geneanalysis.ncats.io/explorer_api/v1/connect');
    let params = {
        input_obj: JSON.stringify(input),
        output_obj: JSON.stringify(output),
        intermediate_nodes: JSON.stringify(intermediate)
    };
    url.search = new URLSearchParams(params).toString();
    try {
        let response = await fetch(url);
        if (!response.ok) {
            return {'data': [], 'log': []}
        };
        response = await response.json();
        return response
    } catch(err) {
        return {'data': [], 'log': []}
    }
}

