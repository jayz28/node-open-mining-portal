var events = require('events');
var net = require('net');

var listener = module.exports = function listener(port){

    var _this = this;
    var host = '10.0.2.4';
    var emitLog = function(text){
        _this.emit('log', text);
    };


    this.start = function () {
        var handler = function (c) {

            var data = '';
            try {
                c.on('data', function (d) {
                    data += d;
                    if (data.slice(-1) === '\n') {
                        var message = JSON.parse(data);
                        _this.emit('command', message.command, message.params, message.options, function (message) {
                            c.end(message);
                        });
                    }
                });
                c.on('end', function () {

                });
                c.on('error', function () {

                });
            }
            catch (e) {
                emitLog('CLI listener failed to parse message ' + data);
            }

        };

        net.createServer(handler).listen(port, host , function() {
            emitLog('CLI listening on ' + host  + 'port ' + port)
        });

        net.createServer(handler).listen(port, '127.0.0.1', function () {
            emitLog('CLI listening on 127.0.0.1 port ' + port)
        });
    }

};

listener.prototype.__proto__ = events.EventEmitter.prototype;
