import React from 'react';
import paragraph from '../assets/paragraph.png';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const ReactLoader = (props) => (
    <Segment>
        <Dimmer active inverted>
            <Loader />
        </Dimmer>
        <h2>{props.message} </h2>
        <Image src={paragraph} />
        <Image src={paragraph} />
    </Segment>
)

export default ReactLoader