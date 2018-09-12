.PHONY: build test docs

# Node binaries path
NODE_BIN=./node_modules/.bin

# Output files
OUTPUT_CSS=./dist/siimple-icons.css
OUTPUT_CSS_MIN=./dist/siimple-icons.min.css
OUTPUT_SVG=./dist/siimple-icons.svg
OUTPUT_FONTS=./dist/fonts
OUTPUT_FONTS_SVG=${OUTPUT_FONTS}/siimple-icons.font.svg
OUTPUT_FONTS_TTF=${OUTPUT_FONTS}/siimple-icons.font.ttf
OUTPUT_FONTS_WOFF=${OUTPUT_FONTS}/siimple-icons.font.woff
OUTPUT_FONTS_WOFF2=${OUTPUT_FONTS}/siimple-icons.font.woff2

# Run sass lint
lint: 
	${NODE_BIN}/sass-lint -v

# Build the fonts and the css files
build: 
	@logger -s "Build started"
	@logger -s "Compiling SCSS templates"
	node ./scripts/templates.js --source scss
	@logger -s "Compiling CSS files"
	mkdir -p ${OUTPUT_FONTS}
	${NODE_BIN}/sass icons.scss ${OUTPUT_CSS} 
	node ./scripts/header.js > ./dist/header.txt
	cat ./dist/header.txt ${OUTPUT_CSS} > ${OUTPUT_CSS}.temp
	rm ./dist/header.txt
	rm ${OUTPUT_CSS}
	mv ${OUTPUT_CSS}.temp ${OUTPUT_CSS}
	@logger -s "Autoprefix and clean the generated CSS file"
	${NODE_BIN}/postcss --use autoprefixer --config ./postcss.config.js --map false --output ${OUTPUT_CSS} ${OUTPUT_CSS}
	${NODE_BIN}/cleancss --compatibility "*" --level 2 --output ${OUTPUT_CSS_MIN} ${OUTPUT_CSS}
	@logger -s "Generating SVG sprites"
	node ./scripts/build-svg-sprites.js --output ${OUTPUT_SVG}
	@logger -s "Generating SVG font"
	node ./scripts/build-svg-font.js --output ${OUTPUT_FONTS_SVG}
	@logger -s "Generating TTF font"
	${NODE_BIN}/svg2ttf ${OUTPUT_FONTS_SVG} ${OUTPUT_FONTS_TTF}
	@logger -s "Generating WOFF font"
	${NODE_BIN}/ttf2woff ${OUTPUT_FONTS_TTF} ${OUTPUT_FONTS_WOFF}
	@logger -s "Generating WOFF2 font"
	${NODE_BIN}/woff2_compress.js ${OUTPUT_FONTS_TTF} ${OUTPUT_FONTS_WOFF2}
	@logger -s "Build finished"

# Build tests
test: 
	node ./scripts/templates.js --source test

# Build docs
docs: 
	@logger -s "Docs build started"
	@logger -s "Building documentation site with Jekyll"
	cd ./docs && bundle exec jekyll build
	@logger -s "Copying assets files"
	mkdir -p ./docs/_site/assets/js
	cp ./node_modules/react/umd/react.production.min.js ./docs/_site/assets/js/
	cp ./node_modules/react-dom/umd/react-dom.production.min.js ./docs/_site/assets/js/
	cp ./bower_components/siimple/dist/siimple.min.css ./docs/_site/assets/css/
	cp ./dist/siimple-icons.min.css ./docs/_site/assets/css/
	cp -R ./dist/fonts ./docs/_site/assets/css/
	cp ./icons.json ./docs/_site/assets/
	@logger -s "Docs build finished"

# Serve documentation
docs-serve:
	${NODE_BIN}/stattic --folder ./docs/_site/ --port 5000 --cors

# Publish docs
docs-publish:
	@logger -s "Docs publis started"
	make docs	

