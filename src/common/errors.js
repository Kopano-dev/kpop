export class UnexpectedNetworkResponseError extends Error {
  handled = false;

  constructor(...args) {
    super(...args);
    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, UnexpectedNetworkResponseError);
    }
  }
}
