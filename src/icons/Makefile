# Tools

PYTHON ?= python

# Variables

SRC=../../static/icons
ICONS = $(shell find $(SRC) -maxdepth 1 -name '*-icon.svg' -printf '%f\n')

# Build

all: $(ICONS)

.PHONY: images/index.js
images/index.js:
	mkdir -p images
	$(PYTHON) ./images.js.py ../$(SRC) $(ICONS) > $@

$(ICONS): TARGET=$(shell echo $@ | sed 's/[^-]*/\u&/g' | sed 's/[-]//g' | sed 's=.*/==' | awk -F"." '{print $$1}')
$(ICONS): images/index.js
	$(PYTHON) ./Icon.js.py $(TARGET)Image "./images" > $(TARGET).js

clean:
	rm -f *Icon.js
	rm -f images/index.js
	rmdir images || true
