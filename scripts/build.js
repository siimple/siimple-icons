let rmr = require("rmr");
let fs = require("fs");
let path = require("path");
let SVGIcons2SVGFontStream = require("svgicons2svgfont");
let svg2ttf = require("svg2ttf");
let ttf2woff2 = require("ttf2woff2");
let ttf2woff = require("ttf2woff");
let sass = require("node-sass");
let mkdirp = require("mkdirp");
let svgo = require("svgo");
let svgstore = require("svgstore");
let glob = require("glob");

let tasks = require("./tasks.js");

let icons = require("../icons.json");

//Output paths
let paths = {};
paths.svgFont = "./dist/fonts/siimple-icons.font.svg";
paths.ttfFont = "./dist/fonts/siimple-icons.font.ttf";
paths.woffFont = "./dist/fonts/siimple-icons.font.woff";
paths.woff2Font = "./dist/fonts/siimple-icons.font.woff2";

//Clean dist folder
tasks.task("dist:clean", function (done) {
    tasks.logger.log("Cleaning folder ./dist");
    return rmr("./dist/", function (error) {
        return done(error);
    });
});

//Create the dist folder
tasks.task("dist:create", function (done) {
    return mkdirp("./dist/fonts", function (error) {
        return done(error);
    })
});

//Compile SCSS files and generate the final CSS files
tasks.task("compile:scss", function (done) {
    return fs.readFile("./scss/siimple-icons.scss", "utf8", function (error, content) {
        if (error) {
            return done(error);
        }
        //Compile the scss file
        return sass.render({data: content, includePaths: ["./scss/"]}, function (error, result) {
            if (error) {
                return done(error);
            }
            //Write the compiled css file
            return fs.writeFile("./dist/siimple-icons.css", result.css, "utf8", function (error) {
                return done(error);
            });
        });
    });
});

//Build the svg sprite
tasks.task("compile:svg", function (done) {
    return glob("./svg/*.svg", function (error, files) {
        if (error) {
            return done(error);
        }
        //Sprites storage
        let sprites = svgstore();
        let parseSvg = function (index) {
            if (index >= files.length) {
                let output = "./dist/siimple-icons.svg";
                return fs.writeFile(output, sprites, "utf8", function (error) {
                    return done(error);
                });
            }
            let file = files[index];
            tasks.logger.log("Adding icon '" + file + "' to svg sprite");
            return fs.readFile(file, "utf8", function (error, content) {
                if (error) {
                    return done(error);
                }
                //Initialize the svg minimize
                let prefix = path.basename(file, path.extname(file));
                let svgmin = new svgo({plugins: [{cleanupIDs: {prefix: prefix + '-', minify: true}}]});
                return svgmin.optimize(content).then(function (result) {
                    //Save to the svg sprite
                    sprites.add(prefix, result.data);
                    return parseSvg(index + 1);
                });
            });
        };
        return parseSvg(0);
    });
});

//Build the SVG font
tasks.task("font:svg", function (done) {
    let fontStream = new SVGIcons2SVGFontStream({fontName: "SiimpleIcons", normalize: true, fontHeight: 1000});
    let writer = fs.createWriteStream(paths.svgFont);
    fontStream.pipe(writer);
    //Error listener
    fontStream.on('error', function (error) {
        return done(error);
    });
    //Writer finished
    writer.on('finish', function () {
        tasks.logger.log("Font saved as " + paths.svgFont);
        return done();
    });
    //Add each icon in the font stream
    icons.forEach(function (icon) {
        tasks.logger.log("Adding icon '" + icon.id + "' to SVG font");
        let iconPath = path.join("./svg/", icon.id + ".svg");
        let iconReader = fs.createReadStream(iconPath);
        //Set the icon metadata
        iconReader.metadata = {unicode: [String.fromCharCode(icon.unicode)], name: icon.id};
        fontStream.write(iconReader);
    });
    fontStream.end();
});

//Build font in ttf format
tasks.task("font:ttf", function (done) {
    return fs.readFile(paths.svgFont, "utf8", function (error, content) {
        if (error) {
            return done(error);
        }
        //Convert the svg font to ttf font format
        let ttf = svg2ttf(content, {});
        tasks.logger.log("Saving ttf font as " + paths.ttfFont);
        return fs.writeFile(paths.ttfFont, new Buffer(ttf.buffer), function (error) {
            return done(error);
        });
    });
});

//Build font in woff format
tasks.task("font:woff", function (done) {
    let input = fs.readFileSync(paths.ttfFont);
    let ttf = new Uint8Array(input);
    let woff = new Buffer(ttf2woff(ttf, {}).buffer);
    fs.writeFileSync(paths.woffFont, woff);
    return done();
});

//Build font in woff2 format
tasks.task("font:woff2", function (done) {
    let input = fs.readFileSync(paths.ttfFont);
    let ttf = new Uint8Array(input);
    fs.writeFileSync(paths.woff2Font, ttf2woff2(ttf));
    return done();
});

//Run all tasks in order
tasks.run();
