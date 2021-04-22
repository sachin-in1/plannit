import React, { Component } from 'react';
// import axios from 'axios'
import { Route } from 'react-router-dom'
// components
import Navbar from './components/navbar'
import Plan from './components/plan'
class App extends Component {
  constructor() {
    super()
    this.state = {
    }

    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
   
        <Navbar/>
        
        {/* Routes to different components */}
          <Route
          exact path="/"
          component={Plan} />

      </div>
    );
  }
}

export default App;
