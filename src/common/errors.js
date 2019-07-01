export class UnexpectedNetworkResponseError extends Error {
  handled = false;

  constructor(message, status, ...args) {
    super(...args);
    this.status = status;
    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(this, UnexpectedNetworkResponseError);
    }
  }
}
