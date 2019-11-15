exports.public = {
  add: function(node, value, dom) {
    dom(node.parentNode).switchTag('ASIDE');

    var data = {
      stories: value.map(function(item) {
        return {
          caption: item.caption,
          url: item.url,
          chorus_asset_id: item.image.id
        };
      })
    };

    var div = node.ownerDocument.createElement('div');
    div.setAttribute('data-anthem-component', 'toh_tools');
    div.setAttribute('data-anthem-component-data', JSON.stringify(data));
    dom(node).replace(div);

    return div;
  }
};

exports.private = require('./object')('toh_tools');
