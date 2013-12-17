var spawn = require('child_process').spawn;
var test = require('tape');

//var adventures = require('../data/order.json');
test(function (t) {
    t.plan(2);
    
    var name = 'BEEP BOOP';
    var ps = run([ 'select', name ]);
    ps.on('exit', selected);
    ps.stderr.pipe(process.stderr);
    
    function selected (code) {
        t.equal(code, 0);
        var ps = run([ 'verify', __dirname + '/solutions/beep.js' ]);
        ps.on('exit', verified);
        ps.stderr.pipe(process.stderr);
    }
    
    function verified (code) {
        t.equal(code, 0);
    }
});

function run (args) {
    args.unshift(__dirname + '/../bin/cmd.js');
    return spawn(process.execPath, args);
}
