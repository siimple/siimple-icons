.PHONY: build templates

# Node binaries path
NODE_BIN=./node_modules/.bin

# Run sass lint
lint: 
	${NODE_BIN}/sass-lint -v

# Compile the templates
templates: 
	node ./scripts/templates.js --source scss
	node ./scripts/templates.js --source test

