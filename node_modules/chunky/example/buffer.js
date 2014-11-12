var chunky = require('chunky')
var chunks = chunky(new Buffer([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]));
console.dir(chunks);
