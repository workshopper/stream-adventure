module.exports = function (msg) {
    var chunks = [];
    for (
        var i = 0, j = Math.floor(Math.random() * (msg.length + 1));
        j <= msg.length;
        j += Math.floor(Math.random() * (msg.length - j + 1))
    ) {
        var c = msg.slice(i, j);
        chunks.push(c);
        i = j;
        if (j === msg.length) break;
    }
    
    return chunks;
}
