# Tools

PYTHON ?= python

# Variables

SRC=../../static/icons
ICONS = $(shell find $(SRC) -maxdepth 1 -name '*-icon.svg' -printf '%f\n')

# Build

all: $(ICONS)

$(ICONS): TARGET=$(shell echo $@ | sed 's/[^-]*/\u&/g' | sed 's/[-]//g' | sed 's=.*/==' | awk -F"." '{print $$1}')
$(ICONS):
	$(PYTHON) ./Icon.js.py $(TARGET) "$(SRC)/$@" > $(TARGET).js

clean:
	rm -f *Icon.js
