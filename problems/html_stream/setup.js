var through = require('through');
var fs = require('fs');

module.exports = function () {
    var stdin = fs.createReadStream(__dirname + '/input.html');
    stdin.pause();
    return { args: [], stdin: stdin, long: true };
};
