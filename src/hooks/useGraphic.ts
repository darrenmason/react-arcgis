import { useState, useEffect } from 'react';
import type Graphic from '@arcgis/core/Graphic';

export interface UseGraphicOptions {
  geometry?: __esri.GeometryProperties;
  symbol?: __esri.SymbolProperties;
  attributes?: Record<string, any>;
  popupTemplate?: __esri.PopupTemplateProperties;
}

export const useGraphic = (options: UseGraphicOptions) => {
  const [graphic, setGraphic] = useState<Graphic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const createGraphic = async () => {
      try {
        setLoading(true);
        const [Graphic] = await Promise.all([
          import('@arcgis/core/Graphic')
        ]);

        if (!mounted) return;

        const newGraphic = new Graphic.default({
          geometry: options.geometry as any,
          symbol: options.symbol as any,
          attributes: options.attributes,
          popupTemplate: options.popupTemplate as any
        });

        setGraphic(newGraphic);
      } catch (error) {
        console.error('Error creating graphic:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    createGraphic();

    return () => {
      mounted = false;
    };
  }, [options.geometry, options.symbol, options.attributes, options.popupTemplate]);

  return { graphic, loading };
};

export default useGraphic;
