import { useState, useEffect } from 'react';
import type BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import type { ViewType } from '../types';

export interface UseBasemapGalleryOptions {
  view: ViewType | null;
  position?: string;
  source?: __esri.PortalBasemapsSource | __esri.LocalBasemapsSource;
}

export const useBasemapGallery = ({
  view,
  position = 'top-right',
  source
}: UseBasemapGalleryOptions) => {
  const [gallery, setGallery] = useState<BasemapGallery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!view) return;

    let mounted = true;

    const initializeGallery = async () => {
      try {
        setLoading(true);
        const [BasemapGallery, Expand] = await Promise.all([
          import('@arcgis/core/widgets/BasemapGallery'),
          import('@arcgis/core/widgets/Expand')
        ]);

        if (!mounted || !view) return;

        const basemapGallery = new BasemapGallery.default({
          view: view as any,
          source: source as any
        });

        const expand = new Expand.default({
          view: view as any,
          content: basemapGallery,
          expandIcon: 'basemap'
        });

        view.ui.add(expand, position);
        setGallery(basemapGallery);
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
      if (gallery) {
        gallery.destroy();
      }
    };
  }, [view]);

  return { gallery, loading };
};

export default useBasemapGallery;
