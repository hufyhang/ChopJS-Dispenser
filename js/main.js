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
  POSTFIX : '.min.js',
  CSS_PREFIX: 'http://cdn.jsdelivr.net/'
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

  var banner;

  // Download ChopJS core first if `tar.core` is not `undefined`.
  var ver = tar.core;
  delete tar.core;
  if (ver !== undefined) {
    var content = $ch.http(CDN.CORE + ver + '/chop' + CDN.POSTFIX, {
      async: false
    }).responseText;
    banner = '// ChopJS core (' + ver + ')\n// Downloaded: ' + new Date() + '\n';
    downloadNow(CHOPJS_NAME, banner, content);
  }

  var meta = [];
  // Map all `checked` package to `tar`.
  $ch.each(raw, function (key) {
    if (key.indexOf('-') === -1) {
      tar[key] = raw[key + '-ver'];

      meta.push('// + ' + key + ' -- ' + raw[key + '-ver']);
    }
  });

  // Now, create bundle.
  var bundle = createBundle(tar);
  banner = '// ChopJS Module Bundle\n// Downloaded: ' + new Date();
  banner += '\n' + meta.join('\n') + '\n';
  downloadNow(BUNDLE_NAME, banner, bundle);
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

function downloadNow(name, banner, bundle) {
  // If `bundle` is empty, do nothing.
  if (bundle.trim() === '') {
    return;
  }

  // Create an anchor element and download it.
  var anchor = document.createElement('a');
  anchor.setAttribute('href', BUNDLE_PREFIX + encodeURIComponent(banner + bundle));
  anchor.setAttribute('download', name);
  anchor.click();
}


$ch.use(['./chop-bundle'], function () {
  // Generate version string, check CSS anchor,
  // and create readme link for each package.
  PACKS.forEach(function (pack) {
    var verStr = '';
    pack.versions.map(function (ver) {
      verStr += '<option>' + ver + '</option>';
    });
    pack['versions-str'] = verStr;

    var css = pack.css;
    if (css.trim() !== '') {
      pack.css = '<a class="css-anchor" href="' + CDN.CSS_PREFIX + css + '" target="_blank">CSS</a>';
    }

    var readme = pack.name === 'core' ? '../../..' : pack.name;
    pack.readme = readme;
  });

  // Apply `PACKS` on inline template.
  $ch.find('#components').inline(PACKS);
});


// jQuery smooth scroll.
$('a[href*=#]:not([href=#])').click(function() {
  if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 500);
      return false;
    }
  }
});