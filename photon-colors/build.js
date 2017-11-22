const fs = require('fs');
const colors = require('./photon-colors.json');
const metadata = require('./package.json');
const colorArray = [];

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
// unfortunately the sketch palatte format is
// rather different from the other output formats which
// include named variables,
// and is handled differently than the other formats
  'sketch': {
    output: [`{
  "colors": [
`],
    ext: 'sketchpalette',
    footer: `
  ],
  "pluginVersion":"1.5",
  "compatibleVersion":"1.5"
}`,
    formatter: (value, last) => {
      const r = parseInt(value.substr(1, 2), 16)/255;
      const g = parseInt(value.substr(3, 2), 16)/255;
      const b = parseInt(value.substr(5, 2), 16)/255;
      let obj = `    {
      "alpha":1,
      "blue":${b},
      "green":${g},
      "red":${r}
    }`;
      if (!last) {
        obj +=  `,\n`
      }
      return obj;
    }
  }
}

// populate output for formats with key/value pairs
// and fill up an array for other formats
for (const color in colors) {
  const element = colors[color];
  for (val in element) {
    colorArray.push(element[val]);
  }
  for (const key in formats) {
    if (key === 'sketch') continue;
    const format = formats[key];
    format.output.push(...createColor(color, element, format.formatter));
  }
}

// output key/value formats to files
for (let key in formats) {
  if (key === 'sketch') continue;
  const format = formats[key];
  format.output.push(format.footer || '');
  fs.writeFile(`photon-colors.${format.ext}`, format.output.join(''), 'utf8', (err) => {
    if (err) throw err;
  });
}

// populate output for sketch format
colorArray.map((el,index, arr) => {
  const last = (index === arr.length - 1);
  formats['sketch'].output.push(formats['sketch'].formatter(el, last));
});

formats['sketch'].output.push(formats['sketch'].footer);

// output sketch format to files
fs.writeFile(`photon-colors.sketchpalette`, formats['sketch'].output.join(''), 'utf8', (err) => {
  if (err) throw err;
});

