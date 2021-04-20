import React from "react";
import {graphql} from "react-apollo";
import ApolloClient from 'apollo-boost';
import { getPagesQuery } from "../queries";
import MyCard from "./MyCard"
import {Grid, Grow} from "@material-ui/core";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


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
      text: "",
      min: 0
    } 
    this.pages = [] 
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }
  onSubmitHandler = (e) => {
    e.preventDefault();
    if(this.state.text.length === 0){
      this.setState({text: "", pages: [], min: 0});
    }
    //console.log(this.state.text)
    //console.log(client);
    try {
        client.query({
        query:  getPagesQuery,
        variables: {
          content: this.state.text
        },
      }).then((data) => {
        //console.log(data.data)
        //console.log(data.data.page)
        if(!data.data.page){
          this.setState((state) => {
            return {text: state.text, pages: [{url: "", title: "", description: "", content: "NO RESULTS", keywords: ""}]};
          });
        }
        else{
          this.setState((state) => {
            return {text: state.text, pages: data.data.page, min: 0};
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

  changeBoundsDown = (e) => {
    if(this.state.min - 12 < 0){
      return
    }
    this.setState((state) => {
      return {text: state.text, min: state.min - 12}
      }
    )
  }

  changeBoundsUp = (e) => {
    if(this.state.min + 12 > this.state.pages.length - 2){
      return
    }
    this.setState((state) => {
      return {text: state.text, min: state.min + 12}
      }
    )
  }

  render() {
    if(this.state.pages){
      return(
        <div id="form" style={styles.container}>
          <form onSubmit={this.onSubmitHandler}>
              <input style={styles.input} text={this.state.text} placeholder="Search..." onChange={this.changeText}></input>
              <NavigateBeforeIcon style={styles.iconLeft} className="icon" onClick={this.changeBoundsDown}/>
              <NavigateNextIcon style={styles.icons}  className="icon" onClick={this.changeBoundsUp}/>
          </form>
          {/* <button onClick={this.changeBounds}>Click me</button> */}
          {/* <MyCard data={{url: "test", content: "test", keywords: "test"}}/> */}
          {/* <div style={styles.cardContainer}> */}
          <Grid container style={styles.top}
            spacing={2}
            direction="row"
            justifycontent = "space-between"
          >
            {this.state.pages.slice(this.state.min,this.state.min+12).map((page, index) => {
              return( 
                // <div key={index} style={styles.topCard}></div>
                  <Grid item xs={2} md={4} key={index} style={styles.grid} className="mycard">
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
    top: "5vh",
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
  iconLeft: {
    fill: "white",
  },
  icons: {
    fill: "white",
  }
};


export default graphql(getPagesQuery)(SearchBar);