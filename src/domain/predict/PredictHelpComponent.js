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
            What can <b>"PREDICT"</b> queries do?
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <p>
            PREDICT queries are designed to predict plausible relationships between one entity and an entity class.
            </p>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.handleClick}
          >
            <Icon name='dropdown' />
            Give me some examples of <b>"PREDICT"</b> queries.
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List bulleted>
              <List.Item>What <b>drugs</b> might be used to treat <b>hyperphenylalaninemia</b>?"</List.Item>
              <List.Item>What <b>genes</b> are in the same pathway as <b>CDK7</b>?</List.Item>
            </List>
          </Accordion.Content>
        </Accordion>
      </div>
    )
  }
}