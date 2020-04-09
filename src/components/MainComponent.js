import React, { Component } from 'react';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import About from './AboutComponent';
import Explain from "./ExplainComponent";
import Predict from "./PredictComponent";
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import _ from 'lodash';


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
  //when the main component is mounted, fetch dishes will be called and load into redux store
  componentDidMount() {

  }

  render() {
    console.log('env', process.env.REACT_APP_API_URL);

    return (
      <div>
        <Header />
        <Router basename='/explorer'>
          <div>
          <Route exact path={`${process.env.REACT_APP_API_URL}/`} component={Home}></Route>
          <Route path={`${process.env.REACT_APP_API_URL}/about`} component={About}></Route>
          <Route path={`${process.env.REACT_APP_API_URL}/predict`} component={Predict}></Route>
          <Route path={`${process.env.REACT_APP_API_URL}/explain`} component={Explain}></Route>
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
  
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
