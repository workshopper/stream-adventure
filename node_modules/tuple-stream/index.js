var through = require('through');

module.exports = function (a, b) {
    var sa = a.pipe(through());
    var sb = b.pipe(through());
    var output = through();
    var slots = [ null, null ];
    var closed = [ false, false ];
    
    sa.pipe(through(function (buf) {
        slots[0] = buf;
        if (slots[1] === null && !closed[1]) {
            sa.pause();
        }
        else nextChunk();
    }, done(0)));
    
    sb.pipe(through(function (buf) {
        slots[1] = buf;
        if (slots[0] === null && !closed[0]) {
            sb.pause();
        }
        else nextChunk();
    }, done(1)));
    
    function nextChunk () {
        output.queue(slots);
        slots = [ null, null ];
        
        sa.resume();
        sb.resume();
    }
    
    var pending = 2;
    function done (n) {
        return function () {
            closed[n] = true;
            if (--pending === 0) output.queue(null);
            else if (!closed[0]) sa.resume();
            else if (!closed[1]) sb.resume();
        };
    }
    
    return output;
};
