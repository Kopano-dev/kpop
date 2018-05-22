/*
This file is based on Office UI Fabric React

Copyright (c) Kopano b.v.
Copyright (c) Microsoft Corporation

All rights reserved.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the ""Software""), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Regular expression matching characters to ignore when calculating the initials.
 * The first part matches characters within parenthesis, including the parenthesis.
 * The second part matches special ASCII characters except space, plus some unicode special characters.
 */
const UNWANTED_CHARS_REGEX: RegExp = /\([^)]*\)|[\0-\u001F\!-/:-@\[-`\{-\u00BF\u0250-\u036F\uD800-\uFFFF]/g; // eslint-disable-line

/**
 * Regular expression matching phone numbers. Applied after chars matching UNWANTED_CHARS_REGEX have been removed
 * and number has been trimmed for whitespaces
 */
const PHONENUMBER_REGEX: RegExp = /^\d+[\d\s]*(:?ext|x|)\s*\d+$/i;

/** Regular expression matching one or more spaces. */
const MULTIPLE_WHITESPACES_REGEX: RegExp = /\s+/g;

/**
 * Regular expression matching languages for which we currently don't support initials.
 * Arabic:   Arabic, Arabic Supplement, Arabic Extended-A.
 * Korean:   Hangul Jamo, Hangul Compatibility Jamo, Hangul Jamo Extended-A, Hangul Syllables, Hangul Jamo Extended-B.
 * Japanese: Hiragana, Katakana.
 * CJK:      CJK Unified Ideographs Extension A, CJK Unified Ideographs, CJK Compatibility Ideographs, CJK Unified Ideographs Extension B
 */
/* tslint:disable:max-line-length */
const UNSUPPORTED_TEXT_REGEX: RegExp = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD869][\uDC00-\uDED6]/;
/* tslint:enable:max-line-length */

export function cleanupDisplayName(displayName) {
  displayName = displayName.replace(UNWANTED_CHARS_REGEX, '');
  displayName = displayName.replace(MULTIPLE_WHITESPACES_REGEX, ' ');
  displayName = displayName.trim();

  return displayName;
}

function getInitialsLatin(displayName, isRtl=false) {
  let initials = '';

  const splits = displayName.split(' ');

  if (splits.length === 2) {
    initials += splits[0].charAt(0).toUpperCase();
    initials += splits[1].charAt(0).toUpperCase();
  } else if (splits.length === 3) {
    initials += splits[0].charAt(0).toUpperCase();
    initials += splits[2].charAt(0).toUpperCase();
  } else if (splits.length !== 0) {
    initials += splits[0].charAt(0).toUpperCase();
  }

  if (isRtl && initials.length > 1) {
    return initials.charAt(1) + initials.charAt(0);
  }

  return initials;
}

/**
 * Get (up to 2 characters) initials based on display name.
 */
export function getInitials(displayName, isRtl=false, allowPhoneInitials=false) {
  if (!displayName) {
    return '';
  }

  displayName = cleanupDisplayName(displayName);

  // For names containing CJK characters, and phone numbers, we don't display initials
  if (
    UNSUPPORTED_TEXT_REGEX.test(displayName) ||
    (!allowPhoneInitials && PHONENUMBER_REGEX.test(displayName))
  ) {
    return '';
  }

  return getInitialsLatin(displayName, isRtl);
}
