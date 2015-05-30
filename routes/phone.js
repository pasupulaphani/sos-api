/*jslint node: true, stupid: true */
'use strict';
var fs = require('fs');
var twilioClient = require('../common/twilioClient');

module.exports = function(server) {

    var _genErrResp = function(error) {
        return {
            error: {
                info: error.info,
                code: error.code
            }
        }
    }

    function sendMessage(req, res, next) {
        twilioClient.sendMessage(req.params.number, req.body, function(error, response) {
            if (error) {
                res.json(_genErrResp(error), 500);
            } else {
                res.sendStatus(200);
            }
            next();
        });
    }

    function makeCall(req, res, next) {
        twilioClient.makeCall(req.params.number, function() {
            console.log("cb exec")
        });
        res.send('Call made to ' + req.params.number);
        next();
    }

    server.post('/text/:number', sendMessage);
    server.post('/call/:number', makeCall);
    server.post('/createVoiceMsg', twilioClient.createVoiceMsg);
};
