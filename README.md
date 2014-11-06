# convert-rich-text

Facilities for converting an insert-only rich-text delta into various formats like HTML and Markdown

## Install

```bash
$ npm install [--save] convert-rich-text
```

## Basic Usage

```javascript
var convert = require('convert-rich-text');

var delta = {ops: [
  {insert: 'Hello, World!'},
  {insert: '\n', attributes: {firstheader: true}},
  {insert: 'This is a '},
  {insert: 'demo', attributes: {bold: true}},
  {insert: ' of convert-rich-text\n'},
  {insert: 1, attributes: {image: 'monkey.png', alt: 'Funny monkey picture'}}
]};

var html = convert(delta, 'html', {
  block: {
    default: '<p id="{lineNumber}">{content}</p>'
    firstheader: '<h1>{content}</h1>'
  }
});

console.log(html);
```

Result:

```html
<h1>Hello, World!</h1>
<p>This is a <b>demo</b> of convert-rich-text</p>
<p><img src="monkey.png" alt="Funny monkey picture" /></p>
```

## Converters

You may register new converters by calling `defineConverter` like so:

```javascript
var convert = require('convert-rich-text');
convert.defineConverter('markdown', defaults, convertMarkdown);
```

Now the following will call the `convertMarkdown()` function with the delta and the passed options merged with the defaults:

```javascript
convert(delta, 'markdown', options);
```

## Helpers

### `toLines`

Splits an array of ops into an array of line objects, each with ops and attributes.

Embed operations are forced to live on a new line.

End-of-line operations are interpreted as the attributes for the preceding line. e.g.

```javascript
var lines = require('./index').toLines([
  { insert: 'abc\ndef' },
  { insert: 1, attributes: { image: 'http://i.imgur.com/eOOre.gif' } },
  { insert: 'xyz' },
  { insert: '\n', attributes: { align: 'left' } }
])
console.log(lines)
```

Yields

```javascript
[
  { ops: [{ insert: 'abc' }, { insert: 'def' }], attributes: {} },
  { ops: [{ insert: 1, attributes: { image: 'http://i.imgur.com/eOOre.gif' } }], attributes: {} },
  { ops: [{ insert: 'xyz' }], attributes: { align: 'left' } }
]
```

## HTML

The built-in HTML converter uses `toLines` to work with a delta line-by-line. It supports a number of options to allow customization of the final output. For example, you can change the default block format from `<div>` to `<p>` like this:

```javascript
convert(delta, 'html', {
  blocm: {
    default: '<p id="line-{lineNumber}">{content}</p>'
  }
});
```

The following options are supported:

#### inline

Defines formats for given attributes of inline operations. For example, let's say we want to allow @user style references. We could define these in our delta using a new attribute:

```javascript
var delta = [ {insert: '@user', attributes: { atref: 'user'} } ];
```

We could render these as links by adding an attribute definition, like this:

```javascript
convert(delta, 'html', {
  inline: {
    atref: '<a href="/users/{atref}" class="atref">{content}</a>'
  }
})
```

For another example, we could set up the renderer to handle the `author` attribute set by Quill's authorship module:

```javascript
convert(delta, 'html', {
  inline: {
    author: '<span class="author-{author}">{content}</span>'
  }
})
```

Or, to get a little fancier, we could do the same thing, but switch out the authors' names for simple numbers.

```javascript
var users = [];

convert(delta, 'html', {
  inline: {
    author: function(attrs, options) {
      var index = users.indexOf(node.data.author);
      if (index < 0) {
        index = users.length;
        users.push(node.data.author);
      }
      attrs.authorIndex = index;
      return '<span class="author-{authorIndex}">{content}</span>'
    }
  }
})
```

This will output HTML more like this:

```html
<span class="author-0">Within this document, this user will always be known as author "0", which makes it much easier to write generic CSS to stylize different authors.</span>
```

#### inline.default

Defines the default inline format, which will be used if no other inline formats are applied to an op. Just as with other format definitions, it may be a function.

Default value:

```html
{content}
```

#### block

Similar to the inline config object, the `block` config defines formats to be used for attributes of an entire line.

In addition to the attributes, template strings receive the `lineNumber` and `content` variables.

#### block.default

Similar to inline.default, will be used if no other block formats are applied to a line.

Default value:

```html
<div id="line-{lineNumber}">{content}</div>
```

#### embed

Defines formats for embeds of the given values. This option should be an object with number keys. Just as with other format definitions, it may be a function.

Default value:

```javascript
{
  1: '<img src="{image}" alt="{alt}" />'
}
```

## Credit

Thank you [@kbjr](https://github.com/kbjr) for https://github.com/UmbraEngineering/quilljs-renderer on which this project is forked.
