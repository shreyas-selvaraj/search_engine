const fs = require('fs');
const keyword_extractor = require("keyword-extractor");
const redis = require("redis");
const subquest = require('subquest')
const SummarizerManager = require("node-summarizer").SummarizerManager;
//const bluebird = require('bluebird')



const cache = {"placeholder":1};
const queue = [];
const redis_client = redis.createClient();
//bluebird.promisifyAll(redis.RedisClient.prototype);

redis_client.on("error", function(error) {
    console.error(error);
});

// const redis_get_wrapper = (key) => {
//     return redis_client.getAsync("hey").then(function(reply) {
//         return reply
//     });
// }

// const test = () => {
//     console.log("LAKHSLJDKLSJKLDJALKSJDLA")
// }

const get_subdomains = async (domain) => {
    if(domain.includes("https://")){
        domain = domain.replace("https://", "")
        protocol = "https"
    }
    else if(domain.includes("http://")){
        domain = domain.replace("http://", "")
        protocol = "http"
    }
    domain = domain.replace("https://", "")
    domain = domain.replace("http://", "")
    subquest.getSubDomains({
        host: domain
      }, (err, results) => {
      
        if(err) {
          console.log('Error:', err);
          return;
        }
      
        results.forEach(async (subdomain) => {
            if(protocol == "https"){
                subdomain = "https://" + subdomain
            }
            else{
                subdomain = "http://" + subdomain
            }
            await pushWrapper(subdomain)
        })
      })
}


const getCache = async () => {
    return cache;
}

const setCache = async (key) => {
    cache[key] = 1;
}

async function checkInCached(key){
    return key in cache;
}

async function pushWrapper(val){
    return queue.push(val);
}

async function extract_keywords(text){
    var keyword_string = ""
    var extraction_result = keyword_extractor.extract(text,{
        language:"english",
        remove_digits: false,
        return_changed_case:false,
        remove_duplicates: true

   });
   for(var i = 0; i < extraction_result.length; i++){
       if(i == extraction_result.length - 1){
        keyword_string = keyword_string + extraction_result[i]
       }
       else{
        keyword_string = keyword_string + extraction_result[i] + ", "
       }
   }
   return keyword_string;
}

const get_length = () =>{
    return queue.length
}


async function summarizeText(content){
    let contentString = ""
    for(var i = 0; i < content.length; i++){
        contentString = contentString + content[i]
    }
    let Summarizer = new SummarizerManager(contentString, 3); 
    let summary = Summarizer.getSummaryByFrequency().summary;
    return summary
}

async function get_wrapper(url){
    await redis_client.get(url, async (err, data)=>{
        if(err){
            throw err;
        }
        else if(data){
            console.log(url + " ALREADY SCRAPED");
        }
        else{
            await redis_client.set(url, "scraped");
            await pushWrapper(url);
        }
    })
    return;
}

async function scrape(browser, elasticClient, url){
    async function scrapeCurrentPage(){
        if(await get_length() === 0){
            return;
        }
        url = await queue.shift();
        let page = await browser.newPage();
        console.log("Navigating to : ", url);
        try{
            await page.goto(url);
        }
        catch(err){
            console.log(err);
            await scrapeCurrentPage()
            await page.close();
        }
        //await page.goto(url);
        await page.waitForSelector('body');
        urls = await page.$$eval('a', links => {
            links = links.map(el => {
                return el.href
            });
            return links;
        });

        let dataObj = {"url": url, "title": "", "description": "", "keywords": "", "scraped_keywords": ""};
        //CONTENT
        dataObj["content"] = await page.$$eval('body', body => {
            return document.body.innerText;
        });
        //TITLE
        try{
            dataObj["title"] = await page.$eval("head > meta[name='title']", title => {
                return title.content;
            }); 
        }
        catch{
            try{
                dataObj["title"] = await page.$eval("head > meta[property='og:title']", title => {
                    return title.content;
                }); 
            }
            catch{
                try{
                    dataObj["title"] = await page.$eval("title", title => {
                        return title.textContent;
                    }); 
                }
                catch{

                }
            }
        }
        //KEYWORDS
        try{
            dataObj["keywords"] = await page.$eval("head > meta[name='keywords']", keywords => {
                return keywords.content;
            }); 
            dataObj["scraped_keywords"] = await extract_keywords(dataObj["content"]);
        }
        catch{
            dataObj["scraped_keywords"] = await extract_keywords(dataObj["content"]);
        }

        //DESCRIPTION
        try{
            dataObj["description"] = await page.$eval("head > meta[name='description']", description => {
                return description.content;
            }); 
        }
        catch{
            try{
                dataObj["description"] = await page.$eval("head > meta[property='og:description']", description => {
                    return description.content;
                }); 
            }
            catch{

            }
        }
         
        console.log("Pushing bulk...");
        await elasticClient.index({
            index: 'search_engine_test',
            type: 'urls',
            body: dataObj,
        }, function(err, resp, status) {
            console.log(resp);
        });
        
        await fs.appendFile("data.json", JSON.stringify(dataObj), 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The data has been scraped and saved successfully! View it at './data.json'");
        });

        await get_subdomains(url);

        for(let i = 0; i < urls.length; i++){
            await get_wrapper(urls[i]);
        }

        await page.close();
        await scrapeCurrentPage();
    }
    await scrapeCurrentPage();
}

 const scrapeRunner = async (browser, elasticClient, startUrl) => {
    var url = startUrl;
    await pushWrapper(url);
    await scrape(browser, elasticClient, url);
    //await redis_client.quit();
    
}

module.exports = {scrapeRunner, scrape}