import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  useFloating,
  offset,
  flip,
  size as floatingSize,
  autoUpdate,
} from '@floating-ui/react';
import type { Size, FormStatus } from '../../types';
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
   * provisto por FieldContext (§2.6). @default "idle"
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
 * No gestiona label, error ni estado visual; delega todo eso a Field (§6).
 * Soporta ref forwarding al trigger nativo para que Form pueda enfocar
 * programáticamente el primer campo inválido tras un submit fallido (§2.7).
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      name,
      options = [],
      value,
      defaultValue = null,
      placeholder = 'Seleccionar...',
      size = 'md',
      status = 'idle',
      fullWidth = true,
      width,
      searchable = false,
      clearable = false,
      disabled = false,
      loading = false,
      emptyText = 'Sin resultados',
      onChange,
      onOpenChange,
      onBlur,
      onFocus,
      style,
      id,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    },
    ref,
  ) => {
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
    const [internalValue, setInternalValue] = useState<string | null>(
      defaultValue,
    );
    const currentValue = isControlled ? value : internalValue;

    // ── Refs ────────────────────────────────────────────────────
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Merge forwarded ref with internal ref
    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        (
          triggerRef as React.MutableRefObject<HTMLButtonElement | null>
        ).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node;
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
      (node: HTMLButtonElement | null) => {
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
        onChange?.(opt.value);
        closePanel();
        // Return focus to trigger
        triggerRef.current?.focus();
      },
      [isControlled, onChange, closePanel],
    );

    // ── Clear ───────────────────────────────────────────────────
    const handleClear = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!isControlled) {
          setInternalValue(null);
        }
        onChange?.(null);
        triggerRef.current?.focus();
      },
      [isControlled, onChange],
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

    // Focus search input when panel opens
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Scroll active option into view
    useEffect(() => {
      if (isOpen && activeIndex >= 0 && optionRefs.current[activeIndex]) {
        optionRefs.current[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
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
            triggerRef.current?.focus();
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
          triggerRef.current?.focus();
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
      onBlur?.(e);
    };

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
        <button
          ref={setFloatingReference}
          data-component="select"
          data-size={size}
          data-status={status}
          {...(fullWidth ? { 'data-fullwidth': 'true' } : {})}
          {...(disabled ? { 'data-disabled': 'true' } : {})}
          type="button"
          role="combobox"
          id={id}
          name={name}
          disabled={disabled}
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
        </button>

        {/* ── Panel (dropdown) ─────────────────────────────────── */}
        {isOpen && (
          <div
            ref={setFloatingPanel}
            id={listboxId}
            role="listbox"
            aria-label={placeholder}
            style={{
              ...getPanelStyle(size, fullWidth, width),
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
