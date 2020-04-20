import React from 'react';
import { Step } from 'semantic-ui-react'

export default function BTESteps(props) {
    const steps = [
        {
            key: "input",
            icon: 'pencil',
            active: props.currentStep === 1,
            link: true,
            onClick: props.handleBackToStep1,
            title: 'Step 1: Input',
            completed: props.step1Complete,
            description: 'Specify your source and target node',
        },
        {
            key: "metapath",
            icon: 'tasks',
            active: props.currentStep === 2,
            link: true,
            onClick: props.handleBackToStep2,
            disabled: props.step1Complete ? false: true,
            title: 'Step 2: Metapath',
            completed: props.step2Complete,
            description: 'Select the metapath(s) to perform the query',
        },
        {
            key: "result",
            icon: 'table',
            active: props.currentStep === 3,
            link: true,
            onClick: props.handleBackToStep3,
            disabled: props.step2Complete ? false: true,
            title: 'Step 3: Result',
            completed: props.step3Complete,
            description: 'Explore the results using graph and table',
        },
    ]
    return <Step.Group items={steps} widths={3}/>
}
