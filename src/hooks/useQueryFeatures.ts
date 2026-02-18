import { useState, useCallback } from 'react';
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';

export interface QueryFeaturesOptions {
  where?: string;
  geometry?: __esri.Geometry;
  spatialRelationship?: 'intersects' | 'contains' | 'crosses' | 'envelope-intersects' | 'index-intersects' | 'overlaps' | 'touches' | 'within';
  distance?: number;
  units?: __esri.LinearUnits;
  outFields?: string[];
  returnGeometry?: boolean;
  maxRecordCount?: number;
  orderByFields?: string[];
}

/**
 * Advanced hook for querying features with spatial and attribute filters
 * 
 * @example
 * ```tsx
 * function AdvancedQuery() {
 *   const { query, loading, error, results } = useQueryFeatures(featureLayer);
 *   
 *   const handleQuery = async () => {
 *     const features = await query({
 *       where: "POP > 1000000",
 *       geometry: point,
 *       spatialRelationship: 'intersects',
 *       distance: 50,
 *       units: 'miles',
 *       outFields: ['*']
 *     });
 *     console.log('Found:', features);
 *   };
 *   
 *   return (
 *     <button onClick={handleQuery} disabled={loading}>
 *       Query Features
 *     </button>
 *   );
 * }
 * ```
 */
export function useQueryFeatures(layer?: FeatureLayer) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<__esri.Graphic[] | null>(null);

  const query = useCallback(async (options: QueryFeaturesOptions) => {
    if (!layer) {
      throw new Error('Layer is required for query');
    }

    setLoading(true);
    setError(null);

    try {
      const query = layer.createQuery();
      
      if (options.where) query.where = options.where;
      if (options.geometry) query.geometry = options.geometry;
      if (options.spatialRelationship) query.spatialRelationship = options.spatialRelationship;
      if (options.distance !== undefined) query.distance = options.distance;
      if (options.units) query.units = options.units as any;
      if (options.outFields) query.outFields = options.outFields;
      if (options.returnGeometry !== undefined) query.returnGeometry = options.returnGeometry;
      if (options.maxRecordCount) query.num = options.maxRecordCount;
      if (options.orderByFields) query.orderByFields = options.orderByFields;

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

  const queryExtent = useCallback(async (options: QueryFeaturesOptions) => {
    if (!layer) {
      throw new Error('Layer is required for query');
    }

    setLoading(true);
    setError(null);

    try {
      const query = layer.createQuery();
      if (options.where) query.where = options.where;
      if (options.geometry) query.geometry = options.geometry;

      const result = await layer.queryExtent(query);
      return result.extent;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [layer]);

  const queryCount = useCallback(async (options: QueryFeaturesOptions) => {
    if (!layer) {
      throw new Error('Layer is required for query');
    }

    setLoading(true);
    setError(null);

    try {
      const query = layer.createQuery();
      if (options.where) query.where = options.where;
      if (options.geometry) query.geometry = options.geometry;

      const count = await layer.queryFeatureCount(query);
      return count;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [layer]);

  return {
    query,
    queryExtent,
    queryCount,
    loading,
    error,
    results
  };
}

export default useQueryFeatures;
