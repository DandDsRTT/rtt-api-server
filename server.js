require("dotenv/config")
const express = require("express")
const cors = require("cors")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const BASE_URL = "https://www.wolframcloud.com/obj/douglas.blumeyer"

const server = express()

server.use(cors)

server.get("*", (req, res) => {
    let WolframCloudCall;

    (function() {
        WolframCloudCall = function() {	this.init(); };

        const p = WolframCloudCall.prototype;

        p.init = function() {};

        p._createCORSRequest = function(method, url) {
            let xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest != "undefined") {
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                xhr = null;
            }
            return xhr;
        };

        p._auxCall = function(url, callback) {
            const xhr = this._createCORSRequest("post", url);
            if (xhr) {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.setRequestHeader("EmbedCode-User-Agent", "EmbedCode-JavaScript/1.0");
                xhr.onload = function() {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        callback(xhr.responseText);
                    } else {
                        callback(null);
                    }
                };
                xhr.send();
            } else {
                throw new Error("Could not create request object.");
            }
        };

        p.call = function(endpoint, callback) {
            const url = BASE_URL + endpoint;
            const callbackWrapper = function(result) {
                if (result === null) callback(null);
                else callback(result);
            };
            this._auxCall(url, callbackWrapper);
        };
    })();

    console.log("is this thing on?")
    const wcc = new WolframCloudCall();
    wcc.call(req.url, function(result) { 
        console.log("result:", result)
        res.send(result)
    });
})

server.listen(process.env.PORT)

// "/optimizeGeneratorTuningMap?unparsedT=%5B%3C1%201%200%5D%20%3C0%201%204%5D%7D&tuningSchemeSpec=TILT%20minimax-U"
