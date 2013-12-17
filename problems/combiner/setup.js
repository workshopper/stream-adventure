var path = require('path');
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

module.exports = function (opts) {
    return { a: runCmd, b: runCmd, long: true };
    
    function runCmd (args) {
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
        
        return stream.pipe(zlib.createGunzip());
    }
};

function shuffle (xs) {
    return xs.sort(cmp);
    function cmp () { return Math.random() > 0.5 ? 1 : -1 }
}
