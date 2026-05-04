import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { fontFamily } from '../../theme/tokens/typography';
import {
  fieldLabelSize,
  fieldHelperSize,
  fieldSpacing,
} from '../../theme/tokens/field';
import type { Size, FormStatus } from '../../types';

/* ─── Status → helper/error text color ─────────────────────────── */
const statusTextColor: Record<FormStatus, string> = {
  idle: colors.neutral[400],
  success: colors.green[500],
  warning: colors.orange[700],
  error: colors.red[500],
};

/* ─── Field wrapper ─────────────────────────────────────────────── */
export function getFieldWrapperStyle(): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  };
}

/* ─── Label ─────────────────────────────────────────────────────── */
export function getLabelStyle(size: Size, disabled: boolean): CSSProperties {
  const tokens = fieldLabelSize[size];
  const spacing = fieldSpacing[size];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginBottom: spacing.labelGap,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    fontFamily: fontFamily.satoshi,
    color: disabled ? colors.neutral[300] : colors.neutral[500],
    cursor: disabled ? 'not-allowed' : 'default',
    lineHeight: 'normal',
    userSelect: 'none',
    transition: 'color 0.15s ease',
  };
}

/* ─── Required indicator (*) ────────────────────────────────────── */
export const requiredIndicatorStyle: CSSProperties = {
  color: colors.red[500],
  fontWeight: 700,
  marginLeft: '0.125rem',
  lineHeight: 1,
};

/* ─── Helper / Error text ───────────────────────────────────────── */
export function getSubTextStyle(
  size: Size,
  status: FormStatus,
  isError: boolean,
): CSSProperties {
  const tokens = fieldHelperSize[size];
  const spacing = fieldSpacing[size];
  return {
    display: 'block',
    marginTop: spacing.helperGap,
    fontSize: tokens.fontSize,
    fontFamily: fontFamily.satoshi,
    color: isError ? statusTextColor.error : statusTextColor[status],
    lineHeight: 'normal',
    transition: 'color 0.15s ease',
  };
}
