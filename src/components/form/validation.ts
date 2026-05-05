import type { ValidationRule } from '../../types/form';

/* ─── Built-in pattern presets ──────────────────────────────────── */

const PATTERNS: Record<string, RegExp> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  tel: /^\+?[\d\s()-]{7,}$/,
};

/* ─── Default error messages ────────────────────────────────────── */

const DEFAULTS = {
  required: 'Este campo es obligatorio',
  minLength: (n: number) => `Mínimo ${n} caracteres`,
  maxLength: (n: number) => `Máximo ${n} caracteres`,
  min: (n: number) => `El valor mínimo es ${n}`,
  max: (n: number) => `El valor máximo es ${n}`,
  pattern: 'Formato inválido',
};

/* ─── Single field validation ───────────────────────────────────
 * Evaluates rules in order; the first failure stops the chain (§2.8).
 * Returns the error message or `null` if valid.
 * ────────────────────────────────────────────────────────────── */

export async function validateField(
  value: unknown,
  rules: ValidationRule[],
): Promise<string | null> {
  for (const rule of rules) {
    // ── required ────────────────────────────────────────────────
    if ('required' in rule && rule.required) {
      if (value == null || value === '') {
        return rule.message ?? DEFAULTS.required;
      }
    }

    // ── minLength ───────────────────────────────────────────────
    if ('minLength' in rule) {
      if (typeof value === 'string' && value.length < rule.minLength) {
        return rule.message ?? DEFAULTS.minLength(rule.minLength);
      }
    }

    // ── maxLength ───────────────────────────────────────────────
    if ('maxLength' in rule) {
      if (typeof value === 'string' && value.length > rule.maxLength) {
        return rule.message ?? DEFAULTS.maxLength(rule.maxLength);
      }
    }

    // ── min (numeric) ───────────────────────────────────────────
    if ('min' in rule) {
      const num = typeof value === 'string' ? Number(value) : value;
      if (typeof num === 'number' && !isNaN(num) && num < rule.min) {
        return rule.message ?? DEFAULTS.min(rule.min);
      }
    }

    // ── max (numeric) ───────────────────────────────────────────
    if ('max' in rule) {
      const num = typeof value === 'string' ? Number(value) : value;
      if (typeof num === 'number' && !isNaN(num) && num > rule.max) {
        return rule.message ?? DEFAULTS.max(rule.max);
      }
    }

    // ── pattern (preset string or RegExp) ───────────────────────
    if ('pattern' in rule) {
      const regex =
        typeof rule.pattern === 'string'
          ? PATTERNS[rule.pattern]
          : rule.pattern;
      if (
        regex &&
        typeof value === 'string' &&
        value !== '' &&
        !regex.test(value)
      ) {
        return rule.message ?? DEFAULTS.pattern;
      }
    }

    // ── validate (custom sync/async) ────────────────────────────
    if ('validate' in rule) {
      const result = await rule.validate(value);
      if (result) return result;
    }
  }

  return null;
}

/* ─── Batch validation ──────────────────────────────────────────
 * Validates all fields in parallel. Returns a map of field → error.
 * ────────────────────────────────────────────────────────────── */

export async function validateAllFields(
  values: Record<string, unknown>,
  validationRules: Record<string, ValidationRule[]>,
): Promise<Record<string, string | null>> {
  const errors: Record<string, string | null> = {};
  const entries = Object.entries(validationRules);

  await Promise.all(
    entries.map(async ([name, rules]) => {
      errors[name] = await validateField(values[name], rules);
    }),
  );

  return errors;
}
