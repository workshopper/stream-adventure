var through = require('through');
var fs = require('fs');
var crypto = require('crypto');
var ciphers = [ 'AES-192-CBC', 'RC4', 'BF-CBC' ];

module.exports = function () {
    var cipher = ciphers[Math.floor(Math.random() * ciphers.length)];
    var pw = phrase();
    var input = crypto.createCipher(cipher, pw);
    if (!input.pipe) return tooOld();
    input.pause();
    
    fs.createReadStream(__dirname + '/secretz.tar.gz').pipe(input);
    return { args: [ cipher, pw ], stdin: input, long: true };
};

function phrase () {
    var s = '';
    for (var i = 0; i < 16; i++) {
        s += String.fromCharCode(Math.random() * 26 + 97);
    }
    return s;
}

function tooOld() {
    console.error('Your version of node is too old to play this level.');
    console.error('Please use node >= 0.10.');
    process.exit(1);
}
