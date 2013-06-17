var through = require('through');
var chunky = require('chunky');
var fs = require('fs');
var data = fs.readFileSync(__dirname + '/finnegans_wake.txt');

module.exports = function () {
    var chunks = chunky(data);
    var iv = setInterval(function () {
        var buf = chunks.shift();
        if (!buf) { clearInterval(iv); tr.queue(null) }
        else this.queue(buf)
    }, 50);
    
    return { args: [], stdin: tr };
};
