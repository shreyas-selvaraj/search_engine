const fs = require("fs");
const pageScraper = require('./pageScraper');
const {createClient} = require('./elasticsearch');

async function scrapeController(browserInstance){
    let browser;
    let cache = {"placeholder": 1};
    //let url = "https://www.reddit.com/";
    //let url = "https://www.nytimes.com/";
    //let url = "http://example.com";
    let url = "https://instagram.com/"
    //let url = "https://www.google.com/search?q=python&oq=python&aqs=chrome..69i64j35i39l2j0j46j0i433j69i60l2.20153j0j4&sourceid=chrome&ie=UTF-8";
    //let url = "https://google.com"; 
    //let url = "https://nodejs.org/en/";
    //let url = "https://www.python.org/"
    //let url = "https://twitter.com"
    //let url = "https://stackoverflow.com/";
    //let url = "https://yahoo.com";
    //let url = "https://www.amazon.com/"
    //let url = "https://github.com";
    //let url = "https://chess.com";
    //let url = "https://investopedia.com";
    //let url = "https://www.chess.com/login";
    //let url = "https://www.reddit.com/"
    //let url = "https://golang.org/"
    //let url = "https://netflix.com";
    
    let elasticClient;
    try{
        elasticClient = await createClient({
            node: 'https://localhost:9200',
        });
        browser = await browserInstance;
        let scrapedData = {}
        scrapedData = await pageScraper.scrapeRunner(browser, elasticClient, url);
        await browser.close();
        console.log('DONE SCRAPING');
    }
    catch(err){
        console.log("Error creating controller: ", err);
    }
}

module.exports = {scrapeController};