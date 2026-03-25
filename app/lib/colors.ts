// app/lib/colors.ts

/**
 * Quiet Mirror Design System Colors
 * 
 * Use these for programmatic color access (e.g., charts, dynamic elements)
 * For Tailwind classes, use the CSS variables directly or the qm-* utilities
 */

export const colors = {
  // Backgrounds
  bg: {
    primary: 'var(--qm-bg)',
    elevated: 'var(--qm-bg-elevated)',
    soft: 'var(--qm-bg-soft)',
    card: 'var(--qm-bg-card)',
  },
  // Text
  text: {
    primary: 'var(--qm-text-primary)',
    secondary: 'var(--qm-text-secondary)',
    muted: 'var(--qm-text-muted)',
    faint: 'var(--qm-text-faint)',
  },
  // Accent colors
  accent: {
    primary: 'var(--qm-accent)',
    hover: 'var(--qm-accent-hover)',
    soft: 'var(--qm-accent-soft)',
    border: 'var(--qm-accent-border)',
  },
  secondary: {
    primary: 'var(--qm-accent-2)',
    soft: 'var(--qm-accent-2-soft)',
  },
  // Borders
  border: {
    subtle: 'var(--qm-border-subtle)',
    card: 'var(--qm-border-card)',
  },
  // Shadows
  shadow: {
    soft: 'var(--qm-shadow-soft)',
    card: 'var(--qm-shadow-card)',
    lift: 'var(--qm-shadow-card-lift)',
  },
};

// Tailwind-compatible class mapping for dynamic use
export const colorClasses = {
  bg: {
    primary: 'bg-qm-bg',
    elevated: 'bg-qm-elevated',
    soft: 'bg-qm-soft',
    card: 'bg-qm-card',
  },
  text: {
    primary: 'text-qm-primary',
    secondary: 'text-qm-secondary',
    muted: 'text-qm-muted',
    faint: 'text-qm-faint',
  },
  accent: {
    primary: 'text-qm-accent',
    bg: 'bg-qm-accent',
    bgSoft: 'bg-qm-accent-soft',
    border: 'border-qm-accent',
  },
  border: {
    subtle: 'border-qm-subtle',
    card: 'border-qm-card',
  },
} as const;
