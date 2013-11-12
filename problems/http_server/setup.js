var through = require('through');
var duplexer = require('duplexer');
var hyperquest = require('hyperquest');
var words = require('./words.json');

module.exports = function () {
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
        
        var hqb = hyperquest.post('http://localhost:' + bPort)
        hqb.on('error', function (err) {
            console.error('EXPECTED SERVER ' + err.stack);
        });
        inputB.pipe(hqb).pipe(outputB);
        
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
        }
    }, 50);
    
    return {
        a: duplexer(inputA, outputA),
        aArgs: [ aPort ],
        b: duplexer(inputB, outputB),
        bArgs: [ bPort ],
        showStdout: true
    };
};
