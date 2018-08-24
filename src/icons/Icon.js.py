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
from xml.dom.minidom import parse

TEMPLATE = b"""
import React from 'react';
import createSvgIcon from '../utils/createSvgIcon';

/* eslint-disable max-len */
const svg = `%(svg)s`;

export default createSvgIcon(
  <g dangerouslySetInnerHTML={{__html: svg}}></g>
  , '%(name)s'
);
"""


if __name__ == "__main__":
    args = sys.argv[1:]

    if len(args) != 2:
        print("Usage: %s: name svg-file" % sys.argv[0])
        sys.exit(1)

    with open(sys.argv[2]) as fp:
        svg = parse(fp)

    innerSVG = []
    for node in svg.documentElement.childNodes:
        innerSVG.append(node.toxml('utf-8'))

    print(TEMPLATE % {
      "name": sys.argv[1],
      "svg": ''.join(innerSVG)}
    )
