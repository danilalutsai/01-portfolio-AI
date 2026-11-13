import { onScopeDispose, ref } from 'vue';

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Types a string into `typed` one character at a time, like a terminal.
// With reduced motion the whole string appears at once.
export function useTypewriter(msPerChar = 35) {
  const typed = ref('');
  const typing = ref(false);
  let timer: number | undefined;

  // Cancels the current run. Its promise never resolves, so code waiting
  // on a cancelled command doesn't carry on with stale state.
  function stop() {
    window.clearTimeout(timer);
    typing.value = false;
  }

  function type(text: string): Promise<void> {
    stop();

    if (prefersReducedMotion()) {
      typed.value = text;
      return Promise.resolve();
    }

    typed.value = '';
    typing.value = true;

    return new Promise((resolve) => {
      let count = 0;
      const step = () => {
        count += 1;
        typed.value = text.slice(0, count);
        if (count < text.length) {
          timer = window.setTimeout(step, msPerChar);
          return;
        }
        typing.value = false;
        resolve();
      };
      timer = window.setTimeout(step, msPerChar);
    });
  }

  onScopeDispose(stop);

  return { typed, typing, type, stop };
}
