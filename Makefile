PACKAGE_NAME = kpop

# Tools

YARN ?= yarn

# Variables

VERSION ?= $(shell git describe --tags --always --dirty --match=v* 2>/dev/null | sed 's/^v//' || \
			cat $(CURDIR)/.version 2> /dev/null || echo 0.0.0-unreleased)

# Build

.PHONY: all
all: build

.PHONY: build
build:  vendor ; $(info building ...)	@
	@rm -rf ./es/
	REACT_APP_KOPANO_BUILD="${VERSION}" BABEL_ENV=production $(YARN) run build
	echo $(VERSION) > .version

.PHONY: lint
lint: vendor ; $(info running eslint ...)	@
	$(YARN) eslint . --cache && echo "eslint: no lint errors"

.PHONY: lint-checkstyle
lint-checkstyle: vendor ; $(info running eslint checkstyle ...)	@
	@mkdir -p ../test
	$(YARN) eslint -f checkstyle -o ./test/tests.eslint.xml . || true

# Tests

.PHONY: test
test: vendor ; $(info running jest tests ...) @
	REACT_APP_KOPANO_BUILD="${VERSION}" BABEL_ENV=test $(YARN) jest --verbose

.PHONY: test-coverage
test-coverage: vendor ; $(info running jest tests with coverage ...) @
	REACT_APP_KOPANO_BUILD="${VERSION}" BABEL_ENV=test $(YARN) jest --coverage --coverageDirectory=coverage

# Documentation

.PHONY: doc
doc: vendor ; $(info generating documentation ...) @
	REACT_APP_KOPANO_BUILD="${VERSION}" $(YARN) styleguide:build

# Yarn

.PHONY: vendor
vendor: .yarninstall

.yarninstall: package.json ; $(info getting depdencies with yarn ...)   @
	@$(YARN) install --silent
	@touch $@

# Dist

.PHONY: dist
dist: ; $(info building dist tarball ...)
	@mkdir -p "dist/"
	$(YARN) pack --filename="dist/${PACKAGE_NAME}-${VERSION}.tgz"

.PHONY: clean ; $(info cleaning ...)	@
clean:
	$(YARN) cache clean
	$(YARN) clean
	@rm -rf node_modules
	@rm -rf coverage
	@rm -f .yarninstall

.PHONY: version
version:
	@echo $(VERSION)
