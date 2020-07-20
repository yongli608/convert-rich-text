exports.private = {
    type: 'line',
    attribute: 'data-position'
  };
  
  exports.public = {
    type: 'line',
    add: function(node, value, dom) {
      var container = node.ownerDocument.createElement('div');
      dom(node).wrap(container);
  
      switch (value) {
        case 'default':
          container.classList.add('default');
          break;
        case 'default2':
          container.classList.add('default2');
          break;
        case 'default3':
          container.classList.add('default3');
          break;
      }
 
      // Return the original node, not the wrapper
      return node;
    }
  };
  