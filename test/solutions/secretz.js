var crypto = require('crypto');
var tar = require('tar');
var zlib = require('zlib');
var concat = require('concat-stream');

var parser = tar.Parse();
parser.on('entry', function (e) {
    if (e.type !== 'File') return;
    
    var h = crypto.createHash('md5', { encoding: 'hex' });
    e.pipe(h).pipe(concat(function (hash) {
        console.log(hash + ' ' + e.path);
    }));
});

var cipher = process.argv[2];
var pw = process.argv[3];
process.stdin
    .pipe(crypto.createDecipher(cipher, pw))
    .pipe(zlib.createGunzip())
    .pipe(parser)
;
