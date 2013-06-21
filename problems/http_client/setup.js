var through = require('through');
var http = require('http');
var words = require('./words.json');

module.exports = function () {
    var tr = through().pause();
    
    var count = 0;
    var iv = setInterval(function () {
        if (++count === 10) {
            clearInterval(iv);
            return tr.queue(null);
        }
        var word = words[Math.floor(Math.random() * words.length)];
        tr.queue(word.toLowerCase() + '\n');
    }, 50);
    
    var server = http.createServer(function (req, res) {
        if (req.method !== 'POST') {
            res.end('not a POST request');
        }
        else {
            req.pipe(through(function (buf) {
                this.queue(buf.toString().replace(/\S/g, function (c) {
                    var x = c.charCodeAt(0);
                    if (/[a-z]/.test(c)) {
                        return String.fromCharCode(137 * (x - 97) % 26 + 97);
                    }
                    else if (/[A-Z]/.test(c)) {
                        return String.fromCharCode(139 * (x - 65) % 26 + 65);
                    }
                    else return c;
                }));
            })).pipe(res);
        }
    });
    server.listen(8000);
    
    return {
        args: [],
        stdin: tr,
        close: server.close.bind(server),
        wait: 500
    };
};
