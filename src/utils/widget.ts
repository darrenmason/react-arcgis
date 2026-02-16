import { useState, useEffect, useRef } from 'react';
import type { ViewType } from '../types';

interface UseWidgetResult<T> {
  widget: T | null;
  loading: boolean;
}

/**
 * Generic widget initialization hook
 */
export const useWidget = <T>(
  view: ViewType | null,
  widgetImport: () => Promise<any>,
  widgetConfig: Record<string, any>,
  position?: string,
  expandConfig?: { expandIconClass: string }
): UseWidgetResult<T> => {
  const [widget, setWidget] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!view) return;

    mountedRef.current = true;
    setLoading(true);

    const initialize = async () => {
      try {
        const modules = await widgetImport();

        if (!mountedRef.current || !view) return;

        const widgetInstance = new modules[0].default(widgetConfig);

        if (expandConfig) {
          const Expand = modules[1];
          const expand = new Expand.default({
            view: view as any,
            content: widgetInstance,
            ...expandConfig
          });
          view.ui.add(expand, position);
        } else if (position) {
          view.ui.add(widgetInstance, position);
        }

        setWidget(widgetInstance);
      } catch (error) {
        console.error('Error initializing widget:', error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mountedRef.current = false;
      if (widget) {
        if (position) {
          view.ui.remove(widget as any);
        }
        (widget as any).destroy?.();
      }
    };
  }, [view]);

  return { widget, loading };
};
