var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var verify = require('adventure-verify');

var concat = require('concat-stream');
var clone = require('clone');
var chunky = require('chunky');
var wrap = require('wordwrap')(30);

var format = [
    'Every $noun in the village heard the $adj clamor from the town square.'
    + ' Looking $adv into the distance, Constable Franklin $verb his $adj '
    + 'periscope to locate the $adj source. Unwittingly, a nearby $noun '
    + '$adv $verb high-velocity $adj particles.\n'
];

var words = {
    noun: [
        'cat', 'pebble', 'conifer', 'dingo', 'toaster oven', 'x-ray',
        'microwave', 'isotope'
    ],
    verb: [ 'steered', 'flipped', 'twiddled', 'consumed', 'emitted' ],
    adj: [
        'piercing', 'confusing', 'apt', 'unhelpful', 'radiometric',
        'digital', 'untrustworthy', 'ionizing'
    ],
    adv: [ 'verily', 'yawnily', 'zestily', 'unparadoxically' ]
};

function createSentence () {
    var words_ = clone(words);
    
    var fmt = format[Math.floor(Math.random() * format.length)];
    return wrap(fmt.replace(/\$(\w+)/g, function (_, x) {
        return take(words[x])
    }));
    
    function take (xs) {
        var ix = Math.floor(Math.random() * xs.length);
        return xs.splice(ix, 1)[0];
    }
}

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(3);
    t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js');
    
    var input = chunky(createSentence());
    var expected = input.join('').split('').reverse().join('');
    
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    
    ps.stdout.pipe(concat(function (body) {
        t.equal(body.toString().trim(), expected.trim());
    }));
    
    ps.on('exit', function (code) {
        t.equal(code, 0, 'successful exit code');
    });
    
    var iv = setInterval(function () {
        if (input.length) {
            ps.stdin.write(input.shift());
        }
        else {
            ps.stdin.end();
            clearInterval(iv);
        }
    }, 50);
});

exports.run = function (args) {
    var input = chunky(createSentence());
    var ps = spawn(process.execPath, args);
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);
    ps.once('exit', function (code) {
        if (code) process.exit(code)
    });
    
    var iv = setInterval(function () {
        if (input.length) {
            ps.stdin.write(input.shift());
        }
        else {
            clearInterval(iv);
            ps.stdin.end();
        }
    }, 50);
};
