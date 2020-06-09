install:
	npm install

start:
	node bin/diff-calc

publish:
	npm publish --dry-run

lint:
	npx eslint .