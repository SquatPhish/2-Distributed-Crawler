#! /usr/bin/env node

//import functions
const mobile = require('./mobile');
const web = require('./web');


var url = "https://www.paypal.com/signin?country.x=US&locale.x=en_US"; //paypal signin

console.log("Run test for Paypal signin");
mobile.run_single(url, 'test-mb');
web.run_single(url, 'test-web')