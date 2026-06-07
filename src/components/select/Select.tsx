import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  useFloating,
  offset,
  flip,
  size as floatingSize,
  autoUpdate,
} from '@floating-ui/react';
import type { Size, FormStatus } from '../../types';
import { useFieldContext } from '../../contexts';
import { useFormContext } from '../../contexts/FormContext';
import {
  getTriggerStyle,
  getTriggerTextStyle,
  getChevronStyle,
  clearButtonStyle,
  getPanelStyle,
  getSearchInputStyle,
  getOptionStyle,
  getGroupHeaderStyle,
  getEmptyStyle,
  getLoadingStyle,
} from './Select.styles';

/* ─── Public types ──────────────────────────────────────────────── */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  /** Nombre del campo. Se hereda desde FieldContext si no se pasa. */
  name?: string;
  /** Lista estática de opciones. */
  options?: SelectOption[];
  /** Valor controlado. */
  value?: string | null;
  /** Valor inicial no controlado. @default null */
  defaultValue?: string | null;
  /** Texto cuando no hay opción seleccionada. @default "Seleccionar..." */
  placeholder?: string;
  /** Tamaño visual del control. Heredable desde FieldContext. @default "md" */
  size?: Size;
  /**
   * Estado visual del campo. En V1 se pasa directamente; en V2 será
   * provisto por FieldContext. @default "idle"
   */
  status?: FormStatus;
  /**
   * Si es `true`, el select ocupa el 100 % del contenedor padre.
   * Si es `false`, el select se adapta a su contenido con un ancho mínimo
   * razonable. @default true
   */
  fullWidth?: boolean;
  /**
   * Ancho personalizado (cualquier valor CSS válido). Sobreescribe
   * el comportamiento de `fullWidth` cuando se proporciona.
   * @example "20rem" | "50%" | "300px"
   */
  width?: string | number;
  /** Habilita búsqueda local sobre las opciones. @default false */
  searchable?: boolean;
  /** Muestra botón para limpiar la selección. @default false */
  clearable?: boolean;
  /** Deshabilita el control. Se hereda desde FieldContext. @default false */
  disabled?: boolean;
  /** Estado de carga. Muestra spinner y aria-busy. @default false */
  loading?: boolean;
  /** Mensaje cuando no hay opciones o sin resultados. @default "Sin resultados" */
  emptyText?: string;
  /** Callback al cambiar la selección. */
  onChange?: (value: string | null) => void;
  /** Callback al abrir o cerrar el panel. */
  onOpenChange?: (open: boolean) => void;
  /** Callback de blur en el trigger. */
  onBlur?: (event: React.FocusEvent) => void;
  /** Callback de foco en el trigger. */
  onFocus?: (event: React.FocusEvent) => void;
  /** Override de estilos en el trigger. */
  style?: React.CSSProperties;
  /** id forwarded al trigger nativo. */
  id?: string;
  /** ARIA pass-through for FieldContext integration. */
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  'aria-required'?: React.AriaAttributes['aria-required'];
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/* ─── Component ─────────────────────────────────────────────────── */

/**
 * Select — control de selección única con opciones estáticas.
 *
 * No gestiona label, error ni estado visual; delega todo eso a Field.
 * Soporta ref forwarding al trigger nativo para que Form pueda enfocar
 * programáticamente el primer campo inválido tras un submit fallido.
 */
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options = [],
      value,
      defaultValue = null,
      placeholder = 'Seleccionar...',
      size: sizeProp,
      status: statusProp,
      fullWidth = true,
      width,
      searchable = false,
      clearable = false,
      disabled: disabledProp = false,
      loading = false,
      emptyText = 'Sin resultados',
      onChange,
      onOpenChange,
      onBlur,
      onFocus,
      style,
      id: idProp,
      name: nameProp,
      'aria-invalid': ariaInvalidProp,
      'aria-required': ariaRequiredProp,
      'aria-describedby': ariaDescribedByProp,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    },
    ref,
  ) => {
    // ── FieldContext integration ────────────────────────────────────
    // Direct props win over context, except `disabled` which always
    // OR-merges (ancestor wins).
    const fieldCtx = useFieldContext();
    const formCtx = useFormContext();

    const size: Size = sizeProp ?? fieldCtx?.size ?? 'md';
    const status: FormStatus = statusProp ?? fieldCtx?.status ?? 'idle';
    // Ancestor disabled always wins — no child can re-enable
    const disabled = (fieldCtx?.disabled ?? false) || disabledProp;
    const name = nameProp ?? fieldCtx?.name;
    const id = idProp ?? fieldCtx?.inputId;
    const ariaDescribedBy = ariaDescribedByProp ?? fieldCtx?.describedById;
    const ariaInvalid =
      ariaInvalidProp ??
      (status === 'error'
        ? ('true' as React.AriaAttributes['aria-invalid'])
        : undefined);
    const ariaRequired =
      ariaRequiredProp ??
      (fieldCtx?.required
        ? ('true' as React.AriaAttributes['aria-required'])
        : undefined);
    // ── Unique IDs ──────────────────────────────────────────────
    const uid = useId();
    const listboxId = `select-listbox-${uid}`;

    // ── State ───────────────────────────────────────────────────
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [searchQuery, setSearchQuery] = useState('');

    // Controlled vs. uncontrolled
    const isControlled = value !== undefined;
    // Inside a Form, the form context owns the value from mount (mirrors
    // InputText): derive `isFormControlled` from the presence of a Form +
    // name so the value source stays consistent across the lifetime instead
    // of flipping from internal state to form state after the first change.
    const isFormControlled = !isControlled && formCtx != null && name != null;
    const formValue = isFormControlled
      ? (formCtx!.values[name!] as string | null | undefined)
      : undefined;
    const [internalValue, setInternalValue] = useState<string | null>(
      defaultValue,
    );
    const currentValue = isControlled
      ? value
      : isFormControlled
        ? (formValue ?? null)
        : internalValue;

    // ── Refs ────────────────────────────────────────────────────
    const triggerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Merge forwarded ref with internal ref
    const setTriggerRef = useCallback(
      (node: HTMLDivElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    // ── Floating UI positioning ─────────────────────────────────
    const { refs, floatingStyles } = useFloating({
      open: isOpen,
      placement: 'bottom-start',
      middleware: [
        offset(4),
        flip({ padding: 8 }),
        floatingSize({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              minWidth: `${rects.reference.width}px`,
            });
          },
        }),
      ],
      whileElementsMounted: autoUpdate,
    });

    // Connect floating-ui refs with our refs
    const setFloatingReference = useCallback(
      (node: HTMLDivElement | null) => {
        setTriggerRef(node);
        refs.setReference(node);
      },
      [setTriggerRef, refs],
    );

    const setFloatingPanel = useCallback(
      (node: HTMLDivElement | null) => {
        (panelRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        refs.setFloating(node);
      },
      [refs],
    );

    // ── Filtered options ────────────────────────────────────────
    const filteredOptions =
      searchable && searchQuery
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : options;

    // ── Grouped options ─────────────────────────────────────────
    // Returns a flat list of { type, ... } entries for rendering
    type RenderItem =
      | { type: 'group-header'; group: string }
      | { type: 'option'; option: SelectOption; flatIndex: number };

    const buildRenderItems = (): RenderItem[] => {
      const items: RenderItem[] = [];
      const ungrouped: SelectOption[] = [];
      const groups: Map<string, SelectOption[]> = new Map();

      for (const opt of filteredOptions) {
        if (opt.group) {
          if (!groups.has(opt.group)) groups.set(opt.group, []);
          groups.get(opt.group)!.push(opt);
        } else {
          ungrouped.push(opt);
        }
      }

      let flatIndex = 0;

      for (const opt of ungrouped) {
        items.push({ type: 'option', option: opt, flatIndex });
        flatIndex++;
      }

      for (const [group, opts] of groups) {
        items.push({ type: 'group-header', group });
        for (const opt of opts) {
          items.push({ type: 'option', option: opt, flatIndex });
          flatIndex++;
        }
      }

      return items;
    };

    const renderItems = buildRenderItems();

    // Flat list of options only (for keyboard navigation indexing)
    const flatOptions = renderItems.filter(
      (item): item is RenderItem & { type: 'option' } => item.type === 'option',
    );

    // ── Open / Close helpers ────────────────────────────────────
    const openPanel = useCallback(() => {
      if (disabled) return;
      setIsOpen(true);
      setSearchQuery('');
      onOpenChange?.(true);

      // Pre-select current value's index (or first enabled option)
      const selectedIdx = flatOptions.findIndex(
        (item) => item.option.value === currentValue,
      );
      setActiveIndex(selectedIdx >= 0 ? selectedIdx : -1);
    }, [disabled, onOpenChange, flatOptions, currentValue]);

    const closePanel = useCallback(() => {
      setIsOpen(false);
      setSearchQuery('');
      setActiveIndex(-1);
      onOpenChange?.(false);
    }, [onOpenChange]);

    // ── Selection ───────────────────────────────────────────────
    const selectOption = useCallback(
      (opt: SelectOption) => {
        if (opt.disabled) return;
        if (!isControlled) {
          setInternalValue(opt.value);
        }
        if (formCtx && name) formCtx.setValue(name, opt.value);
        onChange?.(opt.value);
        closePanel();
        // Return focus to trigger without scrolling the page
        triggerRef.current?.focus({ preventScroll: true });
      },
      [isControlled, onChange, closePanel, formCtx, name],
    );

    // ── Clear ───────────────────────────────────────────────────
    const handleClear = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!isControlled) {
          setInternalValue(null);
        }
        if (formCtx && name) formCtx.setValue(name, null);
        onChange?.(null);
        triggerRef.current?.focus({ preventScroll: true });
      },
      [isControlled, onChange, formCtx, name],
    );

    // ── Click outside to close ──────────────────────────────────
    useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          triggerRef.current &&
          !triggerRef.current.contains(target) &&
          panelRef.current &&
          !panelRef.current.contains(target)
        ) {
          closePanel();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closePanel]);

    // Focus search input when panel opens without scrolling the page
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus({ preventScroll: true });
      }
    }, [isOpen, searchable]);

    // Scroll active option into view within the panel only (never scrolls the page)
    useEffect(() => {
      const option = optionRefs.current[activeIndex];
      const panel = panelRef.current;
      if (!isOpen || activeIndex < 0 || !option || !panel) return;
      const optionTop = option.offsetTop;
      const optionBottom = optionTop + option.offsetHeight;
      if (optionTop < panel.scrollTop) {
        panel.scrollTop = optionTop;
      } else if (optionBottom > panel.scrollTop + panel.clientHeight) {
        panel.scrollTop = optionBottom - panel.clientHeight;
      }
    }, [isOpen, activeIndex]);

    // ── Keyboard helpers ────────────────────────────────────────
    const findNextEnabledIndex = (from: number, direction: 1 | -1): number => {
      const len = flatOptions.length;
      if (len === 0) return -1;
      let idx = from + direction;
      while (idx >= 0 && idx < len) {
        if (!flatOptions[idx].option.disabled) return idx;
        idx += direction;
      }
      return from; // stay if nothing found
    };

    const findFirstEnabledIndex = (): number => {
      return flatOptions.findIndex((item) => !item.option.disabled);
    };

    const findLastEnabledIndex = (): number => {
      for (let i = flatOptions.length - 1; i >= 0; i--) {
        if (!flatOptions[i].option.disabled) return i;
      }
      return -1;
    };

    // ── Keyboard handler (trigger) ──────────────────────────────
    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (!isOpen) {
            openPanel();
          } else if (
            activeIndex >= 0 &&
            flatOptions[activeIndex] &&
            !flatOptions[activeIndex].option.disabled
          ) {
            selectOption(flatOptions[activeIndex].option);
          }
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          if (!isOpen) {
            openPanel();
          } else {
            const next = findNextEnabledIndex(activeIndex, 1);
            setActiveIndex(next);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (isOpen) {
            const prev = findNextEnabledIndex(activeIndex, -1);
            setActiveIndex(prev);
          }
          break;
        }
        case 'Home': {
          e.preventDefault();
          if (isOpen) {
            setActiveIndex(findFirstEnabledIndex());
          }
          break;
        }
        case 'End': {
          e.preventDefault();
          if (isOpen) {
            setActiveIndex(findLastEnabledIndex());
          }
          break;
        }
        case 'Escape': {
          if (isOpen) {
            e.preventDefault();
            closePanel();
            triggerRef.current?.focus({ preventScroll: true });
          }
          break;
        }
        case 'Tab': {
          if (isOpen) {
            closePanel();
            // Don't prevent default — let focus move naturally
          }
          break;
        }
        default:
          break;
      }
    };

    // ── Keyboard handler (search input) ─────────────────────────
    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = findNextEnabledIndex(activeIndex, 1);
          setActiveIndex(next);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = findNextEnabledIndex(activeIndex, -1);
          setActiveIndex(prev);
          break;
        }
        case 'Home': {
          e.preventDefault();
          setActiveIndex(findFirstEnabledIndex());
          break;
        }
        case 'End': {
          e.preventDefault();
          setActiveIndex(findLastEnabledIndex());
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (
            activeIndex >= 0 &&
            flatOptions[activeIndex] &&
            !flatOptions[activeIndex].option.disabled
          ) {
            selectOption(flatOptions[activeIndex].option);
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          closePanel();
          triggerRef.current?.focus({ preventScroll: true });
          break;
        }
        case 'Tab': {
          closePanel();
          break;
        }
        default:
          break;
      }
    };

    // ── Trigger handlers ────────────────────────────────────────
    const handleTriggerClick = () => {
      if (disabled) return;
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    };

    const handleTriggerFocus = (e: React.FocusEvent) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleTriggerBlur = (e: React.FocusEvent) => {
      // Don't blur if focus moved to the panel or its children
      const relatedTarget = e.relatedTarget as Node | null;
      if (
        panelRef.current &&
        relatedTarget &&
        panelRef.current.contains(relatedTarget)
      ) {
        return;
      }
      setIsFocused(false);
      if (formCtx && name) formCtx.setTouched(name);
      onBlur?.(e);
    };

    // ── Register ref with FormContext for focus-on-error ────────
    // Depend on the stable register/unregister callbacks (memoised in Form)
    // and `name` only — not the whole `formCtx`, which changes on every form
    // state update and would re-run this effect on each keystroke.
    const registerRef = formCtx?.registerRef;
    const unregisterRef = formCtx?.unregisterRef;
    useEffect(() => {
      if (registerRef && unregisterRef && name) {
        registerRef(name, triggerRef);
        return () => unregisterRef(name);
      }
    }, [registerRef, unregisterRef, name]);

    // ── Derived values ──────────────────────────────────────────
    const selectedOption = options.find((opt) => opt.value === currentValue);
    const showClearButton = clearable && currentValue != null && !disabled;

    // Active descendant ID for aria-activedescendant
    const getOptionId = (flatIdx: number) => `select-option-${uid}-${flatIdx}`;
    const activeDescendant =
      isOpen && activeIndex >= 0 ? getOptionId(activeIndex) : undefined;

    // ── Trigger style ───────────────────────────────────────────
    const triggerStyle: React.CSSProperties = {
      ...getTriggerStyle(
        size,
        status,
        disabled,
        isFocused,
        isOpen,
        fullWidth,
        width,
      ),
      ...style,
    };

    // ── Render ───────────────────────────────────────────────────
    return (
      <>
        {/* ── Trigger ──────────────────────────────────────────── */}
        <div
          ref={setFloatingReference}
          data-component="select"
          data-size={size}
          data-status={status}
          data-name={name}
          {...(fullWidth ? { 'data-fullwidth': 'true' } : {})}
          {...(disabled ? { 'data-disabled': 'true' } : {})}
          role="combobox"
          id={id}
          tabIndex={disabled ? -1 : 0}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={activeDescendant}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel || (!ariaLabelledBy ? placeholder : undefined)}
          aria-labelledby={ariaLabelledBy}
          aria-busy={loading ? 'true' : undefined}
          style={triggerStyle}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          onFocus={handleTriggerFocus}
          onBlur={handleTriggerBlur}
        >
          <span style={getTriggerTextStyle(!selectedOption)}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          {showClearButton && (
            <button
              type="button"
              aria-label="Limpiar"
              tabIndex={-1}
              style={clearButtonStyle}
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
            >
              ✕
            </button>
          )}

          <span aria-hidden="true" style={getChevronStyle(isOpen)}>
            ▾
          </span>
        </div>

        {/* ── Panel (dropdown) ─────────────────────────────────── */}
        {isOpen && (
          <div
            ref={setFloatingPanel}
            id={listboxId}
            role="listbox"
            aria-label={placeholder}
            style={{
              ...getPanelStyle(size, width),
              ...floatingStyles,
            }}
          >
            {/* Search input */}
            {searchable && (
              <input
                ref={searchInputRef}
                type="text"
                role="searchbox"
                aria-label="Buscar opciones"
                aria-controls={listboxId}
                aria-activedescendant={activeDescendant}
                placeholder="Buscar…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleSearchKeyDown}
                style={getSearchInputStyle(size)}
              />
            )}

            {/* Loading state */}
            {loading && (
              <div role="status" style={getLoadingStyle(size)}>
                Cargando…
              </div>
            )}

            {/* Empty state */}
            {!loading && flatOptions.length === 0 && (
              <div role="status" style={getEmptyStyle(size)}>
                {emptyText}
              </div>
            )}

            {/* Options */}
            {!loading &&
              renderItems.map((item) => {
                if (item.type === 'group-header') {
                  return (
                    <div
                      key={`group-${item.group}`}
                      role="presentation"
                      style={getGroupHeaderStyle(size)}
                    >
                      {item.group}
                    </div>
                  );
                }

                const { option, flatIndex } = item;
                const isActive = flatIndex === activeIndex;
                const isSelected = option.value === currentValue;
                const optionId = getOptionId(flatIndex);

                return (
                  <div
                    key={option.value}
                    ref={(el) => {
                      optionRefs.current[flatIndex] = el;
                    }}
                    id={optionId}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    style={getOptionStyle(
                      size,
                      isActive,
                      isSelected,
                      !!option.disabled,
                    )}
                    onClick={() => {
                      if (!option.disabled) selectOption(option);
                    }}
                    onMouseEnter={() => {
                      if (!option.disabled) setActiveIndex(flatIndex);
                    }}
                  >
                    {option.label}
                  </div>
                );
              })}
          </div>
        )}
      </>
    );
  },
);

Select.displayName = 'Select';
