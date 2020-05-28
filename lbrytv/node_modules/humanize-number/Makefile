
build: components index.js
	@component build --dev

components:
	@component install --dev

clean:
	rm -fr build components template.js

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

.PHONY: clean test
