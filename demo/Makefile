.PHONY: link
link:
	@echo "Linking local 'react-mirror'"
	@pnpm link "../" --dir "."

.PHONY: start
start: link
	@../node_modules/.bin/react-scripts start

.PHONY: build
build: link
	@../node_modules/.bin/react-scripts build
