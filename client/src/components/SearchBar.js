import React from "react";
import axios from "axios"

const SearchBar = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios.get("http://localhost:3001/test")
    .then((res) => {
      console.log(res);
    }); 
  }
  return (
    <div id="form" style={styles.container}>
      <form onSubmit={onSubmitHandler}>
        <input style={styles.input} placeholder="Search..."></input>
      </form>
    </div>
  );
}

const styles = {
  input: {
    height: '3vh',
    width: '30vw',
    fontSize: 20,
    fontFamily: "",
    textAlign: "center",
  },
  container: {
    position: "relative",
    top: "10vh"
  }
};


export default SearchBar;