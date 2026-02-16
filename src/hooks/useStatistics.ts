import { useState, useCallback } from 'react';
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';

export interface StatisticDefinition {
  statisticType: 'count' | 'sum' | 'min' | 'max' | 'avg' | 'stddev' | 'var';
  onStatisticField: string;
  outStatisticFieldName: string;
}

export interface StatisticsOptions {
  where?: string;
  geometry?: __esri.Geometry;
  statisticDefinitions: StatisticDefinition[];
  groupByFieldsForStatistics?: string[];
  orderByFields?: string[];
}

/**
 * Hook for calculating statistics on feature layers
 * 
 * @example
 * ```tsx
 * function PopulationStats() {
 *   const { calculateStatistics, loading, results } = useStatistics(featureLayer);
 *   
 *   const getStats = async () => {
 *     const stats = await calculateStatistics({
 *       where: "STATE = 'CA'",
 *       statisticDefinitions: [
 *         {
 *           statisticType: 'sum',
 *           onStatisticField: 'POP2020',
 *           outStatisticFieldName: 'totalPop'
 *         },
 *         {
 *           statisticType: 'avg',
 *           onStatisticField: 'POP2020',
 *           outStatisticFieldName: 'avgPop'
 *         }
 *       ]
 *     });
 *     
 *     console.log('Total:', stats[0].attributes.totalPop);
 *     console.log('Average:', stats[0].attributes.avgPop);
 *   };
 *   
 *   return <button onClick={getStats}>Calculate Stats</button>;
 * }
 * ```
 */
export function useStatistics(layer?: FeatureLayer) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<__esri.Graphic[] | null>(null);

  const calculateStatistics = useCallback(async (options: StatisticsOptions) => {
    if (!layer) {
      throw new Error('Layer is required for statistics');
    }

    setLoading(true);
    setError(null);

    try {
      const query = layer.createQuery();
      
      if (options.where) query.where = options.where;
      if (options.geometry) query.geometry = options.geometry;
      
      query.outStatistics = options.statisticDefinitions.map(def => ({
        statisticType: def.statisticType,
        onStatisticField: def.onStatisticField,
        outStatisticFieldName: def.outStatisticFieldName
      }));

      if (options.groupByFieldsForStatistics) {
        query.groupByFieldsForStatistics = options.groupByFieldsForStatistics;
      }

      if (options.orderByFields) {
        query.orderByFields = options.orderByFields;
      }

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
    calculateStatistics,
    loading,
    error,
    results
  };
}

export default useStatistics;
