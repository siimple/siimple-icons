# siimple-icons

A suite of SVG icons for web, desktop and mobile projects.


## Usage

The svg sprite is placed in `dist`. Each icon is saved with an ID using pattern `{{ icon-group }}-{{ icon-name }}`, where `icon-group` is the group where this icon is placed, and `icon-name` is the icon file name (without the `.svg` extension). For example, the icon `navigation/arrow-up.svg` is saved in the sprite with the ID `navigation-arrow-up`.  

You can use all the icons in the sprite adding the following HTML code to your web page:

```html
<svg viewBox="0 0 48 48" class="icon">
  <use xlink:href="{{ path }}/siimple-icons.svg#[[ICON-ID]]"></use>
</svg>
```

Where `{{ path }}` is the path to the `dist` folder of this module, and `{{ icon-id }}` is the ID of the icon. You can use CSS to change the width, height and color of the icon: 

```html
<style>
  .icon 
  {
    width: 100px;
    height: 100px;
    fill: #15b7a1;
  }
</style>
```

## Build the sprite

Navigate to the **siimple-icons** folder and install all dependencies using **npm**:

```
npm install
```

Be sure that you have [gulp](https://github.com/gulpjs/gulp) installed globally. If not, you can install it running: 

```
npm install -g gulp
```

Now you can generate the sprite with all the images running the following command:

```
gulp icons
```



## License 

All the icons in **siimple-icons** are under the [MIT](./LICENSE) license. &copy; The **siimple team**.
