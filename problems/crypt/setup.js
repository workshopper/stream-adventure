var through = require('through');
var fs = require('fs');
var crypto = require('crypto');
var words = require('./words.json');

module.exports = function () {
    
    var pw = words[Math.floor(Math.random() * words.length)];
    var input = crypto.createCipher('aes256', pw);
    if (!input.pipe) {
        console.error('Your version of node is too old to play this level.');
        console.error('Please use node >= 0.10.');
        process.exit(1);
    }
    input.pause();
    
    fs.createReadStream(__dirname + '/finnegans_wake.txt').pipe(input);
    return { args: [ pw ], stdin: input, long: true };
};
