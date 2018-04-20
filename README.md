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
- A folder called `fonts`. It contains all of the typeface files used by `siimple-icons.css` and `siimple-icons.min.css` to display the icons.
- A file called `siimple-icons.svg`. Is a SVG sprite with all the icons.


### Using the CSS styles

You should copy `siimple-icons.css` and the `fonts` folder into the assets folder of your project. 


### Using the SVG sprite

The svg sprite is placed in `dist` with the name `siimple-icons.svg`. Each icon is saved with an ID, extracted from the icon file name (without the `.svg` extension). For example, the icon `src/arrow-up.svg` is saved in the sprite with the ID `arrow-up`.  

You can use all the icons in the sprite adding the following HTML code to your web page:

```html
<svg viewBox="0 0 48 48" class="icon">
    <use xlink:href="path/to/siimple-icons/dist/siimple-icons.svg#ICON"></use>
</svg>
```

Where `ICON` is the ID of the wanted icon. You can use CSS to change the width, height and color of the icon: 

```html
<style>
    .icon {
        width: 100px;
        height: 100px;
        fill: #15b7a1;
    }
</style>
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

