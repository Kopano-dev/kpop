# Tools

YARN ?= yarn
MSGMERGE ?= msgmerge

# Translations

.PHONY: build
build: json

.PHONY: extract
extract: pot

.PHONY: pot
pot:
	$(YARN) rip json2pot './i18n/src/**/*.json' \
		-o ./i18n/kpop.pot \
		-c 'id'

.PHONY: json
json:
	$(YARN) rip po2json './i18n/*.po' \
		-m './i18n/src/**/*.json' \
		-o './i18n/locales/' \
		-c 'id' \
		 --indentation=2


.PHONY: merge
merge: kpop.pot
	$(MSGMERGE) -U \
		--backup=none \
		--no-wrap \
		*.po kpop.pot
