var sid = process.env.TWILIO_ACCOUNT_SID;
var auth_token = process.env.TWILIO_AUTH_TOKEN;
var from_number = process.env.TWILIO_FROM_NUMBER;
var rest_endpoint = process.env.REST_ENDPOINT;

var client = require('twilio')(sid, auth_token);

var sendMessage = exports.sendMessage = function(to, msg) {

    console.log("sending msg to " + to);

    var promise = client.sendMessage({
        to: to,
        from: from_number,
        body: msg
    });

    return promise;
}

var makeCall = exports.makeCall = function(to, msgType, cb) {

    msgType = msgType || 'sos';
    client.makeCall({

        to: to,
        from: from_number,
        url: rest_endpoint + 'createVoiceMsg/' + msgType

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

    var msg = "sos default msg"
    if (req.param.msgType == "sos") {
        msg = "Please call police if you do not hear from me in 10mins"
    };
    twiml
        .say(msg, options);

    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });

    res.end(twiml.toString());
    next();

}

module.exports = exports;
