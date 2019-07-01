import {
  UnexpectedNetworkResponseError,
} from './errors';

test('unexpectedNetworkResponseError', () => {
  expect(() => {
    try {
      const err = new UnexpectedNetworkResponseError('test error', 418);
      throw err;
    } catch(e) {
      if (e.status === 418) {
        throw e;
      } else {
        throw new Error('failed');
      }
    }
  }).toThrowError(UnexpectedNetworkResponseError);
});
