#!/bin/bash

openssl enc -d -$1 -pass pass:$2 -nosalt \
| tar xz --to-command='md5sum | head -c 33; echo $TAR_FILENAME'
