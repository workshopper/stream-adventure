var through = require('through2');
var chunky = require('chunky');
var fs = require('fs');
var data = fs.readFileSync(__dirname + '/finnegans_wake.txt');

module.exports = function () {
    var tr = through();
    var chunks = chunky(data);
    var iv = setInterval(function () {
        var buf = chunks.shift();
        if (!buf) { clearInterval(iv); tr.end() }
        else tr.write(buf)
    }, 50);
    
    return { args: [], stdin: tr, long: true };
};
