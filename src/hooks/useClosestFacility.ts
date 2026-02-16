import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface ClosestFacilityOptions {
  incidents: __esri.Graphic[];
  facilities: __esri.Graphic[];
  defaultTargetFacilityCount?: number;
  returnRoutes?: boolean;
  returnDirections?: boolean;
  directionsLengthUnits?: 'miles' | 'kilometers' | 'meters';
  travelDirection?: 'to-facility' | 'from-facility';
  impedanceAttribute?: string;
}

/**
 * Hook for closest facility analysis (find nearest facilities)
 * 
 * @example
 * ```tsx
 * function ClosestFacilityTool() {
 *   const { findClosestFacility, loading, error } = useClosestFacility(
 *     'https://route-api.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World'
 *   );
 *   
 *   const findNearest = async (incidentPoint, facilityPoints) => {
 *     const result = await findClosestFacility({
 *       incidents: [new Graphic({ geometry: incidentPoint })],
 *       facilities: facilityPoints.map(p => new Graphic({ geometry: p })),
 *       defaultTargetFacilityCount: 3, // Find 3 nearest
 *       returnRoutes: true,
 *       returnDirections: true,
 *       directionsLengthUnits: 'miles'
 *     });
 *     
 *     result.routes.forEach((route, i) => {
 *       console.log(`Route ${i + 1}:`, route);
 *       console.log(`Distance:`, route.attributes.Total_Miles);
 *     });
 *   };
 *   
 *   return <button onClick={() => findNearest(point, facilities)}>
 *     Find Nearest Facilities
 *   </button>;
 * }
 * ```
 */
export function useClosestFacility(serviceUrl?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<any>(null);

  const { Module: ClosestFacilityParametersModule } = useEsriModule(
    () => import('@arcgis/core/rest/support/ClosestFacilityParameters'),
    'ClosestFacilityParameters'
  );

  const { Module: closestFacilityModule } = useEsriModule(
    () => import('@arcgis/core/rest/closestFacility'),
    'closestFacility'
  );

  const { Module: FeatureSetModule } = useEsriModule(
    () => import('@arcgis/core/rest/support/FeatureSet'),
    'FeatureSet'
  );

  const findClosestFacility = useCallback(async (options: ClosestFacilityOptions) => {
    if (!serviceUrl) {
      throw new Error('Service URL is required for closest facility analysis');
    }

    if (!ClosestFacilityParametersModule || !closestFacilityModule || !FeatureSetModule) {
      throw new Error('Closest facility modules not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const params = new ClosestFacilityParametersModule({
        incidents: new FeatureSetModule({ features: options.incidents }),
        facilities: new FeatureSetModule({ features: options.facilities }),
        defaultTargetFacilityCount: options.defaultTargetFacilityCount || 1,
        returnRoutes: options.returnRoutes !== false,
        returnDirections: options.returnDirections || false,
        directionsLengthUnits: options.directionsLengthUnits || 'miles',
        travelDirection: options.travelDirection || 'to-facility',
        impedanceAttribute: options.impedanceAttribute || 'TravelTime'
      });

      const result = await (closestFacilityModule as any).solve(serviceUrl, params);
      setResults(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [serviceUrl, ClosestFacilityParametersModule, closestFacilityModule, FeatureSetModule]);

  return {
    findClosestFacility,
    loading,
    error,
    results
  };
}

export default useClosestFacility;
