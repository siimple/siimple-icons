# siimple-icons

> siimple-icons is a suite of scalable icons for web, desktop and mobile projects.


## Installation 

Use [npm](https://npmjs.com) to install the latest version of **siimple-icons**:

```
npm install siimple-icons --save
```


## Usage

If you take a look at the `dist` folder, you can see the following entries: 

```
dist
├── fonts
│   ├── siimple-icons.font.svg
│   ├── siimple-icons.font.ttf
│   ├── siimple-icons.font.woff
│   └── siimple-icons.font.woff2
├── siimple-icons.css
└── siimple-icons.svg
```

- A file called `siimple-icons.css`. It contains all styles that you will need when using **siimple-icons**.
- A folder called `fonts`. It contains all of the typeface files used by `siimple-icons.css`.
- A file called `siimple-icons.svg`. Is a SVG sprite with all the icons.


### Using the CSS styles

You should copy `siimple-icons.css` and the `fonts` folder into the assets folder of your project. Now, add a reference to `siimple-icons.css` in the `<head>` tag of each HTML file where you are going to use **siimple-icons**: 

```html
<link rel="stylesheet" href="./assets/siimple-icons.css">
```

Remember that you should change the path `./assets/siimple-icons.css` used in the previous example with the correct path where you have copied the `siimple-icons.css` file and the `fonts` folder in your project. 

To use the icons in the `<body>` tag of your HTML file, first create a `<span>` tag with the following classes: 

- `si`: is the base class for **siimple-icons**.
- `si-[ICON]`, where `[ICON]` is the name of the icon that you are going to add.  

```html 
<!-- Add a left arrow icon -->
<span class="si si-arrow-left"></span>

<!-- Add a star icon -->
<span class="si si-star"></span>
```

You can style your icons adding a `style` attribute or adding an additional class with your custom styles: 

```html 
<!-- Style your icon -->
<style>
    .yellow-star {
        color: #ffea66;
        font-size: 20px;
    }
</style>

<span class="si si-star yellow-star"></span>
```


### Using the SVG sprite

You should copy `siimple-icons.svg` into the assets folder of your project. Now, in your HTMl document where you are going to use an icon, create a `<svg>` element and add the following information to it:

- Add a `viewbox="0 0 48 48"` attribute.
- **Optionally** add a `class` attrbitue with the class (or classes) used to style your icon. See the example below.
- As a children of the `<svg>` tag, add a `<use>` tag with a reference to the sprites file and the icon that you are going to use.

For example, if your `siimple-icons.svg` file is placed on the `assets` folder, you can use the `settings` icon adding the following HTML code: 

```html
<svg viewbox="0 0 48 48">
    <use xlink:href="./assets/siimple-icons.svg#settings"></use>
</svg>
```

You can also style your icon adding a class to the parent `<svg>` tag with your custom styles:

```html
<!-- Your custom icon style -->
<style>
    .red-arrow {
        width: 100px;
        height: 100px;
        fill: #f44242
    }
</style>

<svg viewbox="0 0 48 48" class="red-arrow">
    <use xlink:href="./assets/siimple-icons.svg#arrow-left"></use>
</svg>
```

## Build instructions

First, you must navigate to the **siimple-icons** folder and install all dependencies using **npm**:

```
npm install
```

Be sure that you have [gulp](https://github.com/gulpjs/gulp) installed globally. If not, you can install it running: 

```
npm install -g gulp
```
 
### Build the sprite

You can generate the sprite with all the images running the following command:

```
gulp sprite
```

This will generate a file called `siimple-icons.svg` on the `dist` folder.



## License 

All the icons in **siimple-icons** are under the [MIT](./LICENSE) license. &copy; The **siimple team**.

