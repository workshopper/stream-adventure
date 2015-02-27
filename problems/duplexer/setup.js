var path = require('path');
var cmd = __dirname + '/command.js';
var through = require('through2');
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
        var stream = through(function (chunk, _, next){
            setTimeout(function (){
                next(null, chunk);
            }, 50);
        })
        var i = -1;
        while (++i < queue.length) {
            stream.write(queue[i]);
        }
        return stream.pipe(ps);
    }
};
