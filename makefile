all:
	@npx webpack

run:
	@npx electron .

build:
	@env NODE_ENV=production npx webpack