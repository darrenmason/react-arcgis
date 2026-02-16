import type EsriSearch from '@arcgis/core/widgets/Search';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface SearchProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  sources?: __esri.SearchSource[];
  includeDefaultSources?: boolean;
  searchAllEnabled?: boolean;
  suggestionsEnabled?: boolean;
  locationEnabled?: boolean;
  popupEnabled?: boolean;
  resultGraphicEnabled?: boolean;
  onSearchComplete?: (event: any) => void;
  onSearchClear?: () => void;
  onLoad?: (widget: EsriSearch) => void;
}

/**
 * Search widget component - Search and geocoding
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <Search
 *     position="top-left"
 *     includeDefaultSources={true}
 *     onSearchComplete={(event) => console.log('Found:', event.results)}
 *   />
 * </MapView>
 * ```
 */
export function Search({
  view: propView,
  position = 'top-right',
  sources,
  includeDefaultSources = true,
  searchAllEnabled = true,
  suggestionsEnabled = true,
  locationEnabled = true,
  popupEnabled = true,
  resultGraphicEnabled = true,
  onSearchComplete,
  onSearchClear,
  onLoad
}: SearchProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module } = useEsriModule<EsriSearch>(
    () => import('@arcgis/core/widgets/Search'),
    'Search'
  );

  const { widget } = useWidget({
    Module,
    view,
    config: {
      sources,
      includeDefaultSources,
      searchAllEnabled,
      suggestionsEnabled,
      locationEnabled,
      popupEnabled,
      resultGraphicEnabled
    },
    position,
    onLoad
  });

  // Event handlers
  React.useEffect(() => {
    if (!widget) return;

    const handles: __esri.Handle[] = [];

    if (onSearchComplete) {
      handles.push((widget as any).on('search-complete', onSearchComplete));
    }

    if (onSearchClear) {
      handles.push((widget as any).on('search-clear', onSearchClear));
    }

    return () => {
      handles.forEach(h => h.remove());
    };
  }, [widget, onSearchComplete, onSearchClear]);

  return null;
}

// Import React for useEffect
import React from 'react';

export default Search;
