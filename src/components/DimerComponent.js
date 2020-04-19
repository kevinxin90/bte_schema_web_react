import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const ReactLoader = () => (
    <Segment>
        <Dimmer active inverted>
        <Loader />
        </Dimmer>
        <h2>The result might take a couple minutes to show up. </h2>
        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
    </Segment>
)

export default ReactLoader