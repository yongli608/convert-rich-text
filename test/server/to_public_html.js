var convert = require('../../index');
var assert = require('chai').assert;

describe('to_public_html', function() {
  [
    {
      message: 'empty delta into empty string',
      delta: { ops: [] },
      html: ''
    },
    {
      message: 'plain insert into paragraph',
      delta: { ops: [ { insert: 'hello world' } ] },
      html: '<p>hello world</p>'
    },
    {
      message: 'multiple lines into paragraphs',
      delta: { ops: [ { insert: 'hello\nworld' } ] },
      html: '<p>hello</p><p>world</p>'
    },
    {
      message: 'italic into em',
      delta: { ops: [ { insert: 'abc', attributes: { italic: true } } ] },
      html: '<p><em>abc</em></p>'
    },
    {
      message: 'bullet into ul',
      delta: { ops: [
        { insert: 'hello' },
        { insert: '\n', attributes: { bullet: true } },
        { insert: 'world' },
        { insert: '\n', attributes: { bullet: true } }
      ] },
      html: '<ul><li>hello</li><li>world</li></ul>'
    },
    {
      message: 'firstheader into h1',
      delta: { ops: [ 
        { insert: 'hello world' },
        { insert: '\n', attributes: { firstheader: true } }
      ] },
      html: '<h1>hello world</h1>'
    },
    {
      message: 'blockquote into blockquote',
      delta: { ops: [ 
        { insert: 'hello world' },
        { insert: '\n', attributes: { blockquote: true } }
      ] },
      html: '<blockquote><p>hello world</p></blockquote>'
    },
    {
      message: 'multiple inline formats link into link',
      delta: { ops: [
        { insert: 'hello ' },
        { insert: 'world', attributes: { link: 'http://vox.com' } },
        { insert: ' ' },
        { insert: 'yay', attributes: { bold: true } }
      ] },
      html: '<p>hello <a href="http://vox.com">world</a> <strong>yay</strong></p>'
    },
    {
      message: 'image into chorus asset markup',
      delta: { ops: [
        { insert: 'hello world\n' },
        { insert: { image: { id: 1234, src: 'http://i.imgur.com/2ockv.gif', caption: '<em>Clickity-Clack</em>' } } }
      ] },
      html:
        '<p>hello world</p>' +
        '<figure class="e-image" data-chorus-asset-id="1234"><img src="http://i.imgur.com/2ockv.gif"><div class="caption"><em>Clickity-Clack</em></div></figure>'
    },
    {
      message: 'links inside list items',
      delta: { ops: [
        { insert: 'hello ' },
        { insert: 'world', attributes: { link: 'http://vox.com' } },
        { insert: ' yay' },
        { insert: '\n', attributes: { list: true } }
      ] },
      html:
        '<ol><li>hello <a href="http://vox.com">world</a> yay</li></ol>'
    },
    {
      message: 'renders autolinks as regular links',
      delta: { ops: [
        { insert: 'Vox Media', attributes: { autolink: { id: 1, href: 'http://product.voxmedia.com/', disabled: false } } },
        { insert: ' is a pretty great place.' }
      ] },
      html:
        '<p><a href="http://product.voxmedia.com/">Vox Media</a> is a pretty great place.</p>'
    },
    {
      message: 'doesn\'t render disabled autolinks',
      delta: { ops: [
        { insert: 'I like ' },
        { insert: 'Star Wars', attributes: { autolink: { id: 1, href: 'http://starwars.com/', disabled: false } } },
        { insert: ' but ' },
        { insert: 'Star Trek', attributes: { autolink: { id: 2, href: 'http://startrek.com/', disabled: true } } },
        { insert: ' is just okay!' }
      ] },
      html:
        '<p>I like <a href="http://starwars.com/">Star Wars</a> but Star Trek is just okay!</p>'
    },
    {
      message: 'converts to <br> tags',
      delta: { ops: [
        { insert: 'Hello, ' },
        { insert: '\n', attributes: { br: true, id: 'ak3iFk' } },
        { insert: 'can you hear me now?' },
        { insert: '\n', attributes: { id: 'ak3iFk' } },
        { insert: 'How about,' },
        { insert: '\n', attributes: { br: true, id: 'ak3iFk' } },
        { insert: 'now?\nlist' },
        { insert: '\n', attributes: { br: true, bullet: true } },
        { insert: 'item' },
        { insert: '\n', attributes: { bullet: true } },
        { insert: 'heading' },
        { insert: '\n', attributes: { br: true, firstheader: true } },
        { insert: 'with a break' },
        { insert: '\n', attributes: { firstheader: true } },
        { insert: 'cannot mix' },
        { insert: '\n', attributes: { br: true } },
        { insert: 'and match' },
        { insert: '\n', attributes: { secondheader: true, br: true } },
        { insert: 'at all' },
        { insert: '\n', attributes: { thirdheader: true, br: true } }
      ] },
      html: '<p id="ak3iFk">Hello, <br>can you hear me now?</p><p id="ak3iFk">How about,<br>now?</p><ul><li>list<br>item</li></ul><h1>heading<br>with a break</h1><p>cannot mix</p><h2>and match</h2><h3>at all</h3>'
    },
    {
      message: 'big fat complex test',
      delta: { ops: [
        { insert: 'This is gold, Mr. Bond' },
        { insert: '\n', attributes: { firstheader: true } },
        { insert: { image: { id: 9, src: 'http://www.independent.co.uk/incoming/article8435194.ece/alternates/w620/Goldfinger.jpg', caption: '<em>This cannot end well.</em>' } } },
        { insert: '\nAll my life, I\'ve been in love with its colour, ' },
        { insert: 'its brilliance, its divine heaviness. ', attributes: { italic: true } },
        { insert: 'I welcome any enterprise that will increase my stock, which is ' },
        { insert: 'considerable.', attributes: { bold: true } },
        { insert: '\nI think you\'ve made your point. Thank you for the demonstration.' },
        { insert: '\n', attributes: { blockquote: true } },
        { insert: 'Choose your next witticism carefully,', attributes: { link: 'http://www.script-o-rama.com/movie_scripts/g/goldfinger-script-transcript-james-bond.html' } },
        { insert: '\n', attributes: { list: true } },
        { insert: 'Mr. Bond', attributes: { bold: true } },
        { insert: '\n', attributes: { list: true } },
        { insert: 'It may be ' },
        { insert: 'your last.', attributes: { italic: true } },
        { insert: '\n', attributes: { list: true } },
        { insert: 'The purpose of our two encounters is now very clear to me. I do not intend to be distracted by another.\nGood night, Mr Bond.' },
        { insert: '\n', attributes: { secondheader: true } },
        { insert: 'Do you expect me to talk?' },
        { insert: '\n', attributes: { blockquote: true } },
        { insert: 'No, Mr Bond!\nI expect you to die!' },
        { insert: '\n', attributes: { firstheader: true } },
        { insert: { image: { id: 10, src: 'http://www.filmchronicles.com/wp-content/uploads/2012/10/Goldfinger065.jpg', caption: 'I knew this was going to go badly.' } } }
      ] },
      html: '<h1>This is gold, Mr. Bond</h1><figure class="e-image" data-chorus-asset-id="9"><img src="http://www.independent.co.uk/incoming/article8435194.ece/alternates/w620/Goldfinger.jpg"><div class="caption"><em>This cannot end well.</em></div></figure><p>All my life, I\'ve been in love with its colour, <em>its brilliance, its divine heaviness. </em>I welcome any enterprise that will increase my stock, which is <strong>considerable.</strong></p><blockquote><p>I think you\'ve made your point. Thank you for the demonstration.</p></blockquote><ol><li><a href="http://www.script-o-rama.com/movie_scripts/g/goldfinger-script-transcript-james-bond.html">Choose your next witticism carefully,</a></li><li><strong>Mr. Bond</strong></li><li>It may be <em>your last.</em></li></ol><p>The purpose of our two encounters is now very clear to me. I do not intend to be distracted by another.</p><h2>Good night, Mr Bond.</h2><blockquote><p>Do you expect me to talk?</p></blockquote><p>No, Mr Bond!</p><h1>I expect you to die!</h1><figure class="e-image" data-chorus-asset-id="10"><img src="http://www.filmchronicles.com/wp-content/uploads/2012/10/Goldfinger065.jpg"><div class="caption">I knew this was going to go badly.</div></figure>'
    },
    {
      message: 'merges image groups together in the expected way',
      delta: { ops: [
        { insert: 'This is my image group test\n' },
        { insert: { image: { id: 1, src: 'http://i.imgur.com/4AiXzf8.jpg', caption: 'Caption 1' } } },
        { insert: '\n', attributes: { grouping: '2-up', id: '123' } },
        { insert: { image: { id: 1, src: 'http://i.imgur.com/4AiXzf8.jpg', caption: 'Caption 2' } } },
        { insert: '\n', attributes: { grouping: '2-up', id: '456' } },
        { insert: 'Okay another now?\n' },
        { insert: { image: { id: 1, src: 'http://i.imgur.com/4AiXzf8.jpg', caption: 'Caption 1' } } },
        { insert: '\n', attributes: { grouping: '3-up-top', position: 'wide-block', id: '789' } },
        { insert: { image: { id: 1, src: 'http://i.imgur.com/4AiXzf8.jpg', caption: 'Caption 2' } } },
        { insert: '\n', attributes: { grouping: '3-up-top', position: 'wide-block', id: '101112' } },
        { insert: { image: { id: 1, src: 'http://i.imgur.com/4AiXzf8.jpg', caption: 'Caption 3' } } },
        { insert: '\n', attributes: { grouping: '3-up-top', position: 'wide-block', id: '131415' } },
        { insert: 'Okay that\'s it' }
      ] },
      html: '<p>This is my image group test</p><div class="c-image-grid"><div class="c-image-grid__item"><figure class="e-image" data-chorus-asset-id="1" id="123"><img src="http://i.imgur.com/4AiXzf8.jpg"><div class="caption">Caption 1</div></figure></div><div class="c-image-grid__item"><figure class="e-image" data-chorus-asset-id="1" id="456"><img src="http://i.imgur.com/4AiXzf8.jpg"><div class="caption">Caption 2</div></figure></div></div><p>Okay another now?</p><div class="c-wide-block"><div class="c-image-grid__wrapper"><div class="c-image-grid c-image-grid__odd c-image-grid__odd-first-wide"><div class="c-image-grid__item"><figure class="e-image" data-chorus-asset-id="1" id="789"><img src="http://i.imgur.com/4AiXzf8.jpg"></figure></div><div class="c-image-grid__item"><figure class="e-image" data-chorus-asset-id="1" id="101112"><img src="http://i.imgur.com/4AiXzf8.jpg"></figure></div><div class="c-image-grid__item"><figure class="e-image" data-chorus-asset-id="1" id="131415"><img src="http://i.imgur.com/4AiXzf8.jpg"></figure></div></div><p class="caption">Caption 3</p></div></div><p>Okay that\'s it</p>'
    }
  ].forEach(function(test) {
    it(test.message, function() {
      assert.equal(convert.toPublicHtml(test.delta), test.html);
    });
  });
});
