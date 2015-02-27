var fs = require('fs');

module.exports = function () {
    var stdin = fs.createReadStream(__dirname + '/input.html');
    stdin;
    return { args: [], stdin: stdin, long: true };
};
