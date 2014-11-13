module.exports = function (buf) {
    if (typeof buf === 'string') buf = Buffer(buf);

    var closing = buf[1] === '/'.charCodeAt(0);
    var start = closing ? 2 : 1;
    var name;

    for (var i = start; i < buf.length; i++) {
        var c = String.fromCharCode(buf[i]);
        if (/[\s>\/]/.test(c)) {
            name = buf.slice(start, i).toString('utf8').toLowerCase();
            break;
        }
    }
    var attr;
    return {
        name: name,
        getAttributes: function () {
            if (attr) return attr;
            attr = parse(buf, i)
            return attr;
        }
    };
};

function parse (buf, i) {
    var attr = {};
    var s = buf.slice(i, buf.length-1).toString('utf8');
    var parts = s.match(/[^\s=\/]+\s*=\s*("[^"]+"|'[^']+'|\S+)|[^\s=\/]+/g) || [];
    var key, value;

    for (var j = 0; j < parts.length; j++) {
        var kv = parts[j].split('=');
        key = kv[0].toLowerCase().trim();
        if (kv.length > 1) {
            value = kv.slice(1).join('=');
            if (/^\s*"/.test(value)) {
                value = value.replace(/^\s*"/, '').replace(/"\s*$/, '');
            }
            else if (/^\s*'/.test(value)) {
                value = value.replace(/^\s*'/, '').replace(/'\s*$/, '');
            }
            else value = value.trim();
        }
        else value = true;
        attr[key] = value;
    }
    return attr;
}
