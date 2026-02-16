import { useState, useEffect } from 'react';
import type Search from '@arcgis/core/widgets/Search';
import type { ViewType } from '../types';

export interface UseSearchOptions {
  view: ViewType | null;
  position?: string;
  sources?: __esri.SearchSource[];
  includeDefaultSources?: boolean;
  searchAllEnabled?: boolean;
  suggestionEnabled?: boolean;
}

export const useSearch = ({
  view,
  position = 'top-right',
  sources,
  includeDefaultSources = true,
  searchAllEnabled = true,
  suggestionEnabled = true
}: UseSearchOptions) => {
  const [search, setSearch] = useState<Search | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!view) return;

    let mounted = true;

    const initializeSearch = async () => {
      try {
        setLoading(true);
        const [Search] = await Promise.all([
          import('@arcgis/core/widgets/Search')
        ]);

        if (!mounted || !view) return;

        const searchWidget = new Search.default({
          view: view as any,
          sources: sources as any,
          includeDefaultSources,
          searchAllEnabled,
          suggestionsEnabled: suggestionEnabled
        });

        view.ui.add(searchWidget, position);
        setSearch(searchWidget);
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
      if (search) {
        view.ui.remove(search);
        search.destroy();
      }
    };
  }, [view]);

  return { search, loading };
};

export default useSearch;
