//author ketian
//ririhedou@gmail.com

module.exports =
{
    run_mobile_multiple_urls : run_mobile_multiple_urls,
    run_single : run_mobile_single
}

const fs = require('fs');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const globalDir = './';


//terminate the process in case some weird things happen
process.on('unhandledRejection', up => { throw up });

async function run_mobile_multiple_urls(urlList, nameList, globalDir){

  var page = null;

  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  //if you do not use this, error will happen on CentOS 7

  const iPhone = devices['iPhone 6'];

  var arrayLength = urlList.length;

  for (var i = 0; i < arrayLength; i++) {

    //the i-th element
    var myUrl = urlList[i];

    console.log("[TEST MOBILE]Visiting  :" + myUrl);

    page = await browser.newPage();

    await page.emulate(iPhone);

    try {
            var arrayOfStrings = String(myUrl).split('/');

            var name = globalDir + nameList[i];

            await page.goto(myUrl,  { timeout: 50000 }); //5000 is 5000ms

            //await page.waitForNavigation();

            const url = await page.url();

            //console.log('[1] Redirection: from url:<' + myUrl + '> to <' + url + '>');

            var directionChain = 'Redirection: from url:<' + myUrl + '> to <' + url + '>';

            await fs.writeFile(name + '.mobile.redirect', directionChain, (err) => {
                if (err) throw err;
                //console.log('[1] Redirection Chain was successfully saved.');
            });

            let HTML = await page.content(); //content is enough for the HTML content

            var filepath = name + '.source.mobile.txt';
            await fs.writeFile(filepath, HTML, (err) => {
                if (err) throw err;
                //console.log('[2] HTML was successfully saved.');
            });

            await page.screenshot({path: name + '.screen.mobile.png'});

            //console.log('[3] Screen was saved.');
            console.log("[SUCC MOBILE]Done on :" + myUrl);
        }
    catch (e)
        {
            //console.log(e);
            console.log("[FAIL MOBILE]Cannot go to for :" + myUrl + ", continue...");
        }

    await page.close();

  }
  await browser.close();

};



//run the mobile version for a single URL, most used for testing
async function run_mobile_single(myUrl, name,  globalDir){

    const browser = await puppeteer.launch({ignoreHTTPSErrors: true, args: ['--no-sandbox']});
    //if you do not use this, error will happen on CentOS 7

    const iPhone = devices['iPhone 6'];

    var page = null;

        page = await browser.newPage();

        await page.emulate(iPhone);

        //await page.setUserAgent(mobile_userAgent);

        var arrayOfStrings = String(myUrl).split('/');

        var name = (typeof name !== 'undefined') ?  name : arrayOfStrings[arrayOfStrings.length-1];

        name =  globalDir + name;

        console.log("The store location is at " + name);

        await page.goto(myUrl,  { timeout: 50000 }); //5000 is 5000ms

        const url = await page.url();

        console.log('[1] Redirection: from url:<' + myUrl + '> to <' + url + '>');

        var directionChain = 'Redirection: from url:<' + myUrl + '> to <' + url + '>';

        await fs.writeFile(name + '.mobile.redirect', directionChain, (err) => {
            if (err) throw err;
            console.log('[1] Redirection Chain was successfully saved.');
        });

        let HTML = await page.content(); //content is enough for the HTML content

        var filepath = name + '.mobile.source.txt';
        await fs.writeFile(filepath, HTML, (err) => {
            if (err) throw err;
            console.log('[2] HTML was successfully saved.');
        });

        //await page.setViewport({width: 1600, height: 800});
        await page.screenshot({path: name + '.mobile.screen.png'});

        console.log('[3] Screen was saved.');
        await page.close();


    await browser.close();
};


