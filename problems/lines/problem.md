Instead of transforming every line as in the previous "TRANSFORM" example,
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

Even though it's not obligatory, you can use the `split` module 
to split input by newlines. For example:

```js
const split = require('split')
const through2 = require('through2')
process.stdin
  .pipe(split())
  .pipe(through2(function (line, _, next) {
      console.dir(line.toString())
      next();
  }))
```

`split` will buffer chunks on newlines before you get them. With example
above, we will get separate events for each line even though all the data
probably arrives on the same chunk:

```sh
$ echo -e 'one\ntwo\nthree' | node split.js
'one'
'two'
'three'
```

Your own program could use `split` in this way, and you should transform the
input and pipe the output through to `process.stdout`. Keep in mind that,
if you decide to use this technique, `split2` might be actually needed,
depending on the versions of the other dependencies.

You are free to solve the challenge without `split` module. In this case,
you would have to add a new line after each line to have a passing match.

Make sure to `npm install split through2` in the directory where your solution
file lives.
