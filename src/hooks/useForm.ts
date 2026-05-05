import { useCallback, useSyncExternalStore } from 'react';
import type { FormApi } from '../types/form';

/* ─── Global form registry ──────────────────────────────────────
 * Allows `useForm(id)` to access a `FormApi` instance from anywhere
 * in the component tree, without prop drilling or context nesting.
 *
 * `Form` registers/unregisters itself on mount/unmount.
 * `useSyncExternalStore` ensures reactive re-renders when form
 * state changes (React 18+ canonical pattern).
 * ────────────────────────────────────────────────────────────── */

type Listener = () => void;

const registry = new Map<string, FormApi>();
const listeners = new Set<Listener>();

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** @internal — called by `Form` on mount / state change. */
export function registerForm(id: string, api: FormApi): void {
  registry.set(id, api);
  emitChange();
}

/** @internal — called by `Form` on unmount. */
export function unregisterForm(id: string): void {
  registry.delete(id);
  emitChange();
}

/* ─── Public hook ───────────────────────────────────────────────
 * Returns the `FormApi` for the `Form` with the given `id`, or
 * `null` if no such form is mounted.
 *
 * Usage:
 *   const formApi = useForm('create-user');
 *   formApi?.submit();
 * ────────────────────────────────────────────────────────────── */

function subscribe(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useForm(id: string): FormApi | null {
  const getSnapshot = useCallback(() => registry.get(id) ?? null, [id]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
