// Lightweight Mobile Haptic Feedback helper using navigator.vibrate

export function triggerSelectionHaptic() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(5);
    } catch {
      // Ignore
    }
  }
}

export function triggerLightHaptic() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(8);
    } catch {
      // Ignore
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

export function triggerSnapHaptic() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([22, 35, 22]);
    } catch {
      // Ignore
    }
  }
}

export function triggerImpactHaptic() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(35);
    } catch {
      // Ignore
    }
  }
}

export function triggerHeartbeatHaptic() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([12, 50, 18]);
    } catch {
      // Ignore
    }
  }
}
