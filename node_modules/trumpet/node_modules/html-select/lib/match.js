var inherits = require('inherits');
var Interface = require('./interface.js');
var through = require('through2');
var Splicer = require('stream-splicer');
var Readable = require('readable-stream').Readable;
var setAttrs = require('./set_attrs.js');

module.exports = Match;
inherits(Match, Splicer);

function Match (start, fn) {
    if (!(this instanceof Match)) return new Match;
    
    var streams = [ this._pre(), [], this._post() ];
    this._start = start;
    this._fn = fn;
    
    Splicer.call(this, streams, { objectMode: true });
}

Match.prototype._pre = function () {
    var self = this;
    var matched = false;
    var first = true;
    return through.obj(write, end);
    
    function write (row, enc, next) {

        // detect when the selected tokens start        
        if (!matched && row[0] === 'FIRST' && row[1] === self) {
            matched = true; 
        }

        // first interesting token of the selection
        if (matched && first && row[0] !== 'FIRST') {
            var iface = self.createInterface();
            self._fn(iface);
            
            if (iface._setAttr && row[0] === 'END') {
                row[1][1] = setAttrs(row[1][1], iface._setAttr);
            }
            else if (iface._setAttr) {
                row[1] = setAttrs(row[1], iface._setAttr);
            }
            first = false;
        }
        
        if (row[0] === 'END' && self._ended) {
            self._ended = false;
            self.emit('close');
            next();
        }
        else if (row[0] === 'END') {
            self._next = next;
            
            self._ended = true;
            this.push(['LAST']);
            this.push(row[1]);
            this.push(null);
        }
        else {
            if (!self._ended) this.push(row);
            next();
        }
    }
    function end () {}
};

Match.prototype._post = function () {
    var self = this;
    var first = true;
    return through.obj(write, end);
    
    function write (row, enc, next) {
        if (row[0] !== 'LAST') this.push(row);
        next();
    }
    
    function end () {
        if (self._next) {
            self.emit('close');
            self._next();
        }
        else {
            self._ended = true;
        }
    }
};

Match.prototype.finished = function (tree) {
    if (this._start.selfClosing) return true;
    return tree === this._start.parent;
};

Match.prototype.createInterface = function () {
    return new Interface(this.get(1), this);
};
