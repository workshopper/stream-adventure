var select = require('../');
var test = require('tape');
var through = require('through2');
var devnull = require('dev-null');

test('cleanup tmp streams', function (t) {
    
    var divs = 5;

    t.plan(2*divs);
    
    var s = select();
    
    s.select('*', function (e) {
        t.equal(s.get(1).length, 2, 'only Match and PassThrough')
        e.on('close', function () { t.ok(true, 'closed') });
    });
   
    // write garbage to force buffering
    for (var i=0; i<divs; i++) {
      s.write([ 'open', '<div>' ]);
      s.write([ 'close', '</div>' ]);
    }
    s.end();
    s.pipe(devnull({objectMode: true}))
});
