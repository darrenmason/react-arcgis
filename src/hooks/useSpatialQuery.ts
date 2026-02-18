import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import type Point from '@arcgis/core/geometry/Point';
import type Polygon from '@arcgis/core/geometry/Polygon';

export interface NearbyOptions {
  distance: number;
  units: __esri.LinearUnits;
  where?: string;
  outFields?: string[];
}

export interface WithinOptions {
  where?: string;
  outFields?: string[];
}

/**
 * Hook for spatial query operations (nearby, within, intersects)
 * 
 * @example
 * ```tsx
 * function SpatialSearch() {
 *   const { findNearby, findWithin, loading, results } = useSpatialQuery(featureLayer);
 *   
 *   const searchNearby = async (point) => {
 *     const features = await findNearby(point, {
 *       distance: 10,
 *       units: 'miles',
 *       where: "TYPE = 'Restaurant'",
 *       outFields: ['*']
 *     });
 *     console.log('Found nearby:', features);
 *   };
 *   
 *   const searchWithin = async (polygon) => {
 *     const features = await findWithin(polygon, {
 *       where: "POP > 50000",
 *       outFields: ['NAME', 'POP']
 *     });
 *     console.log('Found within:', features);
 *   };
 *   
 *   return <div>Spatial Search</div>;
 * }
 * ```
 */
export function useSpatialQuery(layer?: FeatureLayer) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<__esri.Graphic[] | null>(null);

  const { Module: geometryEngineModule } = useEsriModule(
    () => import('@arcgis/core/geometry/geometryEngine'),
    'geometryEngine'
  );

  const findNearby = useCallback(async (
    point: Point,
    options: NearbyOptions
  ) => {
    if (!layer) {
      throw new Error('Layer is required for spatial query');
    }

    setLoading(true);
    setError(null);

    try {
      const query = layer.createQuery();
      query.geometry = point;
      query.distance = options.distance;
      query.units = options.units as any;
      query.spatialRelationship = 'intersects';
      
      if (options.where) query.where = options.where;
      if (options.outFields) query.outFields = options.outFields;

      const result = await layer.queryFeatures(query);
      setResults(result.features);
      return result.features;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [layer]);

  const findWithin = useCallback(async (
    geometry: Polygon,
    options: WithinOptions = {}
  ) => {
    if (!layer) {
      throw new Error('Layer is required for spatial query');
    }

    setLoading(true);
    setError(null);

    try {
      const query = layer.createQuery();
      query.geometry = geometry;
      query.spatialRelationship = 'within';
      
      if (options.where) query.where = options.where;
      if (options.outFields) query.outFields = options.outFields;

      const result = await layer.queryFeatures(query);
      setResults(result.features);
      return result.features;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [layer]);

  const findIntersecting = useCallback(async (
    geometry: __esri.Geometry,
    options: WithinOptions = {}
  ) => {
    if (!layer) {
      throw new Error('Layer is required for spatial query');
    }

    setLoading(true);
    setError(null);

    try {
      const query = layer.createQuery();
      query.geometry = geometry;
      query.spatialRelationship = 'intersects';
      
      if (options.where) query.where = options.where;
      if (options.outFields) query.outFields = options.outFields;

      const result = await layer.queryFeatures(query);
      setResults(result.features);
      return result.features;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [layer]);

  return {
    findNearby,
    findWithin,
    findIntersecting,
    loading,
    error,
    results
  };
}

export default useSpatialQuery;
