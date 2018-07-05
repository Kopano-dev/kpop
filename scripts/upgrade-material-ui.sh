#!/bin/sh
#
# Run this script like this to recursively upgrade all js files in src
#
#   find src -name '*.js' -exec ./scripts/upgrade-material-ui.sh {} \;
#
# from old beta material-ui to final imports.

exec sed -i \
	-e "s|'material-ui/|'@material-ui/core/|g" \
	-e "s|'material-ui-icons/|'@material-ui/icons/|g" \
	$1
