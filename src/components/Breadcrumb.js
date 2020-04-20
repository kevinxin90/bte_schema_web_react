import { Breadcrumb } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import React from 'react';

export const Navigation = ({name}) => <Breadcrumb>
        <Breadcrumb.Section><Link to='/'>Home</Link></Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>{name}</Breadcrumb.Section>
    </Breadcrumb>