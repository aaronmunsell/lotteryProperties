// Author: Aaron Munsell
// Date: 20191004

// This program aims to find some statistical properties in regard to
// winning powerball numbers.

const request = require("request");
const path = require("path");
const http = require("http");
const Stream = require("stream").Transform;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
let readline = require("readline");
let balls = [];
let modeBalls = {};
let powerballs = [];
let modePowerballs = {};

// Prompt user for a lottery.net URL.
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(">>Please input a valid lottery.net URL: ", function(answer) {
  //console.log("you entered: " + answer);
  requestDOM(answer);

  rl.close();
});

function requestDOM(url) {
  request(url, function(err, res, body) {
    // Fail out if this is an invalid request.
    if (err) throw err;
    // Define the DOM.
    let documentObject = new JSDOM(body);
    // Go through each element that contains the lotto numbers.
    let allNumbers = documentObject.window.document.querySelectorAll(
      ".results.powerball>.ball"
    );
    // Loop through each one.
    //let counter = 0;
    Array.prototype.forEach.call(allNumbers, function(elements, index) {
      let numbers = elements.innerHTML.replace(" ", "");
      balls.push(parseInt(numbers));
      //console.log(counter + ": " + parseInt(numbers));
      //counter++;
    });
    balls.sort((a, b) => a - b);
    // Array.prototype.forEach.call(balls, function(elements, index) {
    //   console.log("balls: " + elements);
    // });

    for (let i = 0; i < balls.length; i++) {
      if (!modeBalls[balls[i]]) {
        modeBalls[balls[i]] = 0;
      }
      modeBalls[balls[i]] += 1;
    }

    console.log("mode balls: " + modeBalls);

    let powerballNumbers = documentObject.window.document.querySelectorAll(
      ".results.powerball>.powerball"
    );

    Array.prototype.forEach.call(powerballNumbers, function(elements, index) {
      powerballs.push(parseInt(elements.innerHTML.replace(" ", "")));
    });

    powerballs.sort((a, b) => a - b);

    for (let i = 0; i < powerballs.length; i++) {
      if (!modePowerballs[powerballs[i]]) {
        modePowerballs[powerballs[i]] = 0;
      }
      modePowerballs[powerballs[i]] += 1;
    }

    console.log(modePowerballs);
  });
}
