var Duplex = require('readable-stream').Duplex;
var inherits = require('inherits');
var through = require('through2');
var duplexer = require('duplexer2');

var tokenize = require('html-tokenize');
var select = require('html-select');

var wrapElem = require('./lib/wrap.js');

module.exports = Trumpet;
inherits(Trumpet, Duplex);

function Trumpet () {
    var self = this;
    if (!(this instanceof Trumpet)) return new Trumpet;
    Duplex.call(this);
    this._tokenize = tokenize();
    this._writing = false;
    this._piping = false;
    this._select = this._tokenize.pipe(select());
    this._select.once('end', function () {
        self.emit('_end');
        self.push(null)
    });
    this.once('finish', function () { self._tokenize.end() });
}

Trumpet.prototype.pipe = function () {
    this._piping = true;
    return Duplex.prototype.pipe.apply(this, arguments);
};

Trumpet.prototype._read = function (n) {
    var row;
    var self = this;
    var buf, read = 0;
    var s = this._select;
    while ((row = s.read()) !== null) {
        if (row[1] && row[1].length) {
            this.push(row[1]);
            read ++;
        }
    }
    if (read === 0) s.once('readable', function () { self._read(n) });
};

Trumpet.prototype._write = function (buf, enc, next) {
    if (!this._writing && !this._piping) {
        this._piping = true;
        this.resume();
    }
    return this._tokenize._write(buf, enc, next);
};

Trumpet.prototype.select = function (str, cb) {
    var self = this;
    var first = true;
    
    var res = self._selectAll(str, function (elem) {
        if (!first) return;
        first = false;
        res.createReadStream = function () {};
        res.createWriteStream = function () {};
        res.createStream = function () {};
        if (cb) cb(elem);
    });
    return res;
};

Trumpet.prototype.selectAll = function (str, cb) {
    return this._selectAll(str, cb);
};

Trumpet.prototype._selectAll = function (str, cb) {
    var self = this;
    var readers = [], writers = [], duplex = [];
    var gets = [], getss = [], sets = [], removes = [];
    
    this.once('_end', function () {
        readers.splice(0).forEach(function (r) {
            r.end();
            r.resume();
        });
        
        duplex.splice(0).forEach(function (d) {
            d.end();
            d.resume();
        });
    });
    
    var element, welem;
    this._select.select(str, function (elem) {
        element = elem;
        welem = wrapElem(elem);
        if (cb) cb(welem);
        
        elem.once('close', function () {
            element = null;
            welem = null;
        });
        
        readers.splice(0).forEach(function (r) {
            welem.createReadStream(r._options).pipe(r);
        });
        
        writers.splice(0).forEach(function (w) {
            w.pipe(welem.createWriteStream(w._options));
        });
        
        duplex.splice(0).forEach(function (d) {
            d.input.pipe(welem.createStream(d.options))
                .pipe(d.output)
            ;
        });
        
        gets.splice(0).forEach(function (g) {
            welem.getAttribute(g[0], g[1]);
        });
        
        getss.splice(0).forEach(function (cb) {
            welem.getAttributes(cb);
        });
        
        sets.splice(0).forEach(function (g) {
            welem.setAttribute(g[0], g[1]);
        });
        
        removes.splice(0).forEach(function (key) {
            welem.removeAttribute(key);
        });
    });
    
    return {
        getAttribute: function (key, cb) {
            if (welem) return welem.getAttribute(key, cb);
            gets.push([ key, cb ]);
        },
        getAttributes: function (cb) {
            getss.push(cb);
        },
        setAttribute: function (key, value) {
            if (welem) return welem.setAttribute(key, value);
            sets.push([ key, value ]);
        },
        removeAttribute: function (key) {
            if (welem) return welem.removeAttribute(key);
            removes.push(key);
        },
        createReadStream: function (opts) {
            if (welem) return welem.createReadStream(opts);
            var r = through();
            r._options = opts;
            readers.push(r);
            return r;
        },
        createWriteStream: function (opts) {
            if (welem) return welem.createWriteStream(opts);
            var w = through();
            w._options = opts;
            writers.push(w);
            return w;
        },
        createStream: function (opts) {
            if (welem) return welem.createStream(opts);
            var d = { input: through(), output: through() };
            d.options = opts;
            duplex.push(d);
            return duplexer(d.input, d.output);
        }
    };
};

Trumpet.prototype.createReadStream = function (sel, opts) {
    return this.select(sel).createReadStream(opts);
};

Trumpet.prototype.createWriteStream = function (sel, opts) {
    return this.select(sel).createWriteStream(opts);
};

Trumpet.prototype.createStream = function (sel, opts) {
    return this.select(sel).createStream(opts);
};
