const fs = require('fs');
const colors = require('./photon-colors.json');
const metadata = require('./package.json');
const colorArray = [];

const jsLicense = `/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
`;
const xmlLicense = `<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
`;
const shLicense = `# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
`;

function getRgb(value) {
  const r = parseInt(value.substr(1, 2), 16);
  const g = parseInt(value.substr(3, 2), 16);
  const b = parseInt(value.substr(5, 2), 16);
  return {r,g,b};
}

function toHex(value) {
  return ('0' + Math.floor(value / 100 * 255).toString(16).split('.')[0]).substr(-2);
}

function createColor(color, element, format) {
  const rv = [];

  for (const variant in element) {
    if (element.hasOwnProperty(variant)) {
      const value = element[variant];
      rv.push(format.formatter(color, variant, value.hex, '100'));
      for (let alpha of value.opacity || []) {
        let out = format.formatter(color, variant, value.hex, alpha);
        if (out) {
          rv.push(out);
        }
      }
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
  'android': {
    'output': [`<?xml version="1.0" encoding="utf-8"?>\n\n${xmlLicense}\n<resources>\n    <!-- Photon Color Palette v${metadata.version} -->\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha != '100') {
        variant += `_a${alpha}`;
        value = '#' + toHex(alpha) + value.substr(1);
      }
      return `    <color name="${color}_${variant}">${value}</color>\n`
    },
    'ext': 'android.xml',
    'footer': '</resources>'
  },
  'css': {
    'output': [`${jsLicense}\n/* Photon Colors CSS Variables v${metadata.version} */\n\n:root {\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha == '100') {
        return `  --${color}-${variant}: ${value};\n`;
      } else {
        const {r,g,b} = getRgb(value);
        return `  --${color}-${variant}-a${alpha}: rgba(${r}, ${g}, ${b}, ${alpha/100});\n`;
      }
    },
    'footer': '}\n',
    'ext': 'css'
  },
  'gimp': {
    'output': [`GIMP Palette\nName: Photon Colors\n${shLicense}\n# Photon Colors GPL Color Palette v${metadata.version}\n# ${metadata.homepage}\n\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha == '100') {
        color = color.charAt(0).toUpperCase() + color.slice(1);
        const {r,g,b} = getRgb(value);
        return `${r} ${g} ${b} ${color} ${variant}\n`;
      }
    },
    'ext': 'gpl'
  },
  'ios': {
    'output': [`${jsLicense}\n/* Photon Colors iOS Variables v${metadata.version}\n   From ${metadata.homepage} */\nimport UIKit\n\nextension UIColor {\n    struct Photon {\n`],
    'formatter': (color, variant, value, alpha) => {
      color = color[0].toUpperCase() + color.substr(1);
      if (alpha != '100') {
        variant += `A${alpha}`;
        value = `rgba: 0x${value.substr(1) + toHex(alpha)}`
      } else {
        value = `rgb: 0x${value.substr(1)}`;
      }
      return `        static let ${color}${variant} = UIColor(${value})\n`;
    },
    'ext': 'swift',
    'footer': '  }\n}'
  },
  'js': {
    'output': [`${jsLicense}\n/* Photon Colors JS Variables v${metadata.version} */\n\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha != '100') {
        variant += `_A${alpha}`;
        value = value + toHex(alpha);
      }
      return `exports.${color.toUpperCase()}_${variant} = '${value}';\n`;
    },
    'ext': 'js'
  },
  'less': {
    'output': [`${jsLicense}\n/* Photon Colors Less Variables v${metadata.version} */\n\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha == '100') {
        return `@${color}-${variant}: ${value};\n`;
      } else {
        const {r,g,b} = getRgb(value);
        return `@${color}-${variant}-a${alpha}: rgba(${r}, ${g}, ${b}, ${alpha/100});\n`;
      }
    },
    'ext': 'less'
  },
  'libreoffice': {
    'output': [`<?xml version="1.0" encoding="UTF-8"?>\n${xmlLicense}\n<ooo:color-table\n  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"\n  xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"\n  xmlns:xlink="http://www.w3.org/1999/xlink"\n  xmlns:svg="http://www.w3.org/2000/svg"\n  xmlns:ooo="http://openoffice.org/2004/office">\n<!-- Photon Color Palette v${metadata.version} -->\n\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha == '100') {
        return `  <draw:color draw:name="${color}-${variant}" draw:color="${value}" />\n`;
      }
    },
    'ext': 'soc',
    'footer': '</ooo:color-table>'
  },
  'sass': {
    'output': [`${jsLicense}\n/* Photon Colors SCSS Variables v${metadata.version} */\n\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha == '100') {
        return `$${color}-${variant}: ${value};\n`;
      } else {
        const {r,g,b} = getRgb(value);
        return `$${color}-${variant}-a${alpha}: rgba(${r}, ${g}, ${b}, ${alpha/100});\n`;
      }
    },
    'ext': 'scss'
  },
  'sketch': {
    output: [],
    ext: 'sketchpalette',
    formatter: (color, variant, value, alpha) => {
      const {r,g,b} = getRgb(value);
      return {
        "alpha": alpha / 100,
        "blue": b / 255,
        "green": g / 255,
        "red": r / 255
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
