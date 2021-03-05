const fs = require('fs');
const keyword_extractor = require("keyword-extractor");
const redis = require("redis");
const subquest = require('subquest')

const cache = {"placeholder":1};
const queue = [];
const redis_client = redis.createClient();
var exists_bool;

redis_client.on("error", function(error) {
    console.error(error);
});

const redis_get_wrapper = (key) => {
    redis_client.get(key, function(err, data) {
        if(data){
            exists_bool = true;
    
        }
        else{
            exists_bool = false;
        }
    })
}

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
    var extraction_result = keyword_extractor.extract(text,{
        language:"english",
        remove_digits: false,
        return_changed_case:false,
        remove_duplicates: true

   });
   return extraction_result;
}

async function scrape(browser, elasticClient, url){
    async function scrapeCurrentPage(){
        url = queue.shift();
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

        let dataObj = {"url": url};
        dataObj["content"] = await page.$$eval('p', p => {
            return p.map(el => el.textContent);
        });
        dataObj["keywords"] = await extract_keywords(dataObj["content"][0]);

         // let bulk = [];
        // await bulk.push({index:{
        //         _index:"search_engine_tutorial",
        //         _type:"urls",
        //     }
        // })
        // await bulk.push(dataObj);
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
            await redis_get_wrapper(urls[i]);
            if(exists_bool){
                continue;
            }
            else{
                await redis_client.set(urls[i], "scraped");
                //await setCache(urls[i]);
                await pushWrapper(urls[i]);
            }
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
    redis_client.quit();
    
}

module.exports = {scrapeRunner, scrape}