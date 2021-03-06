// Default set of scopes to be used when none are configured in settings.
export const KPOP_OIDC_DEFAULT_SCOPE = 'openid profile email kopano/gc';
// Access tokens are automatically renewed when valid for less than this value.
export const KPOP_OIDC_TOKEN_EXPIRATION_NOTIFICATION_TIME = 120;

// Redux actions.
export const KPOP_RECEIVE_USER = 'KPOP_RECEIVE_USER';

// Error resolution ids.
export const KPOP_RESET_USER = 'KPOP_RESET_USER';
export const KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN = 'KPOP_RESET_USER_AND_REDIRECT_TO_SIGNIN';
export const KPOP_RESTART_SIGNIN_SILENT = 'KPOP_RESTART_SIGNIN_SILENT';
