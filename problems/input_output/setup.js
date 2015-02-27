var through = require('through2');
var aliens = require('./aliens.json');

module.exports = function () {
    var tr = through();
    
    var count = 0;
    var iv = setInterval(function () {
        if (++count === 10) {
            clearInterval(iv);
            return tr.end();
        }
        var alien = aliens[Math.floor(Math.random() * aliens.length)];
        tr.write(alien + '\n');
    }, 50);
    
    return { args: [], stdin: tr };
};
