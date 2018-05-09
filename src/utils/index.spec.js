import { generateColorRGB, firstLetters, isLatin } from './index'


const firstname = 'John'
const lastname = 'Doe'

test('firstLetters', () => {
  expect(firstLetters(firstname, lastname)).toEqual('JD');
});

test('generateColorRGB', () => {
  expect(generateColorRGB(firstname, lastname)).toMatch(new RegExp('rgb\\(\\d{2,3}, \\d{2,3}, \\d{2,3}\\)'));
});

test('generateColorRGB is reproducible', () => {
  const rgb = generateColorRGB(firstname, lastname);
  expect(generateColorRGB(firstname, lastname)).toEqual(rgb);
});

test('generateColorRGB is different for a different name', () => {
  const rgb1 = generateColorRGB(firstname + lastname);
  const rgb2 = generateColorRGB(firstname + lastname + 'e');
  expect(rgb1).not.toEqual(rgb2);
});

test('isLatin', () => {
  expect(isLatin(firstname)).toEqual(true);
  expect(isLatin('警察')).toEqual(false);
});
