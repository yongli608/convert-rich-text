# convert-rich-text

Convert a [rich-text](https://github.com/ottypes/rich-text) document (i.e. insert-only delta) into HTML.

## Install

```bash
$ npm install [--save] convert-rich-text
```

## Usage

```javascript
var convert = require('convert-rich-text');
var html = convert(delta, formats, options); // last argument optional
```

Specify an object of format names and config values, using the same conventions
as QuillJS:

```javascript
var convert = require('convert-rich-text');
var delta = {ops: [
  {insert: 'Hello, World!'},
  {insert: '\n', attributes: {firstheader: true}},
  {insert: 'This is a '},
  {insert: 'demo', attributes: {bold: true}},
  {insert: ' of convert-rich-text\n'},
  {insert: 1, attributes: {image: 'monkey.png'}
]};
var formats = {
  firstheader: { type: 'line', tag: 'H1' },
  bold: { tag: 'EM' },
  image: { tag: 'IMG', attr: 'src' }
};
var options = {
  blockTag: 'P',
  inlineTag: 'SPAN'
};
var html = convert(delta, formats, options);
console.log(html);
```

Result:

```html
<h1>Hello, World!</h1>
<p>This is a <b>demo</b> of convert-rich-text</p>
<p><img src="monkey.png"></p>
```

## Formats

The following options are supported for configuring a format (adapted from QuillJS):

`type: 'line'` -- make this format apply only to the line as a whole (via attributes to newline characters).

`tag: 'B'` -- wrap the applicable text in that tag

`parentTag: 'UL', tag: 'LI'` -- used for line formats to create multi-level tag structures; consecutive lines with the same `parentTag` will share the parent.

`attribute: 'href'` -- set an attribute using the given name and the value from the delta

`style: 'fontSize'` -- set an inline style using the given name and the value from the delta

A format may also be specified as a function of (node, value) for custom behavior. e.g.

```
convert(delta, {
  // reverse the text contents of the node
  reverse: function(node) {
    return document.createTextNode(node.textContent.split('').reverse().join(''));
  },
  // repeat the contents N times
  repeat: function(node, value) {
    var wrapper = document.createDocumentFragment();
    for (var i = 0, n = parseInt(value); i < n; i++) {
      wrapper.appendChild(node.cloneNode(true));
    }
    return wrapper;
  }
});
```

## Options

Each line of rich-text is wrapped with a block element (default `<div>`).

attribute-, class- and style-based formats wrap text with an inline element if there is no other tag to work on (default `<span>`).

You can change these tags with the `blockTag` and `inlineTag` options:

```javascript
convert(delta, formats, { blockTag: 'FIGURE', inlineTag: 'INS' });
```

## Credit

Thank you [@kbjr](https://github.com/kbjr) for https://github.com/UmbraEngineering/quilljs-renderer on which this project is forked.
