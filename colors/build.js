const fs = require('fs');
const colors = require('./photon.json');
const metadata = require('./package.json');

function createColor(color, element) {
  var rv = [];
  for (var variant in element) {
    if (element.hasOwnProperty(variant)) {
      var value = element[variant];
      rv.push(`  --${color}-${variant}: ${value};\n`);
    }
  }
  return rv;
}

let rv = [`/* Firefox Colors CSS Variables v${metadata.version} */

:root {
`];
for (var color in colors) {
  if (colors.hasOwnProperty(color)) {
    var element = colors[color];
    rv.push(...createColor(color, element));
  }
}
rv.push('}\n');
fs.writeFile('colors.css', rv.join(''), 'utf8', (err) => {
  if (err) throw err;
  // console.log('It\'s saved!');
});
