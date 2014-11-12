var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('uppercase script contents', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var ts = tr.select('script').createStream();
    ts.pipe(through(function (buf) {
        this.queue(buf.toString().toUpperCase());
    })).pipe(ts);
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<html><head>'
            + '<script type="robots">BEEPITY BOOP</script>'
            + '</head></html>'
        );
    }));
    
    tr.write('<html><head>');
    tr.write('<script type="robots">beepity boop</script>');
    tr.write('</head></html>');
    tr.end();
});

test('uppercase script outer', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var ts = tr.select('script').createStream({ outer: true });
    ts.pipe(through(function (buf) {
        this.queue(buf.toString().toUpperCase());
    })).pipe(ts);
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<html><head>'
            + '<SCRIPT TYPE="ROBOTS">BEEPITY BOOP</SCRIPT>'
            + '</head></html>'
        );
    }));
    
    tr.write('<html><head>');
    tr.write('<script type="robots">beepity boop</script>');
    tr.write('</head></html>');
    tr.end();
});
