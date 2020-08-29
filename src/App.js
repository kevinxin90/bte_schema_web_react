import React, { Component } from 'react';
import Main from './domain/Main';
import './App.css';
import { BrowserRouter } from 'react-router-dom';


class App extends Component {

  render() {
    return (
      <BrowserRouter basename='/explorer'>
        <Main />
      </BrowserRouter>
    );
  }
  
}

export default App;
