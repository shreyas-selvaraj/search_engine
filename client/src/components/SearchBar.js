import React from "react";
import {graphql} from "react-apollo";
import ApolloClient from 'apollo-boost';
import { getPagesQuery } from "../queries";
import MyCard from "./MyCard"
import {Grid, Card, Fade, Grow, Slide} from "@material-ui/core";


// const client = new ApolloClient({
// link: concat(authMiddleware, httpLink),
// cache: new InMemoryCache(),
// defaultOptions: defaultOptions,

// });

const client = new ApolloClient({
  uri: "http://localhost:3002/graphql",
});

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      text: ""
    } 
    this.pages = [] 
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }
  onSubmitHandler = (e) => {
    e.preventDefault();
    if(this.state.text.length === 0){
      return
    }
    console.log(this.state.text)
    //console.log(client);
    try {
        client.query({
        query:  getPagesQuery,
        variables: {
          content: this.state.text
        },
      }).then((data) => {
        console.log(data.data)
        console.log(data.data.page)
        if(data.data.page.length === 0){
          this.setState((state) => {
            return {text: state.text, pages: [{url: "", content: ["NO RESULTS"], keywords: []}]};
          });
        }
        else{
          this.setState((state) => {
            return {text: state.text, pages: data.data.page};
          });
        }
      })
    }
    catch{
      console.log("Couldn't query server")
    }
  }

  changeText = (e) => {
    this.setState({text: e.target.value})
  }

  render() {
    if(this.state.pages){
      //var length = this.state.pages.length;
      // var pages = [];
      // for(var i = 0; i < length/3; i++){
      //   pages.push(i);
      // }

      return(
        <div id="form" style={styles.container}>
          <form onSubmit={this.onSubmitHandler}>
              <input style={styles.input} text={this.state.text} placeholder="Search..." onChange={this.changeText}></input>
          </form>
          {/* <MyCard data={{url: "test", content: "test", keywords: "test"}}/> */}
          {/* <div style={styles.cardContainer}> */}
          <Grid container style={styles.top}
            spacing={2}
            direction="row"
            justifyContent = "space-between"
          >
            {this.state.pages.map((page, index) => {
              return( 
                // <div key={index} style={styles.topCard}></div>
                  <Grid item xs={2} md={3} key={index} style={styles.grid}>
                    <Grow in={true} timeout={1000}>
                      <div>
                        <MyCard key={index} data={page} style={styles.card}/>
                    </div>
                    </Grow>
                  </Grid>
                //</div>
              )
            })}
          </Grid>
          {/* </div> */}
        </div>
      )
    }
    else{
      return (
        <div id="form" style={styles.container}>
          <form onSubmit={this.onSubmitHandler}>
            <input style={styles.input} text={this.state.text} placeholder="Search..." onChange={this.changeText}></input>
          </form>
          {/* <MyCard data={{url: "", content:"NO RESULTS", keywords: ""}}/> */}
        </div>
      );
    }
  }
}

const styles = {
  input: {
    height: '3vh',
    width: '30vw',
    fontSize: 20,
    fontFamily: "",
    textAlign: "center",
    marginBottom: "3vh",
    marginLeft: "3vh",
    border: "2px solid white",
    borderRadius: "4px",
  },
  container: {
    position: "relative",
    top: "10vh",
    height: "100vh",
    maxHeight: "100vh",
    overflow: 'auto'
  },
  card: {
  },
  grid: {
    height: "100%",
  },
  top: {
    width: "90%",
    marginLeft: "5%"
  },
};


export default graphql(getPagesQuery)(SearchBar);