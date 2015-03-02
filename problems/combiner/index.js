var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var concat = require('concat-stream');

var zlib = require('zlib');
var books = require('./books.json');

var genres = books.reduce(function (acc, book) {
    acc[book.genre] = {
        type: 'book',
        name: book.genre,
        books: []
    };
    return acc;
}, {});

books.forEach(function (book) {
    book.type = 'book';
    genres[book.genre].books.push(book);
});

var keys = shuffle(Object.keys(genres));

var data = keys.reduce(function (acc, key) {
    var g = genres[key];
    acc.push(JSON.stringify({ type: 'genre', name: g.name }));
    return acc.concat(shuffle(g.books).map(function (book) {
        return JSON.stringify({ type: 'book', name: book.name });
    }));
}, []);

var expected = sort(require('./expected.json'));

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'));
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'));

exports.verify = verify({ modeReset: true }, function (args, t) {
    t.plan(2);
    var fn = require(path.resolve(args[0]));
    t.equal(typeof fn, 'function', 'solution exports a function');
    var stream = fn();
    
    var rows = data.slice();
    
    var iv = setInterval(function () {
        if (rows.length === 0) {
            clearInterval(iv);
            stream.end();
        }
        else stream.write(rows.shift() + '\n')
    }, 10);
    
    stream.pipe(zlib.createGunzip()).pipe(concat(function (body) {
        var lines = body.toString().trim().split('\n').map(JSON.parse);
        t.deepEqual(sort(lines), expected);
    }));
});

exports.run = function (args) {
    var fn = require(path.resolve(args[0]));
    var stream = fn();
    
    var rows = data.slice();
    
    var iv = setInterval(function () {
        if (rows.length === 0) {
            clearInterval(iv);
            stream.end();
        }
        else stream.write(rows.shift() + '\n')
    }, 10);
    
    stream.pipe(zlib.createGunzip()).pipe(process.stdout);
};

function shuffle (xs) {
    return xs.sort(cmp);
    function cmp () { return Math.random() > 0.5 ? 1 : -1 }
}

function sort (rows) {
    return rows.sort(cmp).map(function (row) {
        row.books.sort();
        return row;
    });
    function cmp (a, b) {
        return a.name < b.name ? -1 : 1;
    }
}
