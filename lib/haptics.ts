// Lightweight Mobile Haptic Feedback helper using navigator.vibrate

export function triggerLightHaptic() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(8);
    } catch {
      // Ignore vibration errors if blocked by browser policy
    }
  }
}

export function triggerMediumHaptic() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(18);
    } catch {
      // Ignore
    }
  }
}

export function triggerSuccessHaptic() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([10, 30, 15]);
    } catch {
      // Ignore
    }
  }
}
