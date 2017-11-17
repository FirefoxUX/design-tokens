# Photon Design Tokens

A design token is an abstraction of a visual property such as color, font, width, animation, etc. These raw values are language application agnostic and once transformed and formatted can be used on any platform.

For example in CSS, design tokens are used as _variables_, though there will be conversions made for iOS and Android.

A design token file is written in [JSON](http://json.org/). For example this is a color token:

```
{
  "blue": {
    "50": "#0a84ff"
  }
}
```

And this is its conversion into a CSS variable:

```
:root {
  --blue-50: #0a84ff;
}
```

## Contribute

Setup the environment with [git](https://git-scm.com/) and [node](https://nodejs.org/en/) already installed. Then:

```
$ git clone https://github.com/firefoxux/design-tokens/
$ cd /path/to/folder
$ npm install
```

You can either [submit an issue](https://github.com/firefoxux/design-tokens/issues/new) or submit a pull request of changed code yourself.
