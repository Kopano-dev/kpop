#!/usr/bin/python

# Helper to create importable index of svg files.
#
# This script takes a list of SVG files and returns a javscript file on stdout.

from __future__ import print_function

import sys
import os


if __name__ == "__main__":
    args = sys.argv[1:]

    if len(args) < 2:
        print("Usage: %s: src-folder [svg-file]..." % sys.argv[0])
        sys.exit(1)

    src = args[0]
    result = []
    names = []
    for icon in args[1:]:
        name = "".join([x.title() for x in
                        os.path.splitext(icon)[0].split('-')])

        names.append(name)
        print("import %sImage from '%s';" % (name, os.path.join(src, icon)))

    print("\nexport {")
    for name in names:
        print("  %sImage," % name)
    print("};")
