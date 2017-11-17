const fs = require('fs');
const colors = require('./photon.json');
const metadata = require('./package.json');

function createColor(color, element, formatter) {
  const rv = [];

  for (const variant in element) {
    if (element.hasOwnProperty(variant)) {
      const value = element[variant];
      rv.push(formatter(color, variant, value));
    }
  }
  rv.push('\n');
  return rv;
}

const formats = {
  'css': {
    'output': [`/* Firefox Colors CSS Variables v${metadata.version} */

:root {
`],
    'formatter': (color, variant, value) => `  --${color}-${variant}: ${value};\n`,
    'footer': '}\n',
    'ext': 'css'
  },
  'less': {
    'output': [`/* Firefox Colors Less Variables v${metadata.version} */

`],
    'formatter': (color, variant, value) => `@${color}-${variant}: ${value};\n`,
    'ext': 'less'
  },
  'sass': {
    'output': [`/* Firefox Colors SCSS Variables v${metadata.version} */

`],
    'formatter': (color, variant, value) => `$${color}-${variant}: ${value};\n`,
    'ext': 'scss'
  },
  'js': {
    'output': [`/* Firefox Colors JS Variables v${metadata.version} */

`],
    'formatter': (color, variant, value) => `exports.${color.toUpperCase()}_${variant} = '${value}';\n`,
    'ext': 'js'
  },
  'gimp': {
    'output': [`GIMP Palette
Name: Firefox/Photon
# Firefox Colors GPL Color Palette v${metadata.version}
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
  }
}

for (const color in colors) {
  const element = colors[color];
  for (const key in formats) {
    const format = formats[key];
    format.output.push(...createColor(color, element, format.formatter));
  }
}

for (let key in formats) {
  const format = formats[key];
  format.output.push(format.footer || '');
  fs.writeFile(`colors.${format.ext}`, format.output.join(''), 'utf8', (err) => {
    if (err) throw err;
  });
}
