var spawn = require('child_process').spawn;
var path = require('path');
var test = require('tape');

var adventures = require('../menu.json');
adventures.forEach(function (name) {
    if (name === 'WEBSOCKETS') return;
    
    test(name, function (t) {
        t.plan(2);
        var file = name.toLowerCase().replace(/\s+/g, '_') + '.js';
        var solution = path.join(__dirname, 'solutions', file);
        
        var ps = run([ 'select', name ]);
        ps.on('exit', selected);
        ps.stderr.pipe(process.stderr);
        
        function selected (code) {
            t.equal(code, 0);
            var ps = run([ 'verify', solution ]);
            ps.on('exit', verified);
            ps.stderr.pipe(process.stderr);
        }
        
        function verified (code) {
            t.equal(code, 0);
        }
    });
});

function run (args) {
    args.unshift(path.join(__dirname, '../bin/cmd.js'));
    return spawn(process.execPath, args);
}
