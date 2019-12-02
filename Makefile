PACKAGE_NAME = kpop

# Tools

YARN ?= yarn

# Variables

VERSION ?= $(shell git describe --tags --always --dirty --match=v* 2>/dev/null | sed 's/^v//' || \
			cat $(CURDIR)/.version 2> /dev/null || echo 0.0.0-unreleased)

# Build

.PHONY: all
all: build i18n

.PHONY: build
build:  vendor | src ; $(info building ...)	@
	@rm -rf ./es/
	REACT_APP_KOPANO_BUILD="${VERSION}" BABEL_ENV=production $(YARN) run build
	echo $(VERSION) > .version

.PHONY: i18n
i18n: vendor | src
	@$(MAKE) -C i18n

.PHONY: src
src:
	@$(MAKE) -C src

.PHONY: lint
lint: vendor ; $(info running eslint ...)	@
	@$(YARN) eslint . --cache && echo "eslint: no lint errors"

.PHONY: lint-checkstyle
lint-checkstyle: vendor ; $(info running eslint checkstyle ...)	@
	@mkdir -p ./test
	@$(YARN) eslint -f checkstyle -o ./test/tests.eslint.xml . || true

# Tests

.PHONY: test
test: vendor | src ; $(info running jest tests ...) @
	REACT_APP_KOPANO_BUILD="${VERSION}" BABEL_ENV=test $(YARN) jest --verbose

.PHONY: test-coverage
test-coverage: vendor | src ; $(info running jest tests with coverage ...) @
	@mkdir -p ./test
	REACT_APP_KOPANO_BUILD="${VERSION}" BABEL_ENV=test JEST_JUNIT_OUTPUT=./test/jest-test-results.xml $(YARN) jest --coverage --coverageDirectory=coverage --testResultsProcessor="jest-junit"

.PHONY: test-xml
test-xml: vendor | src ; $(info running jest tests ...) @
	@mkdir -p ./test
	REACT_APP_KOPANO_BUILD="${VERSION}" BABEL_ENV=test JEST_JUNIT_OUTPUT=./test/jest-test-results.xml $(YARN) jest --verbose --testResultsProcessor="jest-junit"

# Documentation

.PHONY: doc
doc: vendor | src ; $(info generating documentation ...) @
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
	@$(MAKE) -C src clean
	@$(MAKE) -C i18n clean
	$(YARN) cache clean
	@rm -rf node_modules
	@rm -rf coverage
	@rm -f .yarninstall

.PHONY: version
version:
	@echo $(VERSION)
