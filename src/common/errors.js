export class UnexpectedNetworkResponseError extends Error {
  handled = false;

  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, UnexpectedNetworkResponseError);
  }
}
