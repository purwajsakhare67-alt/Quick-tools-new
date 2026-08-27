/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { 
  playSound, 
  isSoundEnabled as getInitialSoundEnabled, 
  setSoundEnabled as setPersistedSoundEnabled 
} from '../utils/audioFeedback';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  setSound: (enabled: boolean) => void;
  playClick: () => void;
  playToolSelect: () => void;
  playCalcChime: () => void;
  playSuccess: () => void;
  playToggle: () => void;
  playSliderTick: () => void;
  playReset: () => void;
  SoundToggleButton: React.FC<{ className?: string; showLabel?: boolean; id?: string }>;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundState] = useState<boolean>(() => getInitialSoundEnabled());

  const setSound = useCallback((enabled: boolean) => {
    setSoundState(enabled);
    setPersistedSoundEnabled(enabled);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundState((prev) => {
      const next = !prev;
      setPersistedSoundEnabled(next);
      return next;
    });
  }, []);

  const playClick = useCallback(() => playSound('click'), []);
  const playToolSelect = useCallback(() => playSound('toolSelect'), []);
  const playCalcChime = useCallback(() => playSound('calcChime'), []);
  const playSuccess = useCallback(() => playSound('success'), []);
  const playToggle = useCallback(() => playSound('toggle'), []);
  const playSliderTick = useCallback(() => playSound('sliderTick'), []);
  const playReset = useCallback(() => playSound('reset'), []);

  const SoundToggleButton: React.FC<{ className?: string; showLabel?: boolean; id?: string }> = ({
    className = '',
    showLabel = true,
    id = 'sound-toggle-btn'
  }) => {
    return (
      <button
        onClick={toggleSound}
        className={`relative p-2.5 sm:px-3 sm:py-2 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-xs backdrop-blur-md ${
          soundEnabled
            ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-cyan-300 border-purple-500/30 dark:border-purple-400/30 hover:bg-purple-500/20'
            : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 border-slate-300 dark:border-white/10 hover:bg-slate-200/60 dark:hover:bg-white/10'
        } ${className}`}
        aria-label={soundEnabled ? 'Disable audio feedback' : 'Enable audio feedback'}
        title={`Audio Feedback: ${soundEnabled ? 'Enabled (Soft click & calculation chimes on)' : 'Muted'}. Click to toggle.`}
        id={id}
      >
        {soundEnabled ? (
          <>
            <Volume2 className="w-4 h-4 text-purple-600 dark:text-cyan-300 animate-pulse" />
            {showLabel && <span className="hidden sm:inline">Sound: On</span>}
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-400 dark:text-white/40" />
            {showLabel && <span className="hidden sm:inline">Sound: Off</span>}
          </>
        )}
      </button>
    );
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        setSound,
        playClick,
        playToolSelect,
        playCalcChime,
        playSuccess,
        playToggle,
        playSliderTick,
        playReset,
        SoundToggleButton
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
