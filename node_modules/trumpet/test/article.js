var trumpet = require('../');
var test = require('tape');
var concat = require('concat-stream');
var fs = require('fs');

test(function (t) {
    t.plan(2);
    
    var tr = trumpet();
    tr.createReadStream('article username').pipe(concat(function (body) {
        t.equal(body.toString(), '<a href="/user/echojs">echojs</a>');
    }));
    
    tr.createReadStream('article span').pipe(concat(function (body) {
        t.equal(body.toString(), '2');
    }));
    
    fs.createReadStream(__dirname + '/article.html').pipe(tr);
});
