/* global $ch, $ */
'use strict';

// ChopJS name.
var CHOPJS_NAME = 'chopjs.js';

// Bundle name.
var BUNDLE_NAME = 'chop-bundle.js';

// Anchor prefix.
var BUNDLE_PREFIX = 'data:text/plain;charset=utf-8,';

// CDN.
var CDN = {
  CORE: 'http://cdn.jsdelivr.net/chop/',
  MODULE: 'http://cdn.jsdelivr.net/chopjs-',
  POSTFIX : '.min.js'
};

// ChopJS package information.
var PACKS = JSON.parse($ch.readFile('js/versions.json'));

// Download function.
function download() {
  // First, serialize `components` form.
  var serialized = $('#components').serialize();
  // Now, split `serialized` by `&`,
  // and put them into an object.
  serialized = serialized.split('&');

  var raw = {};
  serialized.map(function (item) {
    var tokens = item.split('=');
    var name = tokens[0];
    var value = tokens[1] || '';
    raw[name] = value;
  });

  var tar = {
    core: raw.core ? raw['core-ver'] : undefined
  };
  delete raw.core;

  // Download ChopJS core first if `tar.core` is not `undefined`.
  var ver = tar.core;
  delete tar.core;
  if (ver !== undefined) {
    var content = $ch.http(CDN.CORE + ver + '/chop' + CDN.POSTFIX, {
      async: false
    }).responseText;
    downloadNow(CHOPJS_NAME, content);
  }

  // Map all `checked` package to `tar`.
  $ch.each(raw, function (key) {
    if (key.indexOf('-') === -1) {
      tar[key] = raw[key + '-ver'];
    }
  });

  // Now, create bundle.
  var bundle = createBundle(tar);
  downloadNow(BUNDLE_NAME, bundle);
}

// Create bundle.
function createBundle(tar) {
  var buffer = [];
  var ver;
  var content;

  // Now, iterate through module packages.
  $ch.each(tar, function (name, version) {
    content = $ch.http(CDN.MODULE + name + '/' + version + '/' + name + CDN.POSTFIX, {
      async: false
    }).responseText;
    buffer.push(content);
    delete tar[name];
  });

  return buffer.join('\n');
}

function downloadNow(name, bundle) {
  // If `bundle` is empty, do nothing.
  if (bundle.trim() === '') {
    return;
  }

  // Create an anchor element and download it.
  var anchor = document.createElement('a');
  anchor.setAttribute('href', BUNDLE_PREFIX + encodeURIComponent(bundle));
  anchor.setAttribute('download', name);
  anchor.click();
}


$ch.use(['./chop-bundle'], function () {
  // Generate version string for each package.
  PACKS.forEach(function (pack) {
    var verStr = '';
    pack.versions.map(function (ver) {
      verStr += '<option>' + ver + '</option>';
    });
    pack['versions-str'] = verStr;
  });

  // Apply `PACKS` on inline template.
  $ch.find('#components').inline(PACKS);
});
