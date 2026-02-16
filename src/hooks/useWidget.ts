import { useState, useEffect, useRef } from 'react';
import type { ViewType } from '../types';

interface UseWidgetOptions<T> {
  Module: (new (...args: any[]) => T) | null;
  view: ViewType | null;
  config: any;
  position?: string | __esri.UIAddPosition;
  onLoad?: (widget: T) => void;
}

/**
 * Generic hook for creating and managing ArcGIS widgets
 * @internal Used by specific widget hooks
 */
export function useWidget<T extends { destroy: () => void; container?: HTMLElement | string }>(
  options: UseWidgetOptions<T>
) {
  const { Module, view, config, position = 'top-right', onLoad } = options;
  const [widget, setWidget] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const widgetRef = useRef<T | null>(null);

  useEffect(() => {
    if (!view || !Module) return;

    let mounted = true;

    const initializeWidget = async () => {
      try {
        setLoading(true);

        const widgetInstance = new Module({
          view: view as any,
          ...config
        });

        if (!mounted) {
          widgetInstance.destroy();
          return;
        }

        widgetRef.current = widgetInstance;
        setWidget(widgetInstance);

        // Add to view UI if not manually positioned
        if (position && view.ui) {
          view.ui.add(widgetInstance, position);
        }

        onLoad?.(widgetInstance);
      } catch (error) {
        console.error('Error initializing widget:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeWidget();

    return () => {
      mounted = false;
      if (widgetRef.current) {
        if (view.ui) {
          view.ui.remove(widgetRef.current);
        }
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, [view, Module, position]);

  return { widget, loading };
}

export default useWidget;
