'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useConsoleChrome } from './ConsoleChrome';

interface ConsolePageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Breadcrumb back link, e.g. "Semua undangan". */
  back?: { label: string; href: string };
  eyebrow?: string;
}

/**
 * One header per page. The previous build printed the page title in the sticky
 * bar *and* again as an h1 in the content, so the same string appeared up to
 * three times. Title lives here, once; depth comes from description only.
 */
export function ConsolePageHeader({ title, description, actions, back, eyebrow }: ConsolePageHeaderProps) {
  const { openRail } = useConsoleChrome();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
        <button
          type="button"
          className="btn btn-icon btn-sm btn-ghost sidebar-mobile-toggle"
          onClick={openRail}
          aria-label="Buka menu navigasi"
        >
          <Menu size={18} />
        </button>

        <div style={{ minWidth: 0 }}>
          {back && (
            <a
              href={back.href}
              style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-500)', textDecoration: 'none' }}
            >
              ← {back.label}
            </a>
          )}
          {eyebrow && (
            <div className="label" style={{ fontSize: 'var(--text-2xs)' }}>
              {eyebrow}
            </div>
          )}
          <h1
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 620,
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </h1>
          {description && (
            <div
              style={{
                fontSize: 'var(--text-2xs)',
                color: 'var(--ink-500)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </header>
  );
}
