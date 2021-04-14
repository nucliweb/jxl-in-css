# JPEG XL in CSS

<img src="https://github.com/nucliweb/jxl-in-css/blob/main/assets/jpegxl.svg?raw=true" align="right"
     alt="JPEG XL logo" width="180" height="100">

[PostCSS] plugin and tiny JS script *(150B)* to use[JPEG XL] in CSS background

With this PostCSS Plugin you can use **JPEG XL** image format in your CSS background in [Supported Browsers](#supported-browsers), and fallback with the original image.


## How works?

You add `require('jxl-in-css')` to your JS bundle and write CSS like:

```css
.logo {
  width: 80px;
  height: 80px;
  background-image: url(logo.jpg);
}
```

The script will set `jxl` or `no-jxl` class on `<body>` and PostCSS plugin will generate:

```css
.logo {
  width: 80px;
  height: 80px;
}
body.jxl .logo {
  background-image: url(logo.jxl);
}
body.no-jxl .logo {
  background-image: url(logo.jpg);
}
```

## Usage
### 1. Convert to JXL

Convert you images to jxl format, you can use [Squoosh]

### 2. Install `jxl-in-css`

```sh
npm install --save-dev jxl-in-css
```
#### 2.1 Load the polyfill

Add the JS script to your client-side JS bundle:

```diff js
// CommonJS
+ require('jxl-in-css/polyfill.js')

// ES6
+ import 'jxl-in-css/polyfill.js'
```

Since JS script is very small (315B gzipped), the best way for landings
is to inline it to HTML:

```diff html
+   <script><%= readFile('node_modules/jxl-in-css') %></script>
  </head>
```

You can load the script via CDN:

```diff html
+   <script src="https://unpkg.com/jxl-in-css/polyfill.js"></script>
  </head>
```

#### 2.2 Load the PostCSS plugin

Check do you use PostCSS already in your bundler. You can check `postcss.config.js` in the project root, `"postcss"` section in `package.json` or `postcss` in bundle config.

If you don’t have it already, add PostCSS to your bundle:

* For webpack see [postcss-loader] docs.
* For Parcel create `postcss.config.js` file.
  It already has PostCSS support.
#### Add `jxl-in-css` to PostCSS plugins

```diff js
module.exports = {
  plugins: [
+   require('jxl-in-css'),
    require('autoprefixer')
  ]
}
```
If you use CSS Modules in webpack add `modules: true` option:

```diff js
module.exports = {
  plugins: [
-   require(jxl-in-css'),
+   require(jxl-in-css')({ modules: true }),
    require('autoprefixer')
  ]
}
```

## PostCSS Options

```js
module.exports = {
  plugins: [
    require('jxl-in-css')({ /* options */ }),
  ]
}
```
| Option | Description | Default Value | Type Value |
| ------ | ----------- | ------------- | ---------- |
| `modules` |  Wrap classes to `:global()` to support CSS Modules. | `false` | Boolean |
| `jxlClass` |  Class name for browser with jxl support. | `jxl` | String |
| `noJxlClass` |  Class name for browser without jxl support. | `no-jxl` | String |
| `rename` |  Get a new file name from old name, like `(oldName: string) => string`, then `url(./image.png)` → `url(./image.png.jxl)`. | | Function |

## Supported browsers

* [Chrome Canary] 92+ with **Enabled JXL image format** `chrome://flags/#enable-jxl`


[PostCSS]: https://github.com/postcss/postcss
[JPEG XL]: https://jpeg.org/jpegxl/
[Squoosh]: https://squoosh.app/
[postcss-loader]: https://github.com/postcss/
[Chrome Canary]: https://www.google.com/intl/es/chrome/canary/
