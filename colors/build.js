const fs = require('fs');
const colors = require('./photon.json');
const metadata = require('./package.json');

function createColor(color, element, prefix) {
  const rv = [];

  for (const variant in element) {
    if (element.hasOwnProperty(variant)) {
      const value = element[variant];
      rv.push(`${prefix}${color}-${variant}: ${value};\n`);
    }
  }
  rv.push('\n');
  return rv;
}

function createJsColor(color, element) {
  const rv = [];

  for (const variant in element) {
    if (element.hasOwnProperty(variant)) {
      const value = element[variant];
      rv.push(`exports.${color.toUpperCase()}_${variant} = '${value}';\n`);
    }
  }
  rv.push('\n');
  return rv;
}


const cssOutput = [`/* Firefox Colors CSS Variables v${metadata.version} */

:root {
`];

const sassOutput = [`/* Firefox Colors SCSS Variables v${metadata.version} */

`];

const jsOutput = [`/* Firefox Colors JS v${metadata.version} */

`];

for (const color in colors) {
  if (colors.hasOwnProperty(color)) {
    const element = colors[color];
    cssOutput.push(...createColor(color, element, '  --'));
    sassOutput.push(...createColor(color, element, '$'));
    jsOutput.push(...createJsColor(color, element));
  }
}

cssOutput.push('}\n');

fs.writeFile('colors.css', cssOutput.join(''), 'utf8', (err) => {
  if (err) throw err;
});

fs.writeFile('colors.scss', sassOutput.join(''), 'utf8', (err) => {
  if (err) throw err;
});

fs.writeFile('colors.js', jsOutput.join(''), 'utf8', (err) => {
  if (err) throw err;
});
