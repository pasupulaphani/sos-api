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
        twilioClient.sendMessage(req.params.number, req.body)
            .then(function(message) {

                console.log('Success! The SID for this SMS message is:');
                console.log(message.sid);

                console.log('Message sent on:');
                console.log(message.dateCreated);
                res.send(200);
                next();

            }, function(error) {

                console.error('We couldn\'t send the message');
                console.error(error);
                res.json(_genErrResp(error), 500);
                next();

            });
    }

    function makeCall(req, res, next) {
        twilioClient.makeCall(req.params.number, 'sos', function() {
            console.log("cb exec")
        });
        res.send('Call made to ' + req.params.number);
        next();
    }

    server.post('/text/:number', sendMessage);
    server.post('/call/:number', makeCall);
    server.post('/createVoiceMsg', twilioClient.createVoiceMsg);
};
