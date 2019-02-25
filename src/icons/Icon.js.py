#!/usr/bin/python

# Helper to create React components from raw SVG files. This is a bit
# complicated since JSX is not XML while SVG is and only the inner SVG part is
# to be fed into createSvgIcon.
#
# Since we need dangerouslySetInnerHTML to set arbitary SVG, we add a dummy
# container <g> element which should not have any visual effect.
#
# This script takes a name and a SVG file, opens the file and returns a full
# Javscript component on stdout with the SVG file content inlined.

from __future__ import print_function

import sys

# NOTE(longsleep): create SVG with xlink:href until browser support for href
# without namespace is there. Currently (2018-10-16), Sarari 12.0 still cannot
# do href and requires xlink namespace for the image to show. Meh!
TEMPLATE = """\
import React from 'react';
import createSvgIcon from '../utils/createSvgIcon';

/* eslint-disable max-len */
import %(name)s from '%(fn)s';

export default createSvgIcon(
  <image
    x="0" y="0" width="24" height="24"
    xlinkHref={%(name)s}
  />
);
"""


if __name__ == "__main__":
    args = sys.argv[1:]

    if len(args) != 2:
        print("Usage: %s: name svg-file" % sys.argv[0])
        sys.exit(1)

    print(TEMPLATE % {
      "name": sys.argv[1],
      "fn": sys.argv[2]
    })
