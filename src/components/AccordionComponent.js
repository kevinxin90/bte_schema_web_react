import React, { Component } from 'react'
import { Accordion, Icon, List } from 'semantic-ui-react'

export default class AccordionComponent extends Component {
  state = { activeIndex: 10 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state

    return (
      <div>
        <br></br>
        <Icon circular name='info' />
        <Accordion>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleClick}
          >
            <Icon name='dropdown' />
            What can "EXPLAIN" queries do?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <p>
            EXPLAIN queries are designed to identify plausible reasoning chains to explain the relationship between two entities.
            </p>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.handleClick}
          >
            <Icon name='dropdown' />
            Give me some examples of EXPLAIN queries.
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List bulleted>
              <List.Item>Why does <b>imatinib</b> have an effect on the treatment of <b>chronic myelogenous leukemia (CML)</b>?</List.Item>
              <List.Item>Why does <b>pentoxifylline</b> have an effect on the treatment of <b>severe acute respiratory syndrome</b>?</List.Item>
            </List>
          </Accordion.Content>
        </Accordion>
      </div>
    )
  }
}