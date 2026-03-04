import { WebHaptics, type HapticInput, type TriggerOptions } from "web-haptics";

let instance: WebHaptics | null = null;

function getHaptics(): WebHaptics {
  if (!instance) {
    instance = new WebHaptics();
  }
  return instance;
}

export function useHaptics() {
  const trigger = (input?: HapticInput, options?: TriggerOptions) => {
    getHaptics().trigger(input, options);
  };

  return { trigger };
}
