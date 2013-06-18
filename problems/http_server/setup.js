var through = require('through');
var duplexer = require('duplexer');
var hyperquest = require('hyperquest');
var words = require('./words.json');

module.exports = function () {
    var inputA = through().pause();
    var inputB = through().pause();
    
    var outputA = through();
    var outputB = through();
    
    setTimeout(function () {
        var hqa = hyperquest.post('http://localhost:8000');
        inputA.pipe(hqa).pipe(outputA);
        
        var hqb = hyperquest.post('http://localhost:8001')
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
        args: [],
        a: duplexer(inputA, outputA),
        b: duplexer(inputB, outputB)
    };
};
