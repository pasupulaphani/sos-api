/*jslint node: true, indent: 2 */
'use strict';
var restify, bunyan, routes, log, server;

restify = require('restify');
bunyan = require('bunyan');
routes = require('./routes/');

log = bunyan.createLogger({
    name: 'sos-api',
    level: process.env.LOG_LEVEL || 'info',
    stream: process.stdout,
    serializers: bunyan.stdSerializers
});

server = restify.createServer({
    name: 'sos-api',
    log: log,
    formatters: {
        'application/json': function(req, res, body) {
            res.setHeader('Cache-Control', 'must-revalidate');

            // Does the client *explicitly* accepts application/json?
            if (!req.header('Accept')) {
                return body;
            }
            var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);

            // Send as plain text
            if (sendPlainText) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            }

            // Send as JSON
            if (!sendPlainText) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
            }
            return JSON.stringify(body);
        }
    }
});

server.use(restify.bodyParser({
    mapParams: false
}));
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());

server.on('after', restify.auditLogger({
    log: log
}));
routes(server);

var port = process.env.PORT || 8888;
console.log('Server started.');
server.listen(port, function() {
    log.info('%s listening at %s', server.name, server.url);
});
