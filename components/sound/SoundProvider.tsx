"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { soundEngine } from "@/lib/sound";
import { triggerLightHaptic, triggerMediumHaptic } from "@/lib/haptics";

interface SoundContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
  playHover: () => void;
  playWarp: () => void;
  playSuccess: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  soundEnabled: false,
  toggleSound: () => {},
  playClick: () => {},
  playHover: () => {},
  playWarp: () => {},
  playSuccess: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  useEffect(() => {
    let enabled = false;
    try {
      enabled = localStorage.getItem("ryanarnab_sound_fx") === "true";
    } catch {
      enabled = false;
    }

    if (enabled) {
      soundEngine.setMuted(false);
      soundEngine.startDrone();
      // Use microtask to avoid react-hooks/set-state-in-effect warning
      queueMicrotask(() => {
        setSoundEnabled(true);
      });
    } else {
      soundEngine.setMuted(true);
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEngine.setMuted(!next);
      try {
        localStorage.setItem("ryanarnab_sound_fx", String(next));
      } catch {}

      if (next) {
        soundEngine.playClick();
        soundEngine.startDrone();
        triggerMediumHaptic();
      } else {
        soundEngine.stopDrone();
        triggerLightHaptic();
      }
      return next;
    });
  }, []);

  const playClick = useCallback(() => {
    if (soundEnabled) {
      soundEngine.playClick();
    }
    triggerLightHaptic();
  }, [soundEnabled]);

  const playHover = useCallback(() => {
    if (soundEnabled) {
      soundEngine.playHover();
    }
  }, [soundEnabled]);

  const playWarp = useCallback(() => {
    if (soundEnabled) {
      soundEngine.playWarp();
    }
    triggerMediumHaptic();
  }, [soundEnabled]);

  const playSuccess = useCallback(() => {
    if (soundEnabled) {
      soundEngine.playSuccess();
    }
    triggerLightHaptic();
  }, [soundEnabled]);

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playClick,
        playHover,
        playWarp,
        playSuccess,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
