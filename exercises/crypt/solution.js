// Here's the reference solution:

  var crypto = require('crypto');
  process.stdin
      .pipe(crypto.createDecipher('aes256', process.argv[2]))
      .pipe(process.stdout)
  ;
