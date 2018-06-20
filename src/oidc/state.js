let idx = 0;

export function getOIDCState() {
  return async (dispatch, getState) => {
    const { oidc } = getState();

    const s = {
      id: ++idx,
    };
    if (oidc && oidc.state) {
      Object.assign(s, oidc.state);
    }

    return s;
  };
}
