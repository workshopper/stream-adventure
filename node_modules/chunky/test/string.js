var chunky = require('../');
var test = require('tap').test;

test('string chunks', function (t) {
    t.plan(100 + 4);
    
    var dist = {};
    for (var i = 0; i < 100; i++) {
        var msg = [
            'This is a message from the future:',
            '  Disregard computers. Obtain molybdenum.'
        ].join('\r\n');
        
        var chunks = chunky(msg);
        t.equal(chunks.join(''), msg);
        dist[chunks.length] = (dist[chunks.length] || 0) + 1;
    }
    
    t.ok(dist[5] >= 5);
    t.ok(dist[6] >= 5);
    
    t.ok(dist[5] > (dist[2] || 0));
    t.ok(dist[6] > (dist[10] || 0));
    t.end();
});
