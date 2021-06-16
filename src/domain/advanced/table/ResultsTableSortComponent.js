import React from 'react';
import { Popup, Accordion, Button } from 'semantic-ui-react';
import { SORT_FIELDS_TO_IGNORE } from '../AdvancedQueryConfig';

const ResultsTableSort = ({selectedFilters, tableParameters, handleSort}) => {
  let panels = Object.entries(selectedFilters).map(([key, value]) => {
    let nestedContent = <Button.Group basic vertical labeled icon>
      {Object.keys(value).filter(k => !SORT_FIELDS_TO_IGNORE.includes(k)).map(attributeName => {
        let selected = (tableParameters.sortColumn === key && tableParameters.sortProperty === attributeName);
        return <Button 
          icon={selected ? `sort ${tableParameters.sortDirection}` : 'sort'}
          data={{sortColumn: key, sortProperty: attributeName}}
          content={attributeName} 
          active={selected} 
          onClick={handleSort}
        />;
      })}
    </Button.Group>;

    return { key: `sort-panel-${key}`, title: key, content: {content: nestedContent} };
  });

  return (
    <Popup 
      trigger={<Button content='Sort Results' icon='sort' labelPosition='left' />}
      flowing
      pinned
      position='bottom left'
      on='click'
      style={{padding: 0}}
    >
      <Accordion styled panels={panels}/>
    </Popup>
  )
}

export default ResultsTableSort;