#!/usr/bin/env node
'use strict';

var shell = require('shelljs');
const images = shell.ls('-R', 'icons')
  .map(image => `icons/${image}`)
  .filter(image => image.includes('.'));
const unseen = images.slice();
const {icons} = require('./photon-icons.json');
const missing = [];

for (let icon of icons) {
  for (let source in icon.source) {
    for (let size in icon.source[source]) {
      let image = icon.source[source][size];
      let exists = images.includes(image);
      let unseenIndex = unseen.indexOf(image);
      // console.log(`source: ${image} ${exists} ${unseenIndex}`);
      if (!exists) {
        missing.push(`${image} (from ${icon.name}.${source}.${size})`)
      }
      if (unseenIndex != -1) {
        unseen.splice(unseenIndex, 1);
      }
    }
  }
}

if (missing.length) {
  console.log(`Missing files:\n  ${missing.join("\n  ")}`);
}
if (unseen.length) {
  console.log(`Extra files:\n  ${unseen.join("\n  ")}`);
}
