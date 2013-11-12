var through = require('through');
var duplexer = require('duplexer');
var hyperquest = require('hyperquest');
var words = require('./words.json');

module.exports = function (opts) {
    var inputA = through().pause();
    var inputB = through().pause();
    var aPort = Math.floor(Math.random() * 40000 + 10000);
    var bPort = aPort + 1;
    
    var outputA = through();
    var outputB = through();
    
    setTimeout(function () {
        var hqa = hyperquest.post('http://localhost:' + aPort);
        hqa.on('error', function (err) {
            console.error('ACTUAL SERVER ' + err.stack);
        });
        inputA.pipe(hqa).pipe(outputA);
        
        if (!opts.run) {
            var hqb = hyperquest.post('http://localhost:' + bPort)
            hqb.on('error', function (err) {
                console.error('EXPECTED SERVER ' + err.stack);
            });
            inputB.pipe(hqb).pipe(outputB);
        }
        
        inputA.resume();
        inputB.resume();
    }, 500);
    
    var offset = Math.floor(words.length*Math.random());
    var count = 0;
    var iv = setInterval(function () {
        var w = words[(offset+count)%words.length] + '\n';
        inputA.write(w);
        inputB.write(w);
        
        if (++count === 20) {
            clearInterval(iv);
            inputA.end();
            inputB.end();
            a.emit('kill');
            b.emit('kill');
        }
    }, 50);
    
    var a = duplexer(inputA, outputA);
    var b = duplexer(inputB, outputB);
    return {
        a: a,
        aArgs: [ aPort ],
        b: b,
        bArgs: [ bPort ],
        showStdout: true
    };
};
