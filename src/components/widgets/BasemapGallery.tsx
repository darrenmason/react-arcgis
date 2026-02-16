import { useEffect } from 'react';
import type EsriBasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import type EsriExpand from '@arcgis/core/widgets/Expand';
import { useView } from '../../context/ViewContext';
import { useEsriModule } from '../../hooks/useEsriModule';

export interface BasemapGalleryProps {
  view?: __esri.MapView | __esri.SceneView;
  position?: string | __esri.UIAddPosition;
  source?: __esri.PortalBasemapsSource | __esri.LocalBasemapsSource;
  expanded?: boolean;
  expandIconClass?: string;
  onLoad?: (widget: EsriBasemapGallery) => void;
}

/**
 * BasemapGallery widget component - Basemap selector
 * 
 * @example
 * ```tsx
 * <MapView>
 *   <BasemapGallery position="top-right" expanded={false} />
 * </MapView>
 * ```
 */
export function BasemapGallery({
  view: propView,
  position = 'top-right',
  source,
  expanded = false,
  expandIconClass = 'esri-icon-basemap',
  onLoad
}: BasemapGalleryProps) {
  const contextView = useView();
  const view = propView || contextView.view;

  const { Module: BasemapGalleryModule } = useEsriModule<EsriBasemapGallery>(
    () => import('@arcgis/core/widgets/BasemapGallery'),
    'BasemapGallery'
  );

  const { Module: ExpandModule } = useEsriModule<EsriExpand>(
    () => import('@arcgis/core/widgets/Expand'),
    'Expand'
  );

  useEffect(() => {
    if (!view || !BasemapGalleryModule || !ExpandModule) return;

    let mounted = true;

    const initializeWidget = async () => {
      try {
        const basemapGallery = new BasemapGalleryModule({
          view: view as any,
          source: source as any
        });

        const expand = new ExpandModule({
          view: view as any,
          content: basemapGallery,
          expanded,
          expandIcon: 'basemap'
        });

        if (!mounted) {
          expand.destroy();
          return;
        }

        view.ui.add(expand, position);
        onLoad?.(basemapGallery);

        return () => {
          if (view.ui) {
            view.ui.remove(expand);
          }
          expand.destroy();
        };
      } catch (error) {
        console.error('Error initializing BasemapGallery:', error);
      }
    };

    const cleanup = initializeWidget();

    return () => {
      mounted = false;
      cleanup?.then(fn => fn?.());
    };
  }, [view, BasemapGalleryModule, ExpandModule, position]);

  return null;
}

export default BasemapGallery;
