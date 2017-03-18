In this challenge, write an http server that uses a through stream to write back
the request stream as upper-cased response data for POST requests.

Streams aren't just for text files and stdin/stdout. Did you know that http
request and response objects from node core's `http.createServer()` handler are
also streams?

For example, we can stream a file to the response object:

    var http = require('http');
    var fs = require('fs');
    var server = http.createServer(function (req, res) {
        fs.createReadStream('file.txt').pipe(res);
    });
    server.listen(process.argv[2]);

This is great because our server can respond immediately without buffering
everything in memory first.

We can also stream a request to populate a file with data:

    var http = require('http');
    var fs = require('fs');
    var server = http.createServer(function (req, res) {
        if (req.method === 'POST') {
            req.pipe(fs.createWriteStream('post.txt'));
        }
        res.end('beep boop\n');
    });
    server.listen(process.argv[2]);

You can test this post server with curl:

    $ node server.js 8000 &
    $ echo hack the planet | curl -d@- http://localhost:8000
    beep boop
    $ cat post.txt
    hack the planet

Your http server should listen on the port given at process.argv[2] and convert
the POST request written to it to upper-case using the same approach as the
TRANSFORM example.

As a refresher, here's an example with the default through2 callbacks explicitly
defined:

    var through = require('through2');
    process.stdin.pipe(through(write, end)).pipe(process.stdout);

    function write (buf, _, next) {
      this.push(buf);
      next();
    }
    function end (done) { done(); }

Do that, but send upper-case data in your http server in response to POST data.

Make sure to `npm install through2` in the directory where your solution file
lives.
