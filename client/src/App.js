import React, { Component } from "react";
import { render } from "react-dom";
import ParticlesBg from "particles-bg";
import './index.css';
import SearchBar from './components/SearchBar'
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: "http://localhost:3002/graphql"
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }

  render() {
    var colors = ["#fc0307", "#ffffff", "#4287f5", "#f542e0", "#42f5ad", "#f5f242"]
    var color = colors[Math.floor(Math.random() * colors.length)];

    return (
      <ApolloProvider client={client}>
        <div style={styles.app}>
          <SearchBar style={styles.search}/>
          <ParticlesBg type="cobweb" num={200} color={color} bg={true} style={styles.particle}/>
        </div>
      </ApolloProvider>
    );
  }
}

var styles = {
  app: {
    position: "relative",
    zIndex: 0,
    backgroundColor: "#000000",
    height: '100vh',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "Lato-Black",
    overflow: "auto",
  },
  particle: {
    position: "relative",
    zIndex: 2,
    overflow: "auto",
  },
  search: {
    zIndex: 3,
  }
}

export default App;
