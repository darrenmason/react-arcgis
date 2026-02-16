import { useState, useCallback } from 'react';
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';

export interface UseQueryOptions {
  layer: FeatureLayer | null;
}

export interface QueryOptions {
  where?: string;
  geometry?: __esri.Geometry;
  spatialRelationship?: __esri.Query['spatialRelationship'];
  outFields?: string[];
  returnGeometry?: boolean;
  orderByFields?: string[];
  num?: number;
  start?: number;
}

/**
 * Hook for querying features from a layer
 * 
 * @example
 * ```tsx
 * function FeatureQuery() {
 *   const { query, results, loading, error } = useQuery({ layer });
 *   
 *   const handleQuery = async () => {
 *     await query({
 *       where: "POP2010 > 1000000",
 *       outFields: ["*"],
 *       returnGeometry: true
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       <button onClick={handleQuery}>Query Large Cities</button>
 *       {loading && <p>Loading...</p>}
 *       {results && <p>Found {results.features.length} features</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useQuery({ layer }: UseQueryOptions) {
  const [results, setResults] = useState<__esri.FeatureSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const query = useCallback(async (options: QueryOptions) => {
    if (!layer) {
      setError(new Error('Layer is not initialized'));
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const query = layer.createQuery();
      
      if (options.where) query.where = options.where;
      if (options.geometry) query.geometry = options.geometry as any;
      if (options.spatialRelationship) query.spatialRelationship = options.spatialRelationship;
      if (options.outFields) query.outFields = options.outFields;
      if (options.returnGeometry !== undefined) query.returnGeometry = options.returnGeometry;
      if (options.orderByFields) query.orderByFields = options.orderByFields;
      if (options.num) query.num = options.num;
      if (options.start) query.start = options.start;

      const featureSet = await layer.queryFeatures(query);
      setResults(featureSet);
      return featureSet;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Query error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [layer]);

  const queryCount = useCallback(async (where?: string) => {
    if (!layer) return 0;

    try {
      const query = layer.createQuery();
      if (where) query.where = where;
      return await layer.queryFeatureCount(query);
    } catch (err) {
      console.error('Query count error:', err);
      return 0;
    }
  }, [layer]);

  const queryExtent = useCallback(async (where?: string) => {
    if (!layer) return null;

    try {
      const query = layer.createQuery();
      if (where) query.where = where;
      const result = await layer.queryExtent(query);
      return result.extent;
    } catch (err) {
      console.error('Query extent error:', err);
      return null;
    }
  }, [layer]);

  return {
    query,
    queryCount,
    queryExtent,
    results,
    loading,
    error
  };
}

export default useQuery;
