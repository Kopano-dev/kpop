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
build:  vendor | src/version.js src ; $(info building ...)	@
	@rm -rf build

	REACT_APP_KOPANO_BUILD="${VERSION}" $(YARN) run build
	echo $(VERSION) > .version

.PHONY: src/version.js
src/version.js: src/version.js.in
	@sed "s/0.0.0-no-proper-build/$(VERSION)/g" $< >$@

# Tests

.PHONY: test
test: vendor ; $(info running jest tests ...) @
	$(YARN) jest

.PHONY: test-coverage
test-coverage: vendor ; $(info running jest tests with coverage ...) @
	$(YARN) jest --coverage --coverageDirectory=coverage

# Documentation

.PHONY: doc
doc: vendor ; $(info generating documentation ...) @
	$(YARN) styleguide:build

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
