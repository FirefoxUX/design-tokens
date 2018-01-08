const fs = require('fs');
const colors = require('./photon-colors.json');
const metadata = require('./package.json');
const colorArray = [];

function getRgb(value) {
  const r = parseInt(value.substr(1, 2), 16);
  const g = parseInt(value.substr(3, 2), 16);
  const b = parseInt(value.substr(5, 2), 16);
  return {r,g,b};
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
  'css': {
    'output': [`/* Photon Colors CSS Variables v${metadata.version} */\n\n:root {\n`],
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
  'less': {
    'output': [`/* Photon Colors Less Variables v${metadata.version} */\n\n`],
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
  'sass': {
    'output': [`/* Photon Colors SCSS Variables v${metadata.version} */\n\n`],
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
  'js': {
    'output': [`/* Photon Colors JS Variables v${metadata.version} */\n\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha != '100') {
        variant += `_A${alpha}`;
        value = value + (alpha / 100 * 255).toString(16).split('.')[0];
      }
      return `exports.${color.toUpperCase()}_${variant} = '${value}';\n`;
    },
    'ext': 'js'
  },
  'gimp': {
    'output': [`GIMP Palette\nName: Photon Colors\n# Photon Colors GPL Color Palette v${metadata.version}\n# ${metadata.homepage}\n\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha == '100') {
        color = color.charAt(0).toUpperCase() + color.slice(1);
        const {r,g,b} = getRgb(value);
        return `${r} ${g} ${b} ${color} ${variant}\n`;
      }
    },
    'ext': 'gpl'
  },
  'libreoffice': {
    'output': [`<?xml version="1.0" encoding="UTF-8"?>\n<ooo:color-table\n  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"\n  xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"\n  xmlns:xlink="http://www.w3.org/1999/xlink"\n  xmlns:svg="http://www.w3.org/2000/svg"\n  xmlns:ooo="http://openoffice.org/2004/office">\n\n`],
    'formatter': (color, variant, value, alpha) => {
      if (alpha == '100') {
        return `  <draw:color draw:name="${color}-${variant}" draw:color="${value}" />\n`;
      }
    },
    'ext': 'soc',
    'footer': '</ooo:color-table>'
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
