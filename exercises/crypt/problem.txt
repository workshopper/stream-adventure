Your program will be given a passphrase on `process.argv[2]` and 'aes256'
encrypted data will be written to stdin.

Simply decrypt the data and stream the result to process.stdout.

You can use the `crypto.createDecipher()` api from node core to solve this
challenge. Here's an example:

    var crypto = require('crypto');
    var stream = crypto.createDecipher('RC4', 'robots');
    stream.pipe(process.stdout);
    stream.write(Buffer([ 135, 197, 164, 92, 129, 90, 215, 63, 92 ]));
    stream.end();

Instead of calling `.write()` yourself, just pipe stdin into your decrypter.
