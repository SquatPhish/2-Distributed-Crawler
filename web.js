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
process.on('unhandledRejection', up => { throw up });

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
