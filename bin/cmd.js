#!/usr/bin/env node

var path = require('path');
var adventure = require('adventure');
var shop = adventure({
    name: 'stream-adventure',
    title: 'STREAM ADVENTURE'
});

require('../menu.json').forEach(function (name) {
    if (/^!/.test(name)) return;
    var d = name.toLowerCase().replace(/\W+/g, '_');
    var dir = path.join(__dirname, '../problems', d);
    shop.add(name, function () {
        return require(dir);
    });
});
shop.execute(process.argv.slice(2));
shop.on('fail', function () {
  process.exit(1);
});
