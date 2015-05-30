var sid = process.env.TWILIO_ACCOUNT_SID;
var auth_token = process.env.TWILIO_AUTH_TOKEN;
var from_number = process.env.TWILIO_FROM_NUMBER;
var rest_endpoint = process.env.REST_ENDPOINT;

var client = require('twilio')(sid, auth_token);

var sendMessage = exports.sendMessage = function(to, msg, cb) {

    console.log("sending msg to" + to);

    client.sendMessage({

        to: to,
        from: from_number,
        body: msg

    }, function(error, message) {

        if (error) {
            console.error('We couldn\'t send the message');
            console.error(error);
        } else {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
        }
        cb || cb(error, response);
    });
}

var makeCall = exports.makeCall = function(to, cb) {

    client.makeCall({

        to: to,
        from: from_number,
        url: rest_endpoint + 'createVoiceMsg/hi'

    }, function(error, response) {

        if (error) {
            console.error('We couldn\'t make the call');
            console.error(error);
        } else {

            console.log('Call made on:');
            console.log(response);
        }
        cb || cb(error, response);

    });

};

var createVoiceMsg = exports.createVoiceMsg = function(req, res, next) {

    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();

    var options = {
        voice: 'woman',
        language: 'en-gb'
    };

    twiml
        .say('Hi from Sos', options);

    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });

    res.end(twiml.toString());
    next();

}

module.exports = exports;
