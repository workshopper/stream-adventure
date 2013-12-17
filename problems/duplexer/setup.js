var through = require('through');
var path = require('path');
var cmd = __dirname + '/command.js';
var words = [
    'beetle',
    'biscuit',
    'bat',
    'bobbin',
    'bequeath',
    'brûlée',
    'byzantine',
    'bazaar',
    'blip',
    'byte',
    'beep',
    'boop',
    'bust',
    'bite',
    'balloon',
    'box',
    'beet',
    'boolean',
    'bake',
    'bottle',
    'bug',
    'burrow'
];

module.exports = function () {
    var n = 1 + Math.floor(Math.random() * 25);
    var writes = [];
    var len = 10 + Math.floor(Math.random() * 5);
    for (var i = 0; i < len; i++) {
        var word = words[Math.floor(Math.random() * words.length)];
        writes.push(word);
    }
    return { a: runCmd, b: runCmd };
    
    function runCmd (args) {
        var run = require(path.resolve(args[0]));
        var ps = run(process.execPath, [ cmd, n ]);
        var queue = writes.slice();
        
        var iv = setInterval(function () {
            if (queue.length === 0) {
                clearInterval(iv);
                ps.end();
            }
            else ps.write(queue.shift() + '\n');
        }, 50);
        return ps;
    }
};
