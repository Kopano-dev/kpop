import { getHeadersFromConfig } from './utils';
import { KPOP_RECEIVE_CONFIG, KPOP_RESET_CONFIG } from './constants';

const basePrefix = '';

export function receiveConfig(config) {
  return {
    type: KPOP_RECEIVE_CONFIG,
    config,
  };
}

export function resetConfig() {
  return {
    type: KPOP_RESET_CONFIG,
  };
}

export function fetchConfig(id='config') {
  return (dispatch) => {
    return fetch(
      `${basePrefix}/api/${id}/v0/config`, {
        method: 'GET',
        headers: getHeadersFromConfig(),
      }
    ).then(res => {
      return res.json();
    }).then(config => {
      dispatch(receiveConfig(config));
      return Promise.resolve(config);
    }).catch(error => {
      // TODO(longsleep): Implement proper error handling via dispatch.
      throw error;
    });
  };
}
