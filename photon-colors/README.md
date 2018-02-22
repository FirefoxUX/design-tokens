# Photon Colors

The standard set of colours for projects that want to harmonize with Firefox’s new Photon design language.

## Use

### Develop

The Photon Colors can be installed via npm.

```bash
$ npm install photon-colors
```

#### CSS

```css
@import url('photon-colors.css');

.class_name {
  color: var(--blue-60);
}
```

#### Sass

```Sass
@import "photon-colors.scss";

.class_name {
  color: $blue-60;
}
```

#### Less

```less
@import (reference) "photon-colors.less";

.class_name {
  color: @blue-60;
}
```

#### JavaScript

```js
import photon from 'photon-colors.js';

document.getElementById(id).style.color = photon.BLUE_60;
```

#### XML

Download and paste [photon-colors.android.xml](https://github.com/FirefoxUX/design-tokens/raw/master/photon-colors/photon-colors.android.xml) to your Android project. Then:

```xml
<item android:color="@color/blue_60" />
```

#### Swift

Download and paste [photon-colors.android.swift](https://github.com/FirefoxUX/design-tokens/raw/master/photon-colors/photon-colors.android.swift) to your Swift project. Then:

```swift
UIColor.Photon.Blue60
```

### Apps

#### Sketch

1. Install [Sketch Palettes](https://github.com/andrewfiorillo/sketch-palettes/) plugin.
2. Download [photon-colors.sketchpalette](https://github.com/FirefoxUX/design-tokens/raw/master/photon-colors/photon-colors.sketchpalette)
3. From Sketch.app Menu Bar Menus select
4. Plugins > Sketch Palettes > Load Palette
5. Select photon-colors.sketchpalette
6. Select load method to Document Presets or Global Presents

#### Gimp

1. Download [photon-colors.gpl](https://github.com/FirefoxUX/design-tokens/raw/master/photon-colors/photon-colors.gpl)
2. From Gimp Menu Bar Menus select
3. Windows > Dockable Dialogs > Palettes
4. From Tab Menu select
5. Palettes Menu > Import Palette... > Select Source > Palette file
6. Select photon-colors.gpl

#### Libre Office

1. Download [photon-colors.soc](https://github.com/FirefoxUX/design-tokens/raw/master/photon-colors/photon-colors.soc)
2. From Libre Office Menu Bar Menus select
3. Format > Page... > Area > Color > Load Color List
4. Select photon-colors.soc

## Contribute

Open an [issue](https://github.com/FirefoxUX/design-tokens/issues/new) or submit a pull request.

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

1. Edit `./build.js`
2. In the terminal, run `npm run build`



