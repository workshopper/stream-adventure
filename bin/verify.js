var spawn = require('child_process').spawn;
var tuple = require('tuple-stream');
var through = require('through');
var split = require('split');
var path = require('path');

var x256 = require('x256');

var COLORS = (function () {
    var c = {
        PASS: [0,255,0],
        FAIL: [255,0,0],
        INFO: [0,255,255]
    };
    return Object.keys(c).reduce(function (acc, key) {
        acc[key] = '\x1b[38;5;' + x256(c[key]) + 'm';
        return acc;
    }, {});
})();
COLORS.RESET = '\x1b[00m';

module.exports = function (acmd, bcmd, opts) {
    if (!opts) opts = {};
    
    var a;
    if (typeof opts.a === 'function') {
        a = opts.a(acmd);
    }
    else {
        a = /^[.\/]/.test(acmd[0]) && !/\.js$/.test(acmd[0])
            ? spawn(acmd[0], acmd.slice(1))
            : spawn(process.execPath, acmd)
        ;
    }
    if (a && a.on) {
        a.on('kill', function () { if (a.kill) a.kill() });
    }
    
    if (opts.run) {
        (a.stdout || a).pipe(process.stdout);
        if (a.stderr) a.stderr.pipe(process.stderr);
        return a.stdin || a;
    }
    
    var b;
    if (typeof opts.b === 'function') {
        b = opts.b(bcmd);
    }
    else {
        b = spawn(process.execPath, bcmd);
    }
    if (opts.b && opts.b.on) {
        b.on('kill', function () { if (b.kill) b.kill() });
    }
    
    var c = compare(a.stdout || a, b.stdout || b, opts);
    
    if (opts.showStdout) {
        (a.stdout || a).pipe(process.stdout);
        if (a.stderr) a.stderr.pipe(process.stderr);
        (b.stdout || b).pipe(process.stdout);
        if (b.stderr) b.stderr.pipe(process.stderr);
    }
    
    c.on('pass', function () { kill(); tr.emit('pass') });
    c.on('fail', function () { kill(); tr.emit('fail') });
    
    var tr = through();
    tr.pipe(a.stdin || a);
    tr.pipe(b.stdin || b);
    
    return tr;
    
    function kill () {
        if (a.kill) a.kill();
        if (b.kill) b.kill();
    }
};

function compare (actual, expected, opts) {
    var equal = true;
    var output = through(write, end).pause();
    
    output.queue(COLORS.RESET);
    
    if (!opts.long) {
        output.queue(wrap('ACTUAL', 30) + '     EXPECTED\n');
        output.queue(wrap('------', 30) + '     --------\n');
    }
    
    tuple(actual.pipe(split()), expected.pipe(split()))
        .pipe(output)
        .pipe(process.stdout)
    ;
    output.resume();
    return output;
    
    function write (pair) {
        var eq = pair[0] === pair[1];
        equal = equal && eq;
        
        if (opts.long) {
            this.queue('ACTUAL:   '
                + COLORS[eq ? 'PASS' : 'FAIL']
                + JSON.stringify(pair[0])
                + COLORS.RESET + '\n'
                + 'EXPECTED: '
                + JSON.stringify(pair[1])
                + '\n\n'
            );
        }
        else {
            this.queue(
                COLORS[eq ? 'PASS' : 'FAIL']
                + wrap(JSON.stringify(pair[0]), 30)
                + ' ' + (eq ? '   ' : '!==') + ' '
                + wrap(JSON.stringify(pair[1]), 30)
                + '\n'
            );
        }
    }
    
    function end () {
        output.queue(COLORS.RESET);
        this.queue(null);
        this.emit(equal ? 'pass' : 'fail');
    }
}

function wrap (s_, n) {
    var s = String(s_);
    return s + Array(Math.max(0, n + 1 - s.length)).join(' ');
}
