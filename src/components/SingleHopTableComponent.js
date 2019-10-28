import React from 'react';
import RenderTable from './TableComponent';

const SingleHopTable = ({content}) => {
    if (content) {
        var semantic_type = null;
        var fields = ['obj',
                      'obj_type', 'predicate',
                      'datasource', 'api', 'pubmed'
                      ];
        var restru_content = content.map(function(item) {
            var restru_item = [item['to']];
            if (item.info) {
                var api = item.info['$api'];
                var type = item.info['@type'];
                var datasource = item.info['$source'];
                var pubmed = item.info['bts:pubmed'];
            }
            else {
                var type = 'NAN';
                var api = 'NAN';
                var datasource = 'NAN';
                var pubmed = 'NAN';
            }
            var predicate = item['label'];
            var restru_item = restru_item.concat([type, predicate, datasource, api, pubmed]);
            return restru_item;
        });
        return (<RenderTable semantic_type={semantic_type}
                    fields={fields}
                    content={restru_content} />)
    }
    else {
        return (<div></div>)
    }
}

export default SingleHopTable;


