import React, { Component } from 'react';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import Explain from "./explain/ExplainComponent";
import Predict from "./predict/PredictComponent";
import { Route, withRouter } from 'react-router-dom';


class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: []
    }
  }

  render() {
    return (
      <div>
          <Header />
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/predict' component={Predict}></Route>
          <Route exact path='/explain' component={Explain}></Route>
          <Footer />
      </div>
    );
  }
  
}

export default withRouter((Main));
