import { KPOP_A2HS_PROMPT_AVAILABLE, KPOP_A2HS_PROMPT_RESULT } from './constants';

// Stash
let stash = {};

export function a2HsPromptAvailable(deferredPrompt) {
  if (deferredPrompt) {
    stash.deferredPrompt = deferredPrompt;
  } else {
    delete stash.deferredPrompt;
  }

  return {
    type: KPOP_A2HS_PROMPT_AVAILABLE,
    available: !!stash.deferredPrompt,
  };
}

export function a2HsPromptResult(outcome) {
  const accepted = outcome === 'accepted';

  return {
    type: KPOP_A2HS_PROMPT_RESULT,
    accepted,
    outcome,
  };
}

export function triggerA2HsPrompt() {
  return async (dispatch) => {
    const { deferredPrompt } = stash;

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    return deferredPrompt.userChoice.then(async choiceResult => {
      delete stash.deferredPrompt;
      await dispatch(a2HsPromptResult(choiceResult.outcome));
      return choiceResult;
    });
  };
}
