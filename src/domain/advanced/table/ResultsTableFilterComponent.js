import React from 'react';
import { Checkbox, Popup, Accordion, Dropdown, Button } from 'semantic-ui-react';
import _ from 'lodash';

const ResultsTableFilter = ({filters, selectedFilters, updateFilters}) => {
  let panels = Object.entries(filters).map(([key, value]) => {
    let nestedPanels = Object.entries(value).map(([attributeName, attributeValue]) => {
      let attribute_values = Array.from(attributeValue);
      return { 
        key: `panel-${attributeName}`, 
        title: attributeName, 
        content: { 
          content: (
            attribute_values.length > 5 
            //show dropdown if attributes length is greater than 5
            ? <div>
              <Dropdown 
                multiple 
                search 
                selection 
                options={attribute_values.map((value) => ({
                  key: value, 
                  text: value, 
                  value: value})
                )} 
                value={Array.from(selectedFilters[key][attributeName])} 
                onChange={updateFilters} 
                data={{objectName: key, key: attributeName}}
              />
            </div> 

            //otherwise show checkboxes
            : <div>
              {
                attribute_values.map(value => 
                  <div>
                    <Checkbox 
                      key={`checkbox-${_.uniqueId}`} 
                      label={value} 
                      checked={selectedFilters[key][attributeName].has(value)} 
                      onClick={updateFilters} 
                      data={{objectName: key, key: attributeName}}/>
                  </div>
                )
              }
            </div>
          ) 
        }
      };
    });

    let nestedContent = <div><Accordion.Accordion panels={nestedPanels}/></div>;

    return { key: `panel-${key}`, title: key, content: {content: nestedContent} };
  });

  return (
    <Popup 
      trigger={<Button content='Filter Results' icon='filter' labelPosition='left' />}
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

export default ResultsTableFilter;