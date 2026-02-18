import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface PortalSearchOptions {
  query: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  num?: number;
  start?: number;
  categories?: string[];
  filter?: string;
}

export interface PortalSearchResult {
  results: __esri.PortalItem[];
  total: number;
  start: number;
  num: number;
  nextStart: number;
  query: string;
}

/**
 * Hook for searching Portal content
 * 
 * @example
 * ```tsx
 * function PortalSearchComponent() {
 *   const { search, loading, results, error } = usePortalSearch(portal);
 *   const [query, setQuery] = useState('');
 *   
 *   const handleSearch = async () => {
 *     await search({
 *       query: `title:${query} AND type:"Web Map"`,
 *       sortField: 'modified',
 *       sortOrder: 'desc',
 *       num: 20
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       <CalciteInput
 *         value={query}
 *         onCalciteInputChange={(e) => setQuery(e.target.value)}
 *       />
 *       <CalciteButton onClick={handleSearch} loading={loading}>
 *         Search
 *       </CalciteButton>
 *       
 *       {results && (
 *         <div>
 *           <p>Found {results.total} items</p>
 *           <CalciteList>
 *             {results.results.map(item => (
 *               <CalciteListItem key={item.id}>
 *                 <div slot="content-start">
 *                   <img src={item.thumbnailUrl} />
 *                 </div>
 *                 <h3>{item.title}</h3>
 *                 <p>{item.snippet}</p>
 *               </CalciteListItem>
 *             ))}
 *           </CalciteList>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePortalSearch(portal?: __esri.Portal) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<PortalSearchResult | null>(null);

  const { Module: PortalQueryParamsModule } = useEsriModule(
    () => import('@arcgis/core/portal/PortalQueryParams'),
    'PortalQueryParams'
  );

  const search = useCallback(async (options: PortalSearchOptions) => {
    if (!portal) {
      throw new Error('Portal is required for search');
    }

    if (!PortalQueryParamsModule) {
      throw new Error('PortalQueryParams module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new PortalQueryParamsModule({
        query: options.query,
        sortField: options.sortField || 'modified',
        sortOrder: options.sortOrder || 'desc',
        num: options.num || 10,
        start: options.start || 1,
        categories: options.categories,
        filter: options.filter
      });

      const response = await portal.queryItems(queryParams);
      
      const res = response as any;
      const searchResult: PortalSearchResult = {
        results: response.results,
        total: response.total,
        start: res.start ?? 0,
        num: res.num ?? response.results.length,
        nextStart: res.nextStart ?? -1,
        query: options.query
      };

      setResults(searchResult);
      return searchResult;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [portal, PortalQueryParamsModule]);

  const loadMore = useCallback(async () => {
    if (!results || results.nextStart === -1) {
      return results;
    }

    if (!portal || !PortalQueryParamsModule) {
      throw new Error('Portal and modules required');
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new PortalQueryParamsModule({
        query: results.query,
        num: results.num,
        start: results.nextStart
      });

      const response = await portal.queryItems(queryParams);
      const res = response as any;
      const newResults: PortalSearchResult = {
        results: [...results.results, ...response.results],
        total: response.total,
        start: results.start,
        num: results.results.length + response.results.length,
        nextStart: res.nextStart ?? -1,
        query: results.query
      };

      setResults(newResults);
      return newResults;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [results, portal, PortalQueryParamsModule]);

  return {
    search,
    loadMore,
    loading,
    error,
    results,
    hasMore: results ? results.nextStart !== -1 : false
  };
}

export default usePortalSearch;
