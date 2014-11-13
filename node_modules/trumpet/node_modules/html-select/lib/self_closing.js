var tags = '!-- br hr input meta img link param area col base'.split(' ');
var map = {};
tags.forEach(function (t) { map[t] = true });
module.exports = function (name) {
    return Object.prototype.hasOwnProperty.call(map, name);
};
