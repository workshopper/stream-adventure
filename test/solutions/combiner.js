var combine = require('stream-combiner');
var through = require('through');
var split = require('split');
var zlib = require('zlib');

module.exports = function () {
    var grouper = through(write, end);
    var current;
    
    function write (line) {
        if (line.length === 0) return;
        var row = JSON.parse(line);
        
        if (row.type === 'genre') {
            if (current) {
                this.queue(JSON.stringify(current) + '\n');
            }
            current = { name: row.name, books: [] };
        }
        else if (row.type === 'book') {
            current.books.push(row.name);
        }
    }
    function end () {
        if (current) {
            this.queue(JSON.stringify(current) + '\n');
        }
        this.queue(null);
    }
    
    return combine(split(), grouper, zlib.createGzip());
};
