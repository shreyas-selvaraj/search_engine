const browserObject = require('./browser');
const {scrapeController} = require('./scrapeController');
const express = require('express');
const cors = require('cors');
const schema = require('./schema');
const { graphqlHTTP }  = require('express-graphql');


//route handling 
const app = express();

app.use(cors());

app.get('/test', (req, res) => {
    res.send('hey');
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,    
}));

app.listen(3002, () => {
    console.log("LISTENING ON PORT 3002");
})

//start browser and scraping
let browserInstance = browserObject.startBrowser();
scrapeController(browserInstance);