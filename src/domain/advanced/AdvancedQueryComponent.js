import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';

class AdvancedQuery extends Component {
  render() {
    return (
      <Container className="feature">
        <Navigation name="Advanced" />
        
      </Container>
    )
  }
}

export default AdvancedQuery;