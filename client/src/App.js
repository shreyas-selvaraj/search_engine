import React, { Component } from "react";
import { render } from "react-dom";
import ParticlesBg from "particles-bg";
import './index.css';
import SearchBar from './components/SearchBar'

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }

  render() {

    return (
      <div style={styles.app}>
        <SearchBar style={styles.search}/>
        <ParticlesBg type="cobweb" num={200} background="#000000" color="#FFFFFF" bg={false} style={styles.particle}/>
      </div>
    );
  }
}

var styles = {
  app: {
    backgroundColor: "#000000",
    height: '100vh',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "Lato-Black"
  },
  particle: {
    
  },
  search: {
  }
}

export default App;
