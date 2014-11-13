var select = require('../');
var test = require('tape');
var tokenize = require('html-tokenize');
var through = require('through2');
var fs = require('fs');

var expected = [
    'echojs',
    'echojs',
    'efcl',
    'efcl',
    'efcl',
    'aneesha',
    'echojs',
    '紫云飞',
    '紫云飞',
    '紫云飞',
    'carldanley',
    'eskimoblood',
    'pazguille',
    'echojs',
    'echojs',
    '紫云飞',
    'carldanley',
    '紫云飞',
    'echojs',
    'eskimoblood',
    '紫云飞',
    '紫云飞',
    '紫云飞',
    'carldanley',
    '紫云飞',
    '紫云飞',
    'echojs',
    'echojs',
    'echojs',
    'echojs'
];

test('article', function (t) {
    t.plan(expected.length);
    var s = select();
    s.select('article username a[href]', function (e) {
        e.createReadStream().pipe(through.obj(function (row, enc, next) {
            if (row[0] === 'text') {
                t.equal(row[1].toString('utf8'), expected.shift());
            }
            next();
        }));
    });
    fs.createReadStream(__dirname + '/article/index.html')
        .pipe(tokenize()).pipe(s)
    ;
    s.resume();
});
