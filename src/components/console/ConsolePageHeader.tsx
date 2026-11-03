'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useConsoleChrome } from './ConsoleChrome';

interface ConsolePageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: string;
}

/**
 * One header per page: eyebrow, title, optional meta, actions. The bar
 * grows instead of clipping so long invitation titles and multi-button
 * action groups never overlap the content on narrow screens.
 */
export function ConsolePageHeader({ title, description, actions, eyebrow }: ConsolePageHeaderProps) {
  const { openRail } = useConsoleChrome();

  return (
    <header className="topbar">
      <button
        type="button"
        className="btn btn-icon btn-sm btn-ghost sidebar-mobile-toggle"
        onClick={openRail}
        aria-label="Buka menu navigasi"
      >
        <Menu size={18} />
      </button>

      <div className="topbar-title">
        {eyebrow ? (
          <span className="label" style={{ fontSize: 'var(--text-2xs)' }}>
            {eyebrow}
          </span>
        ) : null}

        <div className="topbar-heading">
          <h1
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 620,
              letterSpacing: '-0.012em',
              lineHeight: 1.35,
            }}
          >
            {title}
          </h1>
        </div>

        {description ? <div className="topbar-desc">{description}</div> : null}
      </div>

      {actions ? <div className="topbar-actions">{actions}</div> : null}
    </header>
  );
}
