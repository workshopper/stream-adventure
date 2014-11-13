chunky
======

Split up a string or buffer into lots of randomly-sized chunks.

This module is useful for writing unit tests against streams with
buffer-boundary conditions.

example
=======

string.js
---------

````javascript
var chunky = require('chunky');
var chunks = chunky('Beep boop. I am a computer.');
console.dir(chunks);
````

output:

````
[ 'Beep boop. I ', 'am a com', 'p', 'ute', 'r.' ]
````

buffer.js
---------

````javascript
var chunky = require('chunky')
var chunks = chunky(new Buffer([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]));
console.dir(chunks);
````

output:

````
[ <Buffer 00 01>,
  <Buffer >,
  <Buffer 02 03>,
  <Buffer 04 05 06 07>,
  <Buffer 08 09> ]
````

methods
=======

var chunky = require('chunky')

chunky(msg)
-----------

Turn `msg` into lots of little randomly-sized chunks.

If `msg` is a string, return an array of strings.

If `msg` is a Buffer, return an array of Buffers.

license
=======

MIT/X11

install
=======

With [npm](http://npmjs.org) do:

    npm install chunky
