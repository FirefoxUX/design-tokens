#!/usr/bin/env node
'use strict';

var shell = require('shelljs');
const images = shell.ls('-R', 'icons')
  .map(image => `icons/${image}`)
  .filter(image => image.includes('.'));
const unseen = images.slice();
const {icons} = require('./photon-icons.json');
const missing = [];

let prevname = "";
const out_of_order = [];

for (let icon of icons) {
  let currname = icon.categories.join(':') + '/' + icon.name;
  if (currname < prevname) {
    out_of_order.push(`${currname} should be before ${prevname}.`);
  }
  prevname = currname;
  for (let source in icon.source) {
    for (let size in icon.source[source]) {
      let image = icon.source[source][size];
      let exists = images.includes(image);
      let unseenIndex = unseen.indexOf(image);
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

if (out_of_order.length) {
  console.log(`Out of order entries:\n  ${out_of_order.join("\n  ")}`);
}