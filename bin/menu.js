var tmenu = require('terminal-menu');
var path = require('path');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

module.exports = function () {
    var emitter = new EventEmitter;
    var menu = tmenu({ width: 65, x: 3, y : 2 });
    menu.reset();
    
    menu.write('STREAMS ADVENTURE\n');
    menu.write('-----------------\n');
    
    var order = require('../data/order.json');
    var completed = []
    try { completed = require('../data/completed.json') }
    catch (e) {}
    
    order.forEach(function (name) {
        var isDone = completed.indexOf(name) >= 0;
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
    menu.add('EXIT');
    
    menu.on('select', function (label) {
        var name = label.replace(/\s{2}.*/, '');
        
        menu.close();
        if (name === 'EXIT') return emitter.emit('exit');
        
        emitter.emit('select', name);
    });
    menu.createStream().pipe(process.stdout);
    
    return emitter;
};
