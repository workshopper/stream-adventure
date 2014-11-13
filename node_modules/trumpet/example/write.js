var trumpet = require('../');
var tr = trumpet();
tr.pipe(process.stdout);

var ws = tr.select('title').createWriteStream();
ws.end('beep boop.');

var fs = require('fs');
fs.createReadStream(__dirname + '/html/write.html').pipe(tr);
