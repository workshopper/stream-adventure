// Here's the reference solution:  
  
  var fs = require('fs');
  var file = process.argv[2];
  fs.createReadStream(file).pipe(process.stdout);
