var spawn = require('child_process').spawn;
var duplexer = require('duplexer');

module.exports = function (cmd, args) {
    var ps = spawn(cmd, args);
    return duplexer(ps.stdin, ps.stdout);
};
