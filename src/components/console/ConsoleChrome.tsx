'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/** Console chrome state shared between the rail and whatever page renders the header. */
interface ConsoleChromeValue {
  railOpen: boolean;
  openRail(): void;
  closeRail(): void;
  toggleRail(): void;
  createOpen: boolean;
  openCreate(): void;
  closeCreate(): void;
}

const ConsoleChromeContext = createContext<ConsoleChromeValue | undefined>(undefined);

export function ConsoleChromeProvider({ children }: { children: React.ReactNode }) {
  const [railOpen, setRailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const openRail = useCallback(() => setRailOpen(true), []);
  const closeRail = useCallback(() => setRailOpen(false), []);
  const toggleRail = useCallback(() => setRailOpen((v) => !v), []);
  const openCreate = useCallback(() => {
    setRailOpen(false);
    setCreateOpen(true);
  }, []);
  const closeCreate = useCallback(() => setCreateOpen(false), []);

  // Esc closes the drawer; body scroll is locked while it is open on mobile.
  useEffect(() => {
    if (!railOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRail();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [railOpen, closeRail]);

  const value = useMemo(
    () => ({ railOpen, openRail, closeRail, toggleRail, createOpen, openCreate, closeCreate }),
    [railOpen, openRail, closeRail, toggleRail, createOpen, openCreate, closeCreate]
  );

  return <ConsoleChromeContext.Provider value={value}>{children}</ConsoleChromeContext.Provider>;
}

export function useConsoleChrome(): ConsoleChromeValue {
  const ctx = useContext(ConsoleChromeContext);
  if (!ctx) throw new Error('useConsoleChrome must be used inside <ConsoleChromeProvider>');
  return ctx;
}
