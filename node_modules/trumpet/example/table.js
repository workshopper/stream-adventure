var trumpet = require('../');
var tr = trumpet();
tr.pipe(process.stdout);
 
var ws = tr.select('tbody').createWriteStream();
ws.end('<tr><td>rawr</td></tr>');

var fs = require('fs');
fs.createReadStream(__dirname + '/html/table.html').pipe(tr);
