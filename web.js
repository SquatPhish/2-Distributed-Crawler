//author ketian
//ririhedou@gmail.com

module.exports =
{
    run_web_multiple_urls : run_web_multiple_urls,
    run_single : run_single
}

const fs = require('fs');
const puppeteer = require('puppeteer');

//terminate the process in case some weird things happen
process.on('unhandledRejection', up => { throw up })

/*
*  run multiple URL instances
*  @input: list of URLs
*
*/

async function run_web_multiple_urls(urlList, nameList, globalDir){

  var page = null;

  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  //if you do not use this, error will happen on CentOS 7

  var arrayLength = urlList.length;

  for (var i = 0; i < arrayLength; i++) {

    //the i-th element
    myUrl = urlList[i];

    console.log("[TEST]Visiting  :" + myUrl);

    page = await browser.newPage();
    try {
            var arrayOfStrings = String(myUrl).split('/');

            var name = globalDir + nameList[i];

            await page.goto(myUrl,  { timeout: 50000 }); //5000 is 5000ms

            //await page.waitForNavigation();

            const url = await page.url();

            //console.log('[1] Redirection: from url:<' + myUrl + '> to <' + url + '>');

            var directionChain = 'Redirection: from url:<' + myUrl + '> to <' + url + '>';

            await fs.writeFile(name + '.redirect', directionChain, (err) => {
                if (err) throw err;
                //console.log('[1] Redirection Chain was successfully saved.');
            });

            let HTML = await page.content(); //content is enough for the HTML content

            var filepath = name + '.source.txt';
            await fs.writeFile(filepath, HTML, (err) => {
                if (err) throw err;
                //console.log('[2] HTML was successfully saved.');
            });

            await page.setViewport({width: 1600, height: 800});
            await page.screenshot({path: name + '.screen.png'});

            //console.log('[3] Screen was saved.');
            console.log("[SUCC]Done on :" + myUrl);
        }
    catch (e)
        {
            //console.log(e);
            console.log("[FAIL]Cannot go to for :" + myUrl + ', continue...');
        }
    await page.close();

  }
  await browser.close();

};

async function run_single(myUrl, name){

    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    //if you do not use this, error will happen on CentOS 7
    var page = null;
    try
    {
        page = await browser.newPage();

        var arrayOfStrings = String(myUrl).split('/');

        var name = (typeof name !== 'undefined') ?  name : arrayOfStrings[arrayOfStrings.length-1];

        console.log("The store location is at " + name);

        await page.goto(myUrl,  { timeout: 5000 }); //5000 is 5000ms

        const url = await page.url();

        console.log('[1] Redirection: from url:<' + myUrl + '> to <' + url + '>');

        var directionChain = 'Redirection: from url:<' + myUrl + '> to <' + url + '>';

        await fs.writeFile(name + '.redirect', directionChain, (err) => {
            if (err) throw err;
            console.log('[1] Redirection Chain was successfully saved.');
        });

        let HTML = await page.content(); //content is enough for the HTML content

        var filepath = name + '.source.txt';
        await fs.writeFile(filepath, HTML, (err) => {
            if (err) throw err;
            console.log('[2] HTML was successfully saved.');
        });

        await page.setViewport({width: 1600, height: 800});
        await page.screenshot({path: name + '.screen.png'});

        console.log('[3] Screen was saved.');
        await page.close();
    }
    catch(e)
        {
          console.log('Cannot go to for ' + myUrl + ', stop the browser...');
        }

    await browser.close();
};


var url =  "https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&ru=https%3A%2F%2Fwww.ebay.com%2F";
url = "https://www.paypal.com/signin?country.x=US&locale.x=en_US";
url = "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&rver=6.7.6643.0&wp=MBI_SSL&wreply=https%3a%2f%2fwww.microsoft.com%2fen-us%2f&lc=1033&id=74335&aadredir=1"

url = "https://adobeid-na1.services.adobe.com/renga-idprovider/pages/login?callback=https%3A%2F%2Fims-na1.adobelogin.com%2Fims%2Fadobeid%2Fadobedotcom2%2FAdobeID%2Ftoken%3Fredirect_uri%3Dhttps%253A%252F%252Fwww.adobe.com%252F%2523from_ims%253Dtrue%2526old_hash%253D%2526api%253Dauthorize&client_id=adobedotcom2&scope=creative_cloud%2CAdobeID%2Copenid%2Cgnav%2Cread_organizations%2Cadditional_info.projectedProductContext%2Csao.ACOM_CLOUD_STORAGE%2Csao.stock%2Csao.cce_private%2Cadditional_info.roles&denied_callback=https%3A%2F%2Fims-na1.adobelogin.com%2Fims%2Fdenied%2Fadobedotcom2%3Fredirect_uri%3Dhttps%253A%252F%252Fwww.adobe.com%252F%2523from_ims%253Dtrue%2526old_hash%253D%2526api%253Dauthorize%26response_type%3Dtoken&display=web_v2&relay=d54a1b5b-e86f-46f6-a036-3b5afa479a72&locale=en_US&flow_type=token&idp_flow_type=login";
url = "https://www.facebook.com/";
url = "https://accounts.google.com/signin/v2/identifier?hl=en&passive=true&continue=https%3A%2F%2Fwww.google.com%2F&flowName=GlifWebSignIn&flowEntry=ServiceLogin";
url = "https://retail.santander.co.uk/LOGSUK_NS_ENS/BtoChannelDriver.ssobto?dse_operationName=LOGON"
url = "https://www.dropbox.com/login"
//run_single(url,'109');
//run_single(url, '194');