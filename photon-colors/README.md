# Photon Colors

The standard set of colours for projects that want to harmonize with Firefox’s new Photon design language.

## Use

### Develop

The Photon Colors can be installed via npm.

```bash
$ npm install photon-colors
```

**CSS**

```css
@import url('photon-colors.css');

.class {
  color: var(--blue-60);
}
```

**SASS**

```Sass
@import "photon-colors.scss";

.class {
  color: $blue-60;
}
```

**Less**

```less
@import (reference) "photon-colors.less";

.class {
  color: @blue-60;
}
```

**JS**

```js
import photon-colors from 'photon-colors.js';
```

**XML**

Download and paste [photon-colors.android.xml](#) to your Android project. Then:

```xml
<item android:color="@color/blue_60" />
```

**Swift**

Download and paste [photon-colors.android.xml](#) to your Swift project. Then:

```swift
titleText.textColor = UIColor.Blue60
```

### Apps

**Sketch**

1. Install [Sketch Palettes](https://github.com/andrewfiorillo/sketch-palettes/) plugin.
2. Download [photon-colors.sketchpalette](#)
3. From Sketch.app Menu Bar Menus select
4. Plugins > Sketch Palettes > Load Palette
5. Select photon-colors.sketchpalette
6. Select load method to Document Presets or Global Presents

**Gimp**

1. Download [photon-colors.gpl](#)
2. From Gimp Menu Bar Menus select
3. Windows > Dockable Dialogs > Palettes
4. From Tab Menu select
5. Palettes Menu > Import Palette... > Select Source > Palette file
6. Select photon-colors.gpl

**Libre Office**

## Contribute

### Get started

```
$ git clone git@github.com:FirefoxUX/design-tokens.git
$ cd design-tokens/photon-colors
$ npm install
```

### Add or change color

1. Edit `./photon-colors.json`
2. In the terminal, run `npm run build`

### Add file type



