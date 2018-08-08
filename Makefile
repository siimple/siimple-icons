.PHONY: build templates

# Node binaries path
NODE_BIN=./node_modules/.bin

# Compile the templates
templates: 
	node ./scripts/templates.js --source scss
	node ./scripts/templates.js --source test

