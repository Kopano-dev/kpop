import { withSnackbar as withNotistackSnackbar } from 'notistack';

export function withSnackbar(Component) {
  return withNotistackSnackbar(Component);
}
