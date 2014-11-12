var cssauron = require('cssauron');
var getTag = require('./get_tag.js');
var getAttr = require('./get_attr.js');

module.exports = function () {
    return cssauron({
        tag: function (node) { return getTag(node) },
        class: function (node) { return getAttr(node, 'class') },
        id: function (node) { return getAttr(node, 'id') },
        parent: 'parent',
        children: 'children',
        attr: getAttr
    });
};
