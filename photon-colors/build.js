const fs = require('fs');
const colors = require('./photon-colors.json');
const metadata = require('./package.json');
const colorArray = [];

function createColor(color, element, format) {
  const rv = [];

  for (const variant in element) {
    if (element.hasOwnProperty(variant)) {
      const value = element[variant];
      rv.push(format.formatter(color, variant, value));
    }
  }
  if (format.group_end === undefined) {
    format.group_end = '\n';
  }
  if (format.group_end) {
    rv.push(format.group_end);
  }
  return rv;
}

const formats = {
  'css': {
    'output': [`/* Photon Colors CSS Variables v${metadata.version} */

:root {
`],
    'formatter': (color, variant, value) => `  --${color}-${variant}: ${value};\n`,
    'footer': '}\n',
    'ext': 'css'
  },
  'less': {
    'output': [`/* Photon Colors Less Variables v${metadata.version} */

`],
    'formatter': (color, variant, value) => `@${color}-${variant}: ${value};\n`,
    'ext': 'less'
  },
  'sass': {
    'output': [`/* Photon Colors SCSS Variables v${metadata.version} */

`],
    'formatter': (color, variant, value) => `$${color}-${variant}: ${value};\n`,
    'ext': 'scss'
  },
  'js': {
    'output': [`/* Photon Colors JS Variables v${metadata.version} */

`],
    'formatter': (color, variant, value) => `exports.${color.toUpperCase()}_${variant} = '${value}';\n`,
    'ext': 'js'
  },
  'gimp': {
    'output': [`GIMP Palette
Name: Photon Colors
# Photon Colors GPL Color Palette v${metadata.version}
# ${metadata.homepage}

`],
    'formatter': (color, variant, value) => {
      color = color.charAt(0).toUpperCase() + color.slice(1);
      const r = parseInt(value.substr(1, 2), 16);
      const g = parseInt(value.substr(3, 2), 16);
      const b = parseInt(value.substr(5, 2), 16);
      return `${r} ${g} ${b} ${color} ${variant}\n`
    },
    'ext': 'gpl'
  },
  'libreoffice': {
    'output': [`<?xml version="1.0" encoding="UTF-8"?>
<ooo:color-table
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:svg="http://www.w3.org/2000/svg"
  xmlns:ooo="http://openoffice.org/2004/office">

`],
    'formatter': (color, variant, value) => {
      return `  <draw:color draw:name="${color}-${variant}" draw:color="${value}" />\n`
    },
    'ext': 'soc',
    'footer': '</ooo:color-table>'
  },
  'sketch': {
    output: [],
    ext: 'sketchpalette',
    formatter: (color, variant, value) => {
      const r = parseInt(value.substr(1, 2), 16)/255;
      const g = parseInt(value.substr(3, 2), 16)/255;
      const b = parseInt(value.substr(5, 2), 16)/255;
      return {
        "alpha":1,
        "blue":b,
        "green":g,
        "red":r
      };
    },
    group_end: '',
    outputter: (data) => {
      let output = {
        "colors": [...data],
        "pluginVersion":"1.5",
        "compatibleVersion":"1.5"
      }
      return JSON.stringify(output, null, 2);
    }
  }
}

for (const color in colors) {
  const element = colors[color];
  for (const key in formats) {
    const format = formats[key];
    format.output.push(...createColor(color, element, format));
  }
}

// output key/value formats to files
for (let key in formats) {
  const format = formats[key];
  if (format.footer) {
    format.output.push(format.footer);
  }
  let out_func = format.outputter;
  if (!out_func) {
    out_func = (data) => data.join('');
  }
  fs.writeFile(`photon-colors.${format.ext}`, out_func(format.output), 'utf8', (err) => {
    if (err) throw err;
  });
}
