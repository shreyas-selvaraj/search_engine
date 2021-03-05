const fs = require('fs');
const keyword_extractor = require("keyword-extractor");
const redis = require("redis");

const cache = {"placeholder":1};
const queue = [];
const redis_client = redis.createClient();

redis_client.on("error", function(error) {
    console.error(error);
});

function redis_get_wrapper(key) {
    return new Promise((resolve, reject) => {
        redis_client.get(key, (err, data) => {
            if(err){
                reject(err);
                return;
            }
            if(data){
                resolve(true);
                return;
            }
            if(!data){
                resolve(false);
                return;
            }
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
        await page.goto(url);
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

        for(let i = 0; i < urls.length; i++){
            //const regex = new RegExp("#$||/\#", "g");
            if(await checkInCached(urls[i])){
                continue;
            }
            else{
                await page.close();
                //await redis_client.set(urls[i], "scraped");
                await setCache(urls[i]);
                await pushWrapper(urls[i]);
                await scrapeCurrentPage();
            }
            // redis_get_wrapper(urls[i])
            // .then(async (exist_bool) => {
            //     console.log(exists_bool);
            //     if(!exists_bool){

            //     }
            // }) 
        }
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