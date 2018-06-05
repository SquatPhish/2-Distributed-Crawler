#! /usr/bin/env node

//author ketian
//ririhedou@gmail.com

const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

const chunkId = (argv.id.toString() || '').toString();

//import functions
const mobile = require('./mobile');
const web = require('./web');


function read_candidates(filename)
{
   var lines = fs.readFileSync(filename, 'utf8').split('\n').filter(Boolean);
   var urlList  = new Array();
   var nameList = new Array();
   for (var i in lines)
   {
          var arr = lines[i].split(",");
          var _id = arr[0];
          var url = arr[1];
          //console.log(_id);
          //console.log(url);
          nameList.push(_id);
          urlList.push(url);
   }

   return {
     urlList: urlList,
     nameList: nameList
   };
}

function checkDirectorySync(directory) {
  try {

    fs.statSync(directory);
    console.log("Existing " + directory + ", no need to recreate");
    //process.exit();

  } catch(e) {
    fs.mkdirSync(directory);
    console.log("Create a directory as " + directory);
  }
}


async function run_file_in_distributed_fashion(chunkId)
{

    var res = read_candidates("./chunks/" + chunkId.toString() + ".txt")
    var urlList = res.urlList;
    var nameList = res.nameList;

    var web_dir = "./data/" + chunkId.toString() + "_web/"
    var mobile_dir = "./data/" + chunkId.toString() + "_mobile/"

    checkDirectorySync(web_dir);
    checkDirectorySync(mobile_dir);


    var length = urlList.length;
    var interval = 5;
    for (var i = 0; i < length; i = i+interval)
    {
        var subArray = urlList.slice(i,i+interval);
        var name = nameList.slice(i,i+interval);

        try
        {
            await mobile.run_mobile_multiple_urls(subArray, name, mobile_dir);
        }
        catch (e)
        {
           console.log("[FXXK MOBILE]Browser launch failed, lose urls");
        }

        try
        {
            await web.run_web_multiple_urls(subArray, name, web_dir);
        }
        catch (e)
        {
           console.log("[FXXK]Browser launch failed, lose urls");
        }
    }

    process.exit(0);

}

run_file_in_distributed_fashion(chunkId);