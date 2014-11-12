var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');

test('multi file write stream in order', function (t) {
    t.plan(1);

    var tr = trumpet();

    var sx = fs.createReadStream(__dirname + '/multi_file_write_stream_x.html');
    var sy = fs.createReadStream(__dirname + '/multi_file_write_stream_y.html');

    var wsx = tr.select('.x').createWriteStream();
    var wsy = tr.select('.y').createWriteStream();

    sx.pipe(wsx);
    sy.pipe(wsy);

    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<!doctype html>\n'
            + '<html>\n<body>\n<div class="x">beep boop.\n</div>\n'
            + '<div class="y">beep beep boop.\n</div>\n'
            + '</body>\n</html>\n'
        );
    }));
    
    fs.createReadStream(__dirname + '/multi_file_write_stream.html').pipe(tr);
});
