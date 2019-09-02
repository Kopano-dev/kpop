# Tools

YARN ?= yarn
MSGMERGE ?= msgmerge
MSGFMT ?= msgfmt

# Variables

POS = $(wildcard *.po)

# Translations

.PHONY: build
build: json

.PHONY: extract
extract: pot

.PHONY: pot
pot: src/BaseContainer/BaseContainer.json
	cd .. && $(YARN) rip json2pot './i18n/src/**/*.json' \
		-o ./i18n/kpop.pot \
		-c 'id'

.PHONY: json
json: src/BaseContainer/BaseContainer.json
	cd .. && $(YARN) rip po2json './i18n/*.po' \
		-m './i18n/src/**/*.json' \
		-o './i18n/locales/' \
		-c 'id' \
		 --indentation=2

.PHONY: merge
merge: $(POS)

.PHONY: stats
stats:
	$(foreach po, $(POS), $(shell $(MSGFMT) -v --statistics $(po)))
	@- true

$(POS): FORCE kpop.pot
	$(MSGMERGE) -U \
		--backup=none \
		--no-wrap \
		$@ kpop.pot

FORCE:

clean:
	@rm -f *.mo
	@rm -rf src/
	@rm -f locales/*.json
