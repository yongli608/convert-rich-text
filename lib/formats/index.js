function makeFormats(type) {
  return {
    bold: require('./bold')[type],
    italic: require('./italic')[type],
    mark: require('./mark')[type],
    strike: require('./strike')[type],
    superscript: require('./superscript')[type],
    subscript: require('./subscript')[type],
    firstheader: require('./firstheader')[type],
    secondheader: require('./secondheader')[type],
    thirdheader: require('./thirdheader')[type],
    fourthheader: require('./fourthheader')[type],
    fifthheader: require('./fifthheader')[type],
    bullet: require('./bullet')[type],
    list: require('./list')[type],
    blockquote: require('./blockquote')[type],
    link: require('./link')[type],
    ins: require('./ins')[type],
    del: require('./del')[type],
    br: require('./br')[type],
    autolink: require('./autolink')[type],
    id: require('./id')[type],
    position: require('./position')[type],
    grouping: require('./grouping')[type],
    dropcap: require('./dropcap')[type],
    leadgraf: require('./leadgraf')[type],
    endmark: require('./endmark')[type],
    ad_placement: require('./ad_placement')[type],
    image: require('./image')[type],
    pullquote: require('./pullquote')[type],
    oembed: require('./oembed')[type],
    video: require('./video')[type],
    hr: require('./hr')[type],
    html: require('./html')[type],
    doc: require('./doc')[type],
    small: require('./small')[type],
    actionbox: require('./actionbox')[type],
    readmore: require('./readmore')[type],
    ratingcard: require('./ratingcard')[type],
    newsletter: require('./newsletter')[type],
    credits: require('./credits')[type],
    toh_project_details: require('./toh_project_details')[type],
    toh_tools: require('./toh_tools')[type],
    pym_js: require('./pym_js')[type]
  };
}

exports.public = makeFormats('public');
exports.internal = makeFormats('private');
exports.options = {
  blockTag: 'P',
  formatOrder: [
    // inline: wrapper tag
    'bold',
    'italic',
    'mark',
    'small',
    'strike',
    'superscript',
    'subscript',
    'autolink',
    'link', // links come last so that they can merge sibling nodes

    // objects
    'actionbox',
    'credits',
    'doc',
    'hr',
    'html',
    'image',
    'oembed',
    'pullquote',
    'ratingcard',
    'newsletter',
    'readmore',
    'video',
    'toh_project_details',
    'toh_tools',
    'pym_js',

    // line: wrapper tag
    'position',
    'grouping',
    'blockquote',

    // line: wrapper tag + switch tag
    'bullet',
    'list',

    // line: switch tag
    'firstheader',
    'secondheader',
    'thirdheader',
    'fourthheader',
    'fifthheader',

    // line: add classes / attributes
    'dropcap',
    'leadgraf',
    'endmark',
    'ad_placement',
    'br',
    'id'
  ]
};
