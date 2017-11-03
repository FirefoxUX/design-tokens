const { icons } = require('./index.js');
const fs = require('fs');
const path = require('path');

// HTML Demo Page
let output = `
<!DOCTYPE html>
<html>
<head>
  <title>Photon Icons</title>
  <link rel="stylesheet" href="../index.css" type="text/css">
  <style type="text/css">
    body { display: flex; flex-wrap: wrap; }
    div {
      flex-basis: 30%;
      margin-bottom: 2em;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: row;
      display: flex;
    }
    div h2 { font-size: 14px; display: block; text-align: center; }
    span { margin-bottom: 16px; font-size: 48px; font-family: "photon-icons"; display: block; text-align: center; }
    span + span { font-size: 24px; opacity: 0.1 }
    span + span + span { font-size: 12px; opacity: 0.1 }
    div:hover span,
    div:focus span { opacity: 1; }
  </style>
</head>
<body>
  ${Object.keys(icons).map(iconName => {
      return `
      <div>
        <span title="${iconName} - 48px" class="photon-icon-${iconName}"></span>
        <span title="${iconName} - 24px" class="photon-icon-${iconName}"></span>
        <span title="${iconName} - 12px" class="photon-icon-${iconName}"></span>
        <h2>${ iconName }</h2>
      </div>`;
    }).join('\n')}
</body>
</html>
`;


try {
  fs.writeFileSync('./demo/index.html', output);
} catch(err) {
  throw err;
}

console.log("HTML demo file was saved!");


// CSS
const now = (new Date()).toLocaleString();
const FONT_PATH = path.relative(__dirname, './fonts/');
const FILE_PATH = `${FONT_PATH}/photon-icons`;

output = `
/* Automated build - ${now} */

@font-face {
  font-family: "photon-icons";
  src:  url('${FILE_PATH}.eot');
  src:  url('${FILE_PATH}.eot#iefix') format('embedded-opentype'),
    url('${FILE_PATH}.ttf') format('truetype'),
    url('${FILE_PATH}.woff') format('woff'),
    url('${FILE_PATH}.svg#photon-icons') format('svg');
  font-weight: normal;
  font-style: normal;
}

[class^="photon-icon-"]::before, [class*="photon-icon-"]::before {
  font-family: "photon-icons" !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

${
  Object.keys(icons).map(iconName =>
    `.photon-icon-${iconName}::before { content: "${icons[iconName]}"; }`
  ).join('\n')
}
`

try {
  fs.writeFileSync('./index.css', output);
} catch(err) {
  throw err;
}

console.log("CSS file was saved!");

