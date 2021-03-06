import { a2HsPromptAvailable } from './actions';

export function registerBeforeinstallPrompt(store) {
  window.addEventListener('beforeinstallprompt', event => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt.
    event.preventDefault();

    // Trigger event.
    store.dispatch(a2HsPromptAvailable(event));
  });
}

export default registerBeforeinstallPrompt;
