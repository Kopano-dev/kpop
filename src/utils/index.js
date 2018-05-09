import crc from 'crc32';
import rgb from 'hsv-rgb';


export function qualifyURL(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.href;
}

export function showErrorInLoader(msg='Unknown error', err=null) {
  let loader = document.getElementById('loader');
  if (!loader) {
    loader = document.createElement("div");
    loader.id = 'loader';
    document.body.appendChild(loader);
  } else {
    loader.innerHTML='';
  }
  loader.appendChild(document.createTextNode(msg));
  if (err) {
    loader.appendChild(document.createTextNode(' '+err));
  }
}

export function parseParams(s) {
  if (!s) {
    return {};
  }
  let pieces = s.split('&');
  let data = {};
  let parts;
  for (let i = 0; i < pieces.length; i++) {
    parts = pieces[i].split('=');
    if (parts.length < 2) {
      parts.push('');
    }
    data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return data;
}

export function encodeParams(data) {
  let ret = [];
  for (let d in data) {
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
}

export function isLatin(str) {
  return (/^[\u00-\u052F]*$/).test(str);
}

/**
 * Generates a random RGB CSS string from a user's displayname. This is
 * achieved by creating a crc32 hash of the display name, creating a hex value
 * from the first two letters and making sure the value is within the 0-360
 * hue range. The saturation and lightness are both fixed values.
 */
export function generateColorRGB(displayName) {
  const colors = crc(displayName);

  let color = parseInt(`0x${colors[0]}${colors[1]}`, 16);
  color = (color - 16) * 360 / (255 - 16);

  const rgbcolors = rgb(color, 50, 95);
  return `rgb(${rgbcolors[0]}, ${rgbcolors[1]}, ${rgbcolors[2]})`;
}

export function firstLetters(givenName, surname) {
  return givenName[0].toUpperCase() + surname[0].toUpperCase();
}

export function splitDisplayName(displayName) {
  const words =  displayName.split(' ');
  if (words.length == 1) {
    return [words[0], words[0]];
  }

  return [words[0], words[words.length-1]];
}
