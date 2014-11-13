# tuple-stream

zip together two streams into a single stream with aligned pairwise data

[![browser support](https://ci.testling.com/substack/tuple-stream.png)](http://ci.testling.com/substack/tuple-stream)

[![build status](https://secure.travis-ci.org/substack/tuple-stream.png)](http://travis-ci.org/substack/tuple-stream)

# example

This is easy to understand with lines:

``` js
var split = require('split');
var through = require('through');
var tuple = require('../');

var a = split(), b = split();

tuple(a, b).pipe(through(function (pair) {
    this.queue(pair[0] + ' | ' + pair[1] + '\n');
})).pipe(process.stdout);

a.end('one\ntwo\nhree\n4\nfive');
b.end('one\ntwo\nthree\nfour\n');
```

output:

```
one | one
two | two
hree | three
4 | four
five | 
```

Here the `split` module chunks up its input by newlines, sending a separate
chunk for each line. The `tuple` module kicks in and aligns the events by order
such that the first event from `a` is paired with the first event from `b` and
so on.

# methods


``` js
var tuple = require('tuple-stream')
```

## tuple(a, b)

Return a readable stream that zips together the data from readable streams `a`
and `b` into an array data chunk with `[achunk,bchunk]`.

When a stream is finished but its partner isn't, it will emit `null` data.

# install

With [npm](https://npmjs.org) do:

```
npm install tuple-stream
```

# license

MIT
