const puppeteer = require('puppeteer');

async function startBrowser() {
    let browser;
    try {
        console.log("Opening browser...");
        browser = await puppeteer.launch({
            headless:true,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        })
    }
    catch(err){
        console.log("Could not create browser instance: ", err);
    }
    return browser;
}

module.exports = {startBrowser}