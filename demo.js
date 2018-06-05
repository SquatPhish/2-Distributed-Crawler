#! /usr/bin/env node

//import functions
const mobile = require('./mobile');
const web = require('./web');


var url = "https://www.paypal.com/signin?country.x=US&locale.x=en_US"; //paypal signin

console.log("Run a single test for Paypal signin");
mobile.run_single(url, 'test-mb');
web.run_single(url, 'test-web');


console.log("Run multiple tests for facebook and apple");

var urls = [ "https://www.apple.com/", "https://github.com/login" , "https://www.facebook.com/"];
var names = ["apple","github-signin", "fb-signin"];
var output = "./test/";

mobile.run_mobile_multiple_urls(urls, names, output);
web.run_web_multiple_urls(urls, names, output);
