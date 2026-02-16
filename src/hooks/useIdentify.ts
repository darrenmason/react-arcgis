import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface IdentifyOptions {
  geometry: __esri.Geometry;
  mapExtent: __esri.Extent;
  width: number;
  height: number;
  tolerance?: number;
  layerIds?: number[];
  layerOption?: 'all' | 'visible' | 'top';
  returnGeometry?: boolean;
}

/**
 * Hook for identifying features on a MapImageLayer at a location
 * 
 * @example
 * ```tsx
 * function IdentifyTool() {
 *   const { identify, loading, results } = useIdentify(mapImageLayer);
 *   
 *   const handleMapClick = async (event) => {
 *     const response = await identify({
 *       geometry: event.mapPoint,
 *       mapExtent: view.extent,
 *       width: view.width,
 *       height: view.height,
 *       tolerance: 3,
 *       layerOption: 'visible',
 *       returnGeometry: true
 *     });
 *     
 *     response.forEach(result => {
 *       console.log('Layer:', result.layerName);
 *       console.log('Features:', result.feature);
 *     });
 *   };
 *   
 *   return <div>Click map to identify</div>;
 * }
 * ```
 */
export function useIdentify(layer?: __esri.MapImageLayer) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<any[] | null>(null);

  const { Module: IdentifyParametersModule } = useEsriModule(
    () => import('@arcgis/core/rest/support/IdentifyParameters'),
    'IdentifyParameters'
  );

  const { Module: identifyModule } = useEsriModule(
    () => import('@arcgis/core/rest/identify'),
    'identify'
  );

  const identify = useCallback(async (options: IdentifyOptions) => {
    if (!layer) {
      throw new Error('MapImageLayer is required for identify');
    }

    if (!IdentifyParametersModule || !identifyModule) {
      throw new Error('Identify modules not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const params = new IdentifyParametersModule({
        geometry: options.geometry,
        mapExtent: options.mapExtent,
        width: options.width,
        height: options.height,
        tolerance: options.tolerance || 3,
        layerOption: options.layerOption || 'visible',
        returnGeometry: options.returnGeometry !== false
      });

      if (options.layerIds) {
        params.layerIds = options.layerIds;
      }

      const response = await (identifyModule as any).identify(layer.url, params);
      setResults(response.results);
      return response.results;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [layer, IdentifyParametersModule, identifyModule]);

  return {
    identify,
    loading,
    error,
    results
  };
}

export default useIdentify;
