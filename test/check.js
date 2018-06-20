'use strict'

let spawn = require('child_process').spawn;
let path = require('path');
let test = require('tape');

let adventures = require('../menu.json');
adventures.forEach((name) => {
    if (name === 'WEBSOCKETS') return;

    test(name, (t) => {
        t.plan(2);
        let file = name.toLowerCase().replace(/\s+/g, '_') + '.js';
        let solution = path.join(__dirname, 'solutions', file);

        let ps = run(['select', name]);
        ps.on('exit', selected);
        ps.stderr.pipe(process.stderr);

        const selected = (code) => {
            t.equal(code, 0);
            let ps = run(['verify', solution]);
            ps.on('exit', verified);
            ps.stderr.pipe(process.stderr);
        }

        const verified = (code) => t.equal(code, 0);

    });
});

const run = (args) => {
    args.unshift(path.join(__dirname, '../bin/cmd.js'));
    return spawn(process.execPath, args);
}
