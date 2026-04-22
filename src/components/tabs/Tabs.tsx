import React, { useCallback, useId, useMemo, useRef, useState } from 'react';
import {
  getContainerStyle,
  getFocusRingStyle,
  getIndicatorStyle,
  getPanelStyle,
  getTabStyle,
  getTablistStyle,
  type Orientation,
  type TabVisualState,
} from './Tabs.styles';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  orientation?: Orientation;
  activation?: 'automatic' | 'manual';
  disabled?: boolean;
}

function findFirstEnabledId(tabs: TabItem[]): string | undefined {
  return tabs.find((t) => !t.disabled)?.id;
}

function resolveInitialValue(
  tabs: TabItem[],
  defaultValue: string | undefined,
): string | undefined {
  if (defaultValue && tabs.some((t) => t.id === defaultValue && !t.disabled)) {
    return defaultValue;
  }
  return findFirstEnabledId(tabs);
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  defaultValue,
  onChange,
  orientation = 'horizontal',
  activation = 'automatic',
  disabled = false,
  style,
  className,
  ...rest
}) => {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState<string | undefined>(() =>
    resolveInitialValue(tabs, defaultValue),
  );

  const isControlled = value !== undefined;
  const rawActiveId = isControlled ? value : internalValue;
  const activeId =
    rawActiveId !== undefined &&
    tabs.some((t) => t.id === rawActiveId && !t.disabled)
      ? rawActiveId
      : findFirstEnabledId(tabs);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const tabRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const registerRef = useCallback(
    (id: string) => (node: HTMLButtonElement | null) => {
      if (node) tabRefs.current.set(id, node);
      else tabRefs.current.delete(id);
    },
    [],
  );

  const activate = useCallback(
    (id: string) => {
      if (!isControlled) setInternalValue(id);
      if (id !== activeId) onChange?.(id);
    },
    [activeId, isControlled, onChange],
  );

  const focusTab = useCallback((id: string) => {
    tabRefs.current.get(id)?.focus();
  }, []);

  const enabledTabs = useMemo(() => tabs.filter((t) => !t.disabled), [tabs]);

  const moveFocus = useCallback(
    (direction: 1 | -1, fromId: string) => {
      if (enabledTabs.length === 0) return;
      const currentIndex = enabledTabs.findIndex((t) => t.id === fromId);
      const baseIndex = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex =
        (baseIndex + direction + enabledTabs.length) % enabledTabs.length;
      const nextId = enabledTabs[nextIndex].id;
      focusTab(nextId);
      if (activation === 'automatic') activate(nextId);
    },
    [enabledTabs, focusTab, activation, activate],
  );

  const focusEdge = useCallback(
    (edge: 'first' | 'last') => {
      if (enabledTabs.length === 0) return;
      const target =
        edge === 'first'
          ? enabledTabs[0].id
          : enabledTabs[enabledTabs.length - 1].id;
      focusTab(target);
      if (activation === 'automatic') activate(target);
    },
    [enabledTabs, focusTab, activation, activate],
  );

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    tabId: string,
  ) => {
    if (disabled) return;

    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    if (e.key === nextKey) {
      e.preventDefault();
      moveFocus(1, tabId);
    } else if (e.key === prevKey) {
      e.preventDefault();
      moveFocus(-1, tabId);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusEdge('first');
    } else if (e.key === 'End') {
      e.preventDefault();
      focusEdge('last');
    } else if (
      (e.key === 'Enter' || e.key === ' ') &&
      activation === 'manual'
    ) {
      e.preventDefault();
      activate(tabId);
    }
  };

  const resolveState = (tab: TabItem): TabVisualState => {
    if (tab.disabled) return 'disabled';
    if (tab.id === activeId) return 'active';
    if (tab.id === hoveredId) return 'hover';
    return 'idle';
  };

  return (
    <div
      {...rest}
      data-component="tabs"
      data-orientation={orientation}
      {...(disabled ? { 'data-disabled': 'true' } : {})}
      style={{ ...getContainerStyle(orientation, disabled), ...style }}
      className={className}
    >
      <div
        role="tablist"
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        style={getTablistStyle(orientation)}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          const isDisabledTab = disabled || !!tab.disabled;
          const visualState = resolveState(tab);
          const showFocusRing = focusedId === tab.id && !isDisabledTab;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={registerRef(tab.id)}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              aria-disabled={isDisabledTab || undefined}
              data-state={visualState}
              tabIndex={isActive && !isDisabledTab ? 0 : -1}
              disabled={isDisabledTab}
              onClick={() => {
                if (isDisabledTab) return;
                activate(tab.id);
              }}
              onMouseEnter={() => {
                if (!isDisabledTab) setHoveredId(tab.id);
              }}
              onMouseLeave={() => {
                setHoveredId((current) =>
                  current === tab.id ? null : current,
                );
              }}
              onFocus={() => setFocusedId(tab.id)}
              onBlur={() =>
                setFocusedId((current) => (current === tab.id ? null : current))
              }
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              style={{
                ...getTabStyle(visualState, orientation),
                ...(showFocusRing ? getFocusRingStyle() : {}),
              }}
            >
              {tab.label}
              {isActive && !isDisabledTab && (
                <span
                  aria-hidden="true"
                  data-testid={`tabs-indicator-${tab.id}`}
                  style={getIndicatorStyle(orientation)}
                />
              )}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const tabId = `${baseId}-tab-${tab.id}`;
        const panelId = `${baseId}-panel-${tab.id}`;
        const isActive = tab.id === activeId;
        return (
          <div
            key={tab.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            style={isActive ? getPanelStyle() : { display: 'none' }}
          >
            {isActive ? tab.content : null}
          </div>
        );
      })}
    </div>
  );
};
