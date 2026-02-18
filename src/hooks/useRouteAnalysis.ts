import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface RouteOptions {
  stops: __esri.Graphic[];
  barriers?: __esri.Graphic[];
  returnDirections?: boolean;
  directionsLanguage?: string;
  directionsLengthUnits?: 'miles' | 'kilometers' | 'meters';
  outSpatialReference?: __esri.SpatialReference;
}

export interface ServiceAreaOptions {
  facilities: __esri.Graphic[];
  defaultBreaks?: number[];
  travelDirection?: 'from-facility' | 'to-facility';
  outSpatialReference?: __esri.SpatialReference;
}

/**
 * Hook for routing and network analysis
 * 
 * @example
 * ```tsx
 * function RoutingTool() {
 *   const { 
 *     solveRoute, 
 *     calculateServiceArea, 
 *     loading 
 *   } = useRouteAnalysis('https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World');
 *   
 *   const findRoute = async (start, end) => {
 *     const result = await solveRoute({
 *       stops: [
 *         new Graphic({ geometry: start }),
 *         new Graphic({ geometry: end })
 *       ],
 *       returnDirections: true,
 *       directionsLengthUnits: 'miles'
 *     });
 *     
 *     console.log('Route:', result.routeResults[0].route);
 *     console.log('Directions:', result.routeResults[0].directions);
 *   };
 *   
 *   const findServiceAreas = async (facility) => {
 *     const result = await calculateServiceArea({
 *       facilities: [new Graphic({ geometry: facility })],
 *       defaultBreaks: [5, 10, 15], // minutes
 *       travelDirection: 'from-facility'
 *     });
 *     
 *     result.serviceAreaPolygons.forEach(polygon => {
 *       console.log('Service area:', polygon);
 *     });
 *   };
 *   
 *   return <div>Routing</div>;
 * }
 * ```
 */
export function useRouteAnalysis(serviceUrl?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { Module: RouteParametersModule } = useEsriModule(
    () => import('@arcgis/core/rest/support/RouteParameters'),
    'RouteParameters'
  );

  const { Module: routeModule } = useEsriModule(
    () => import('@arcgis/core/rest/route'),
    'route'
  );

  const { Module: ServiceAreaParametersModule } = useEsriModule(
    () => import('@arcgis/core/rest/support/ServiceAreaParameters'),
    'ServiceAreaParameters'
  );

  const { Module: serviceAreaModule } = useEsriModule(
    () => import('@arcgis/core/rest/serviceArea'),
    'serviceArea'
  );

  const { Module: FeatureSetModule } = useEsriModule(
    () => import('@arcgis/core/rest/support/FeatureSet'),
    'FeatureSet'
  );

  const solveRoute = useCallback(async (options: RouteOptions) => {
    if (!serviceUrl) {
      throw new Error('Service URL is required for routing');
    }

    if (!RouteParametersModule || !routeModule || !FeatureSetModule) {
      throw new Error('Route modules not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const routeParams = new RouteParametersModule({
        stops: new FeatureSetModule({ features: options.stops }),
        returnDirections: options.returnDirections !== false,
        directionsLanguage: options.directionsLanguage || 'en',
        directionsLengthUnits: options.directionsLengthUnits || 'miles',
        outSpatialReference: options.outSpatialReference
      });

      if (options.barriers) {
        (routeParams as any).barriers = new FeatureSetModule({ features: options.barriers });
      }

      const result = await (routeModule as any).solve(serviceUrl, routeParams);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [serviceUrl, RouteParametersModule, routeModule, FeatureSetModule]);

  const calculateServiceArea = useCallback(async (options: ServiceAreaOptions) => {
    if (!serviceUrl) {
      throw new Error('Service URL is required for service area analysis');
    }

    if (!ServiceAreaParametersModule || !serviceAreaModule || !FeatureSetModule) {
      throw new Error('Service area modules not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const serviceAreaParams = new ServiceAreaParametersModule({
        facilities: new FeatureSetModule({ features: options.facilities }),
        defaultBreaks: options.defaultBreaks || [5, 10, 15],
        travelDirection: options.travelDirection || 'from-facility',
        outSpatialReference: options.outSpatialReference
      });

      const result = await (serviceAreaModule as any).solve(serviceUrl, serviceAreaParams);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [serviceUrl, ServiceAreaParametersModule, serviceAreaModule, FeatureSetModule]);

  return {
    solveRoute,
    calculateServiceArea,
    loading,
    error
  };
}

export default useRouteAnalysis;
