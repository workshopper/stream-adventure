var tmenu = require('terminal-menu');
var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

module.exports = function (opts) {
    var emitter = new EventEmitter;

    var menu = tmenu({
      width: 65,
      x: 3, y: 2, 
      bg: opts.bg || 'blue',
      fg: opts.fg || 'white'
    });

    menu.reset();
    
    menu.write('STREAMS ADVENTURE\n');
    menu.write('-----------------\n');
    
    var order = require('../data/order.json');
    
    order.forEach(function (name) {
        var isDone = opts.completed.indexOf(name) >= 0;
        if (isDone) {
            var m = '[COMPLETED]';
            menu.add(
                name
                + Array(65 - m.length - name.length + 1).join(' ')
                + m
            );
        }
        else menu.add(name);
    });
    menu.write('-----------------\n');
    menu.add('HELP');
    menu.add('EXIT');
    
    menu.on('select', function (label) {
        var name = label.replace(/\s{2}.*/, '');
        
        menu.close();
        if (name === 'EXIT') return emitter.emit('exit');
        if (name === 'HELP') {
            console.log();
            return fs.createReadStream(__dirname + '/usage.txt')
                .pipe(process.stdout)
            ;
        }
        
        emitter.emit('select', name);
    });
    menu.createStream().pipe(process.stdout);
    
    return emitter;
};
