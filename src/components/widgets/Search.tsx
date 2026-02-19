import React from 'react';
import type EsriSearch from '@arcgis/core/widgets/Search';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useWidget } from '../../hooks/useWidget';

export interface SearchProps extends Omit<__esri.widgetsSearchProperties, 'view'> {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  onSearchComplete?: (event: __esri.SearchSearchCompleteEvent) => void;
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
  onSearchComplete,
  onSearchClear,
  onLoad,
  ...config
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
    config: { ...config },
    position,
    onLoad
  });

  React.useEffect(() => {
    if (!widget) return;

    const handles: __esri.Handle[] = [];

    if (onSearchComplete) {
      handles.push(widget.on('search-complete', onSearchComplete));
    }

    if (onSearchClear) {
      handles.push(widget.on('search-clear', onSearchClear));
    }

    return () => {
      handles.forEach(h => h.remove());
    };
  }, [widget, onSearchComplete, onSearchClear]);

  return null;
}

export default Search;
