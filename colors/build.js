const fs = require('fs');
const colors = require('./photon.json');
const metadata = require('./package.json');

function createColor(color, element, formatter) {
  const rv = [];

  for (const variant in element) {
    if (element.hasOwnProperty(variant)) {
      const value = element[variant];
      rv.push(formatter(variant, value));
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

const jsOutput = [`/* Firefox Colors JS Variables v${metadata.version} */

`];

for (const color in colors) {
  if (colors.hasOwnProperty(color)) {
    const element = colors[color];
    cssOutput.push(...createColor(color, element,
      (variant, value) => `  --${color}-${variant}: ${value};\n`));
    sassOutput.push(...createColor(color, element,
      (variant, value) => `$${color}-${variant}: ${value};\n`));
    jsOutput.push(...createColor(color, element,
      (variant, value) => `exports.${color.toUpperCase()}_${variant} = '${value}';\n`));
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
