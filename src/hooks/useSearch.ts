import { useState, useEffect, useRef } from 'react';
import type Search from '@arcgis/core/widgets/Search';
import type { ViewType } from '../types';

export interface UseSearchOptions extends Omit<__esri.widgetsSearchProperties, 'view'> {
  view: ViewType | null;
  position?: string | __esri.UIAddPosition;
  onLoad?: (widget: Search) => void;
}

export const useSearch = (options: UseSearchOptions) => {
  const { view, position = 'top-right', onLoad, ...config } = options;
  const [search, setSearch] = useState<Search | null>(null);
  const [loading, setLoading] = useState(true);
  const widgetRef = useRef<Search | null>(null);

  useEffect(() => {
    if (!view) return;

    let mounted = true;

    const initializeSearch = async () => {
      try {
        setLoading(true);
        const [SearchModule] = await Promise.all([
          import('@arcgis/core/widgets/Search')
        ]);

        if (!mounted || !view) return;

        const searchInstance = new SearchModule.default({
          view: view as __esri.MapView | __esri.SceneView,
          ...config
        });

        if (!mounted) {
          searchInstance.destroy();
          return;
        }

        widgetRef.current = searchInstance;
        view.ui.add(searchInstance as unknown as __esri.Widget, position);
        setSearch(searchInstance);
        onLoad?.(searchInstance);
      } catch (error) {
        console.error('Error initializing search widget:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeSearch();

    return () => {
      mounted = false;
      const current = widgetRef.current;
      widgetRef.current = null;
      if (current && view?.ui) {
        view.ui.remove(current as unknown as __esri.Widget);
        current.destroy();
      }
    };
  }, [view, position]);

  return { search, loading };
};

export default useSearch;
