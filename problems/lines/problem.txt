Instead of transforming every line as in the previous "INPUT OUTPUT" example,
for this challenge, convert even-numbered lines to upper-case and odd-numbered
lines to lower-case. Consider the first line to be odd-numbered. For example
given this input:

    One
    Two
    Three
    Four

Your program should output:

    one
    TWO
    three
    FOUR

You can use the `split` module to split input by newlines. For example:

    var split = require('split');
    process.stdin
        .pipe(split())
        .pipe(through(function (line) {
            console.dir(line.toString());
        }))
    ;

Will buffer and split chunks on newlines before you get them. For example, for
the `split.js` we just wrote we will get separate events for each line even
though the data probably all arrives on the same chunk:

    $ echo -e 'one\ntwo\nthree' | node split.js
    'one'
    'two'
    'three'

Your own program should use `split` in this way, but you should transform the
input and pipe the output through to `process.stdout`.

Make sure to `npm install split through` in the directory where your solution
file lives.
