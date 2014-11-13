var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('overlap prepend stream', function (t) {
    t.plan(1);
    var tr = trumpet();
    
    tr.selectAll('script', function (elem) {
        var a = elem.createStream({ outer: true })
        a.write('-----\n');
        a.pipe(through()).pipe(a);
    });
    
    var elem = tr.select('body');
    var b = elem.createStream();
    b.pipe(through(null, function () {
        this.queue('!!!!!\n');
        this.queue(null);
    })).pipe(b);
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<html>\n'
            + '<head>\n'
            + '-----\n'
            + '<script src="/a.js"></script>\n'
            + '</head>\n'
            + '<body>\n'
            + '-----\n'
            + '<script src="/b.js"></script>\n'
            + '!!!!!\n'
            + '</body>\n'
            + '</html>\n'
        );
    }));
    fs.createReadStream(__dirname + '/overlap_stream.html').pipe(tr);
});
