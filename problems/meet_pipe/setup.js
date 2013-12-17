var fs = require('fs');
var path = require('path');
var os = require('os');
var tmpdir = os.tmpdir || os.tmpDir;
var aliens = require('./aliens.json');

module.exports = function () {
    var file = path.resolve(tmpdir(), 'meet-pipe-data.txt');
    var data = '';

    for (var i = 0; i < 10; i++) {
        var alien = aliens[Math.floor(Math.random() * aliens.length)];
        data += alien + '\n';
    }
    fs.writeFileSync(file, data);
    
    return { args: [ file ], stdin: null };
};
