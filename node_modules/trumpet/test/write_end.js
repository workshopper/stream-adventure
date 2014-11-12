var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('write end', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    tr.select('.x b', function (elem) {
        var ws = elem.createWriteStream();
        ws.end('beep boop');
    });
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<!doctype html>\n'
            + '<html>\n<body>\n<div class="x"><b>beep boop</b></div>\n'
            + '</body>\n</html>\n'
        );
    }));
    
    fs.createReadStream(__dirname + '/write_end.html').pipe(tr);
});

test('write end string', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    tr.select('.x b', function (elem) {
        var ws = elem.createWriteStream();
        ws.end('beep boop');
    });
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<!doctype html>\n'
            + '<html>\n<body>\n<div class="x"><b>beep boop</b></div>\n'
            + '</body>\n</html>\n'
        );
    }));
    
    var html = fs.readFileSync(__dirname + '/write_end.html', 'utf8');
    tr.end(html);
}); 
