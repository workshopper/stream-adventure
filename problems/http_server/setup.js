var through = require('through');
var duplexer = require('duplexer');
var hyperquest = require('hyperquest');
var words = require('./words.json');
var spawn = require('child_process').spawn;

module.exports = function (opts) {
    var aPort = Math.floor(Math.random() * 40000 + 10000);
    var bPort = aPort + 1;
    
    var offset = Math.floor(words.length*Math.random());
    var data = [];
    for (var i = 0; i < 20; i++) {
        var w = words[(offset+i)%words.length] + '\n';
        data.push(w);
    }
    var close = [];
    return {
        a: function (args) { return run(args, aPort) },
        b: function (args) { return run(args, bPort) },
        close: function () { close.forEach(function (f) { f() }) }
    };
    
    function run (args, port) {
        var ps = spawn(process.execPath, args.concat(port));
        ps.stderr.pipe(process.stderr);
        close.push(function () { ps.kill() });
        
        var stream = check(aPort);
        if (opts.run) {
            ps.stdout.pipe(process.stdout);
            stream.on('end', function () { ps.kill() });
        }
        return stream;
    }
    
    function check (port, cb) {
        var input = through();
        var output = through();
        setTimeout(function () {
            var hqa = hyperquest.post('http://localhost:' + port);
            hqa.on('error', function (err) {
                console.error('ACTUAL SERVER ' + err.stack);
            });
            input.pipe(hqa).pipe(output);
            
            var chunks = data.slice();
            var iv = setInterval(function () {
                if (chunks.length === 0) {
                    clearInterval(iv);
                    input.end();
                }
                else input.write(chunks.shift());
            });
        }, 500);
        return duplexer(input, output);
    }
};
