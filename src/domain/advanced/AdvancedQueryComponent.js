import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import GraphQuery from './GraphQueryComponent';

class AdvancedQuery extends Component {
  render() {
    return (
      <Container className="feature">
        <Navigation name="Advanced" />
        <GraphQuery />
      </Container>
    )
  }
}

export default AdvancedQuery;