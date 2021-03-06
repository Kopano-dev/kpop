// Default locale to English Great Britain, so that weeks start on
// Monday as that is what most Kopano customers would expect.
export const defaultLocale = 'en-GB';

// Well Kopano is a Dutch company.
export const defaultTimezone = 'Europe/Amsterdam';

// Redux actions.
export const KPOP_SET_ERROR = 'KPOP_SET_ERROR';
export const KPOP_GLUE_GLUED = 'KPOP_GLUE_GLUED';
export const KPOP_SNACKBAR_ENQUEUE = 'KPOP_SNACKBAR_ENQUEUE';
export const KPOP_SNACKBAR_REMOVE = 'KPOP_SNACKBAR_REMOVE';
export const KPOP_SNACKBAR_CLOSE = 'KPOP_SNACKBAR_CLOSE';

// Error ids.
export const KPOP_ERRORID_USER_REQUIRED = 'kpop_user_required_error';
export const KPOP_ERRORID_NETWORK_ERROR = 'kpop_network_error';
export const KPOP_ERRORID_APP_INITIALIZATION_ERROR = 'kpop_app_initialization_error';
