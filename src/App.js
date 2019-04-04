import React, { Component } from 'react';

import './App.css';

import InfiniteWall from './components/InfiniteWall/InfiniteWall';


class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <InfiniteWall />
      </div>
    );
  }
}

export default App;
