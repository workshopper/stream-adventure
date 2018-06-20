#!/usr/bin/env node

'use strict'

let path = require('path');
let adventure = require('adventure');
let shop = adventure({
    name: 'stream-adventure',
    title: 'STREAM ADVENTURE'
});

require('../menu.json').forEach((name) => {
    if (/^!/.test(name)) return;
    let d = name.toLowerCase().replace(/\W+/g, '_');
    let dir = path.join(__dirname, '../problems', d);
    shop.add(name, () => require(dir));
});
shop.execute(process.argv.slice(2));
shop.on('fail', () => process.exit(1));
