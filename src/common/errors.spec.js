import {
  UnexpectedNetworkResponseError,
} from './errors';

test('unexpectedNetworkResponseError', () => {
  expect((() => {
    return new UnexpectedNetworkResponseError('test error', 418).status;
  })()).toEqual(418);
});
