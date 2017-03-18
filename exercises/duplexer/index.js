var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');

var cmd = __dirname + '/command.js';
var concat = require('concat-stream');
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

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

var n = 1 + Math.floor(Math.random() * 25);
var input = [], expected = '';
var len = 10 + Math.floor(Math.random() * 5);
for (var i = 0; i < len; i++) {
    var word = words[Math.floor(Math.random() * words.length)];
    input.push(word + '\n');
    expected += convert(n, word + '\n');
}

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js');
    var fn = require(path.resolve(args[0]));
    t.equal(typeof fn, 'function', 'solution exports a function');
    var stream = fn(process.execPath,
        [ path.resolve(__dirname, 'command.js'), n ]
    );
    stream.pipe(concat(function (body) {
        t.equal(body.toString('utf8').trim(), expected.trim());
    }));
    
    var iv = setInterval(function () {
        if (input.length) {
            stream.write(input.shift());
        }
        else {
            clearInterval(iv);
            stream.end();
        }
    }, 50);
});

exports.run = function (args) {
    var fn = require(path.resolve(args[0]));
    var stream = fn(process.execPath,
        [ path.resolve(__dirname, 'command.js'), n ]
    );
    stream.pipe(process.stdout);
    
    var iv = setInterval(function () {
        if (input.length) {
            stream.write(input.shift());
        }
        else {
            clearInterval(iv);
            stream.end();
        }
    }, 50);
};

function convert (offset, s) {
    return s.replace(/[A-Za-z]/g, function (s) {
        var c = s.charCodeAt(0);
        return String.fromCharCode(
            c < 97
            ? (c - 97 + offset) % 26 + 97
            : (c - 65 + offset) % 26 + 97
        );
    });
}
