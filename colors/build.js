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
      const r = parseInt(value.substr(1, 2), 16);
      const g = parseInt(value.substr(3, 2), 16);
      const b = parseInt(value.substr(5, 2), 16);
      return `${r} ${g} ${b} ${color}-${variant}\n`
    },
    'ext': 'gpl'
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
