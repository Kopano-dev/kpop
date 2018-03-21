# Tools

YARN ?= yarn

# Build

.PHONY: test
test: vendor ; $(info running jest tests ...) @
	$(YARN) test

.PHONY: test-coverage
test-coverage: vendor ; $(info running jest tests with coverage ...) @
	$(YARN) test --coverage --coverageDirectory=coverage

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

.PHONY: clean ; $(info cleaning ...)	@
clean:
	$(YARN) cache clean
	@rm -rf node_modules
	@rm -rf coverage
	@rm -f .yarninstall
