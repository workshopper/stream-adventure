var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');

test('selected element has attribute [att]', function (t) {
    t.plan(1);

    var tr = trumpet();
    tr.createReadStream('li[data-foo]').pipe(concat(function (elem) {
        t.equal(elem.toString(), 'item2');
    }));
    fs.createReadStream(__dirname + '/attribute_selectors.html').pipe(tr);
});

test('selected element has attribute value [att=val]', function (t) {
    t.plan(1);

    var tr = trumpet();
    tr.createReadStream('li[class="item1 item-first"]').pipe(concat(function (elem) {
        t.equal(elem.toString(), 'item1');
    }));
    fs.createReadStream(__dirname + '/attribute_selectors.html').pipe(tr);
});

test('selected element contains whitespace separated attribute value [att~=val]', function (t) {
    t.plan(1);

    var tr = trumpet();
    tr.createReadStream('li[class~=item-first]').pipe(concat(function (elem) {
        t.equal(elem.toString(), 'item1');
    }));
    fs.createReadStream(__dirname + '/attribute_selectors.html').pipe(tr);
});

test('selected element attribute value equals or starts with and followed by - [att|=val]', function (t) {

    var items = ['item1', 'item3', 'item4'];
    t.plan(items.length);

    var tr = trumpet();
    tr.selectAll('li[data-role|=item]', function (elem) {
        elem.createReadStream().pipe(concat(function (src) {
            t.equal(src.toString(), items.shift());
        }));
    });

    fs.createReadStream(__dirname + '/attribute_selectors.html').pipe(tr);
});

test('selected element has attribute (att) value starting with (val) [att^=val]', function (t) {

    var items = ['item1', 'item2', 'item3', 'item4'];
    t.plan(items.length);

    var tr = trumpet();
    tr.selectAll('li[class^=item]', function (elem) {
        elem.createReadStream().pipe(concat(function (src) {
            t.equal(src.toString(), items.shift());
        }));
    });

    fs.createReadStream(__dirname + '/attribute_selectors.html').pipe(tr);
});

test('selected element has attribute (att) value ending with (val) [att$=val]', function (t) {

    var items = ['item4'];
    t.plan(items.length);

    var tr = trumpet();
    tr.selectAll('li[data-role$=last]', function (elem) {
        elem.createReadStream().pipe(concat(function (src) {
            t.equal(src.toString(), items.shift());
        }));
    });

    fs.createReadStream(__dirname + '/attribute_selectors.html').pipe(tr);
});

test('selected element has attribute (att) value containing (val) [att*=val]', function (t) {

    var items = ['item2', 'item5'];
    t.plan(items.length);

    var tr = trumpet();
    tr.selectAll('li[data-foo*=random]', function (elem) {
        elem.createReadStream().pipe(concat(function (src) {
            t.equal(src.toString(), items.shift());
        }));
    });

    fs.createReadStream(__dirname + '/attribute_selectors.html').pipe(tr);
});
