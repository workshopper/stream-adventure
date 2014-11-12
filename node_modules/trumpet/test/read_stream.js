var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');
var html = fs.readFileSync(__dirname + '/read_stream.html');

test('outer stream', function (t) {
    t.plan(3);
    
    var tr = trumpet();
    
    tr.select('.a').createReadStream({ outer: true })
        .pipe(concat(function (body) {
            t.equal(body.toString(), '<div class="a">AAA</div>');
        }))
    ;
    
    var b = tr.select('.b');
    b.getAttribute('class', function (v) { t.equal(v, 'b') });
    b.createReadStream({ outer: true }).pipe(concat(function (body) {
        t.equal(body.toString(), '<div class="b">X<b>Y</b>Z</div>');
    }));
    
    fs.createReadStream(__dirname + '/read_stream.html').pipe(tr);
});

test('read stream', function (t) {
    t.plan(3);
    
    var tr = trumpet();
    
    tr.select('.a').createReadStream().pipe(concat(function (body) {
        t.equal(body.toString(), 'AAA');
    }));
    
    var b = tr.select('.b');
    b.getAttribute('class', function (v) { t.equal(v, 'b') });
    b.createReadStream().pipe(concat(function (body) {
        t.equal(body.toString(), 'X<b>Y</b>Z');
    }));
    
    fs.createReadStream(__dirname + '/read_stream.html').pipe(tr);
});

test('overlapping read streams', function (t) {
    t.plan(4);
    
    var tr = trumpet();
    var body = tr.select('body');
    body.createReadStream().pipe(concat(function (src) {
        var i = /<body>/.exec(html).index + 6;
        var j = /<\/body>/.exec(html).index;
        t.equal(src.toString(), html.slice(i, j).toString());
    }));
    
    tr.select('.a').createReadStream().pipe(concat(function (body) {
        t.equal(body.toString(), 'AAA');
    }));
    
    var b = tr.select('.b');
    b.getAttribute('class', function (v) { t.equal(v, 'b') });
    b.createReadStream().pipe(concat(function (body) {
        t.equal(body.toString(), 'X<b>Y</b>Z');
    }));
    
    fs.createReadStream(__dirname + '/read_stream.html').pipe(tr);
});

test('stream all divs', function (t) {
    t.plan(9);
    var html = [ 'AAA', 'X<b>Y</b>Z', 'CCC' ];
    var classes = [ 'a', 'b', 'c' ];
    
    var tr = trumpet();
    tr.selectAll('div', function (div) {
        var c_ = classes.shift();
        t.equal(div.getAttribute('class'), c_);
        
        div.getAttribute('class', function (c) {
            t.equal(c, c_);
        });
        
        div.createReadStream().pipe(concat(function (src) {
            t.equal(src.toString(), html.shift());
        }));
    });
    
    fs.createReadStream(__dirname + '/read_stream.html').pipe(tr);
});

test("end event when no match", function(t) {
    // Make sure an end event is emitted even with no "h1" element"
    var tr = trumpet();
    tr.createReadStream("h1").on("end", function() {
        t.end();
    });
    fs.createReadStream(__dirname + '/read_stream.html').pipe(tr);
});
