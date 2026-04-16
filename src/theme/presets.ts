import { colors } from './tokens/colors';
import type { Color } from '../types';

/* ─── Status → Color mapping ───────────────────────────────────
 * Semantic statuses resolve to the palette colors used across
 * status-aware components (alerts, toasts, inline validations…).
 * ────────────────────────────────────────────────────────────── */
export type Status = 'success' | 'info' | 'warning' | 'error';

export const statusToColor: Record<Status, Color> = {
  success: 'pine',
  info: 'ink',
  warning: 'ochre',
  error: 'brick',
};

/* ─── Color Preset ─────────────────────────────────────────────
 * Each preset maps a palette entry to semantic style slots.
 * Components derive their states from these slots so that
 * adding a new palette color requires only one entry here.
 * ────────────────────────────────────────────────────────────── */
export interface ColorPreset {
  main: string; // primary surface / accent
  light: string; // lighter shade (hover)
  emphasis: string; // focus / highlight outline
  contrast: string; // text on filled surface
  muted: string; // disabled text / border
  mutedBg: string; // disabled background
}

export const colorPresets: Record<Color, ColorPreset> = {
  ink: {
    main: colors.neutral[500],
    light: colors.neutral[400],
    emphasis: colors.neutral[500],
    contrast: colors.white,
    muted: colors.white,
    mutedBg: colors.neutral[200],
  },
  sea: {
    main: colors.blue[500],
    light: colors.blue[400],
    emphasis: colors.blue[500],
    contrast: colors.white,
    muted: colors.white,
    mutedBg: colors.blue[100],
  },
  brick: {
    main: colors.red[500],
    light: colors.red[400],
    emphasis: colors.red[500],
    contrast: colors.white,
    muted: colors.white,
    mutedBg: colors.red[200],
  },
  ochre: {
    main: colors.orange[700],
    light: colors.orange[600],
    emphasis: colors.orange[700],
    contrast: colors.white,
    muted: colors.white,
    mutedBg: colors.orange[100],
  },
  pine: {
    main: colors.green[500],
    light: colors.green[400],
    emphasis: colors.green[500],
    contrast: colors.white,
    muted: colors.white,
    mutedBg: colors.green[100],
  },
  grape: {
    main: colors.purple[500],
    light: colors.purple[400],
    emphasis: colors.purple[500],
    contrast: colors.white,
    muted: colors.white,
    mutedBg: colors.purple[100],
  },
};
