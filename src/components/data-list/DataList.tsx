import React, { useCallback, useId, useMemo, useRef, useState } from 'react';
import { useKeyframes } from '../../hooks';
import {
  getCheckboxStyle,
  getCheckmarkStyle,
  getContainerStyle,
  getDescriptionStyle,
  getEmptyStyle,
  getFocusRingStyle,
  getItemContentStyle,
  getItemStyle,
  getLabelStyle,
  getMetaStyle,
  getSkeletonBlockStyle,
  getSkeletonRowStyle,
  skeletonKeyframes,
  type DataListVariant,
} from './DataList.styles';

export interface DataItem {
  id: string;
  label: string;
  description?: string;
  meta?: React.ReactNode;
  disabled?: boolean;
}

export interface DataItemState {
  selected: boolean;
  focused: boolean;
  disabled: boolean;
}

export interface DataListProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  'onSelect' | 'onSelectionChange'
> {
  items: DataItem[];
  renderItem?: (item: DataItem, state: DataItemState) => React.ReactNode;
  selectable?: boolean;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  variant?: DataListVariant;
  disabled?: boolean;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

const SKELETON_ROW_COUNT = 4;

function toggleKey(keys: string[], id: string): string[] {
  if (keys.includes(id)) return keys.filter((k) => k !== id);
  return [...keys, id];
}

export const DataList: React.FC<DataListProps> = ({
  items,
  renderItem,
  selectable = false,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  variant = 'default',
  disabled = false,
  loading = false,
  emptyState,
  style,
  className,
  ...rest
}) => {
  useKeyframes(
    'fragui-data-list-skeleton-keyframes',
    skeletonKeyframes,
    loading,
  );

  const listboxId = useId();
  const isControlled = selectedKeys !== undefined;
  const [internalSelection, setInternalSelection] = useState<string[]>(
    () => defaultSelectedKeys ?? [],
  );
  const currentSelection = isControlled
    ? (selectedKeys as string[])
    : internalSelection;

  const enabledItems = useMemo(() => items.filter((i) => !i.disabled), [items]);

  const firstEnabledId = enabledItems[0]?.id;
  const [focusedId, setFocusedId] = useState<string | undefined>(
    firstEnabledId,
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [containerFocused, setContainerFocused] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);

  const isInert = disabled || loading;

  // When items change, keep focusedId valid.
  const focusedStillValid = useMemo(
    () =>
      focusedId !== undefined && enabledItems.some((i) => i.id === focusedId),
    [focusedId, enabledItems],
  );
  const activeDescendantId =
    selectable && !isInert && focusedStillValid && focusedId
      ? `${listboxId}-option-${focusedId}`
      : undefined;

  const applySelection = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalSelection(next);
      onSelectionChange?.(next);
    },
    [isControlled, onSelectionChange],
  );

  const toggleSelection = useCallback(
    (id: string) => {
      if (!selectable || isInert) return;
      const item = items.find((i) => i.id === id);
      if (!item || item.disabled) return;
      applySelection(toggleKey(currentSelection, id));
    },
    [applySelection, currentSelection, isInert, items, selectable],
  );

  const moveFocus = useCallback(
    (direction: 1 | -1) => {
      if (enabledItems.length === 0) return;
      const currentIdx = enabledItems.findIndex((i) => i.id === focusedId);
      const base = currentIdx === -1 ? 0 : currentIdx;
      const nextIdx =
        (base + direction + enabledItems.length) % enabledItems.length;
      setFocusedId(enabledItems[nextIdx].id);
    },
    [enabledItems, focusedId],
  );

  const focusEdge = useCallback(
    (edge: 'first' | 'last') => {
      if (enabledItems.length === 0) return;
      setFocusedId(
        edge === 'first'
          ? enabledItems[0].id
          : enabledItems[enabledItems.length - 1].id,
      );
    },
    [enabledItems],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!selectable || isInert) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocus(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusEdge('first');
    } else if (e.key === 'End') {
      e.preventDefault();
      focusEdge('last');
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (focusedId) {
        e.preventDefault();
        toggleSelection(focusedId);
      }
    }
  };

  // ─── Empty ────────────────────────────────────────────────────
  if (!loading && items.length === 0) {
    return (
      <div
        data-component="data-list"
        data-state="empty"
        style={{
          ...getContainerStyle(false),
          ...style,
        }}
        className={className}
      >
        <div style={getEmptyStyle()} data-testid="data-list-empty">
          {emptyState ?? 'No hay datos'}
        </div>
      </div>
    );
  }

  // ─── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        data-component="data-list"
        data-state="loading"
        data-variant={variant}
        aria-busy="true"
        style={{
          ...getContainerStyle(false),
          ...style,
        }}
        className={className}
      >
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
          <div
            key={idx}
            data-datalist-skeleton="true"
            data-testid="data-list-skeleton-row"
            style={getSkeletonRowStyle(variant, idx === SKELETON_ROW_COUNT - 1)}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={getSkeletonBlockStyle('45%', '0.875rem')} />
              {variant !== 'compact' && (
                <div style={getSkeletonBlockStyle('75%', '0.75rem', 0.8)} />
              )}
            </div>
            <div style={getSkeletonBlockStyle('3rem', '0.75rem', 0.8)} />
          </div>
        ))}
      </div>
    );
  }

  // ─── Data rows ────────────────────────────────────────────────

  const containerStyle = {
    ...getContainerStyle(disabled),
    ...(selectable && !isInert && containerFocused ? getFocusRingStyle() : {}),
    ...style,
  };

  return (
    <ul
      {...rest}
      ref={listRef}
      id={listboxId}
      data-component="data-list"
      data-variant={variant}
      {...(selectable ? { 'data-selectable': 'true' } : {})}
      {...(disabled ? { 'data-disabled': 'true' } : {})}
      style={containerStyle}
      className={className}
      {...(selectable
        ? {
            role: 'listbox',
            'aria-multiselectable': true as const,
            'aria-disabled': isInert || undefined,
            'aria-activedescendant': activeDescendantId,
            tabIndex: isInert ? -1 : 0,
            onKeyDown: handleKeyDown,
            onFocus: () => setContainerFocused(true),
            onBlur: () => setContainerFocused(false),
          }
        : {})}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const isItemDisabled = disabled || !!item.disabled;
        const isSelected = currentSelection.includes(item.id);
        const isHovered = hoveredId === item.id;
        const isFocused =
          selectable && focusedId === item.id && containerFocused;
        const optionId = `${listboxId}-option-${item.id}`;

        const state: DataItemState = {
          selected: isSelected,
          focused: isFocused,
          disabled: isItemDisabled,
        };

        const itemStyle = getItemStyle({
          variant,
          isLast,
          selectable,
          selected: isSelected,
          hovered: !isItemDisabled && isHovered,
          focused: isFocused && !isItemDisabled,
          disabled: isItemDisabled,
        });

        const content = renderItem ? (
          renderItem(item, state)
        ) : (
          <>
            <div style={getItemContentStyle()}>
              <span style={getLabelStyle(variant)}>{item.label}</span>
              {variant !== 'compact' && item.description && (
                <span style={getDescriptionStyle()}>{item.description}</span>
              )}
            </div>
            {item.meta !== undefined && item.meta !== null && (
              <span style={getMetaStyle()}>{item.meta}</span>
            )}
          </>
        );

        return (
          <li
            key={item.id}
            id={selectable ? optionId : undefined}
            {...(selectable
              ? {
                  role: 'option',
                  'aria-selected': isSelected,
                  'aria-disabled': isItemDisabled || undefined,
                }
              : {})}
            data-item-id={item.id}
            {...(isSelected ? { 'data-selected': 'true' } : {})}
            {...(isItemDisabled ? { 'data-disabled': 'true' } : {})}
            style={itemStyle}
            onMouseEnter={() => {
              if (!isItemDisabled) setHoveredId(item.id);
            }}
            onMouseLeave={() =>
              setHoveredId((current) => (current === item.id ? null : current))
            }
            onClick={() => {
              if (!selectable || isItemDisabled || isInert) return;
              setFocusedId(item.id);
              toggleSelection(item.id);
            }}
          >
            {selectable && (
              <span aria-hidden="true" style={getCheckboxStyle(isSelected)}>
                {isSelected && <span style={getCheckmarkStyle()}>✓</span>}
              </span>
            )}
            {content}
          </li>
        );
      })}
    </ul>
  );
};
