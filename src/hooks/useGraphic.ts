import { useState, useEffect } from 'react';
import type Graphic from '@arcgis/core/Graphic';

/** Options for useGraphic – matches GraphicProperties so geometry/symbol accept type-discriminated objects */
export interface UseGraphicOptions
  extends Pick<__esri.GraphicProperties, 'geometry' | 'symbol' | 'attributes' | 'popupTemplate'> {}

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
          geometry: options.geometry,
          symbol: options.symbol,
          attributes: options.attributes,
          popupTemplate: options.popupTemplate
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
