import React, { Component } from 'react';
import { Step } from 'semantic-ui-react'

export default class BTESteps extends Component {

    render() {
      const steps = [
        {
          key: "input",
          icon: 'pencil',
          active: this.props.step1Active,
          link: true,
          onClick: this.props.handleBackToStep1,
          title: 'Step 1: Input',
          completed: this.props.step1Complete,
          description: 'Specify your source and target node',
        },
        {
          key: "metapath",
          icon: 'tasks',
          active: this.props.step2Active,
          link: true,
          onClick: this.props.handleBackToStep2,
          disabled: this.props.step1Complete ? false: true,
          title: 'Step 2: Metapath',
          completed: this.props.step2Complete,
          description: 'Select the metapath(s) to perform the query',
        },
        {
          key: "result",
          icon: 'table',
          active: this.props.step3Active,
          link: true,
          onClick: this.props.handleBackToStep3,
          disabled: this.props.step2Complete ? false: true,
          title: 'Step 3: Result',
          completed: this.props.step3Complete,
          description: 'Explore the results using graph and table',
        },
      ]
      return (
        <div className="row steps">
            <div className="col-12">
              <Step.Group items={steps} widths={3}/>
            </div>
        </div>
      )
    }
}
