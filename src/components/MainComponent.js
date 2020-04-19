import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Explain from "../domain/explain/ExplainComponent";
import Predict from "../domain/predict/PredictComponent";
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    leaders: state.leaders,
    promotions: state.promotions
  }
}

const mapDispatchToProps = dispatch => ({
  
    postComment: (dishId, rating, author, comment) => {dispatch(postComment(dishId, rating, author, comment))},
    fetchDishes: () => {dispatch(fetchDishes())},
    fetchComments: () => {dispatch(fetchComments())},
    fetchPromos: () => {dispatch(fetchPromos())},
    resetFeedbackForm: () => {dispatch(actions.reset('feedback'))}
  
  });

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
