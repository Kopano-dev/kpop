import crc from 'crc32';
import rgb from 'hsv-rgb';

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
