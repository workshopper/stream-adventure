var tmenu = require('terminal-menu');
var menu = tmenu({ width: 75, x: 4, y : 2 });
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
        menu.add(name + Array(74 - m.length - name.length + 1).join(' ') + m);
    }
    else menu.add(name);
});
menu.add('EXIT');

menu.on('select', function (label) {
    menu.close();
    console.log();
});

menu.createStream().pipe(process.stdout);
