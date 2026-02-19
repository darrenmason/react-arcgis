import { useState, useEffect } from 'react';
import type BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import type { ViewType } from '../types';

export interface UseBasemapGalleryOptions extends Omit<__esri.BasemapGalleryProperties, 'view'> {
  view: ViewType | null;
  position?: string | __esri.UIAddPosition;
  /** When true, wrap the gallery in an Expand widget (default). When false, add the gallery directly to the view UI. */
  useExpand?: boolean;
  onLoad?: (widget: BasemapGallery) => void;
}

export const useBasemapGallery = (options: UseBasemapGalleryOptions) => {
  const { view, position = 'top-right', useExpand = true, onLoad, ...config } = options;
  const [gallery, setGallery] = useState<BasemapGallery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!view) return;

    let mounted = true;
    let galleryInstance: BasemapGallery | null = null;
    let expandInstance: __esri.Expand | null = null;

    const initializeGallery = async () => {
      try {
        setLoading(true);
        const [BasemapGalleryModule, ExpandModule] = await Promise.all([
          import('@arcgis/core/widgets/BasemapGallery'),
          import('@arcgis/core/widgets/Expand')
        ]);

        if (!mounted || !view) return;

        galleryInstance = new BasemapGalleryModule.default({
          view: view as __esri.MapView | __esri.SceneView,
          ...config
        });

        if (useExpand) {
          expandInstance = new ExpandModule.default({
            view: view as __esri.MapView | __esri.SceneView,
            content: galleryInstance,
            expandIcon: 'basemap'
          });
          view.ui.add(expandInstance, position);
        } else {
          view.ui.add(galleryInstance as unknown as __esri.Widget, position);
        }

        setGallery(galleryInstance);
        onLoad?.(galleryInstance);
      } catch (error) {
        console.error('Error initializing basemap gallery:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeGallery();

    return () => {
      mounted = false;
      if (expandInstance && view?.ui) {
        view.ui.remove(expandInstance);
        expandInstance.destroy();
      } else if (galleryInstance && view?.ui) {
        view.ui.remove(galleryInstance as unknown as __esri.Widget);
      }
      if (galleryInstance) {
        galleryInstance.destroy();
      }
    };
  }, [view, position, useExpand]);

  return { gallery, loading };
};

export default useBasemapGallery;
