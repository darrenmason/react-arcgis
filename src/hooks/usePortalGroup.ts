import { useState, useEffect, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface UsePortalGroupOptions {
  id: string;
  portal?: __esri.Portal;
}

export interface GroupContentOptions {
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  num?: number;
  start?: number;
  categories?: string[];
}

/**
 * Hook for working with Portal Groups
 * 
 * @example
 * ```tsx
 * function PortalGroupView() {
 *   const { 
 *     group, 
 *     loading, 
 *     error, 
 *     queryItems, 
 *     items 
 *   } = usePortalGroup({
 *     id: 'abc123',
 *     portal: myPortal
 *   });
 *   
 *   useEffect(() => {
 *     if (group) {
 *       queryItems({ num: 20 });
 *     }
 *   }, [group]);
 *   
 *   if (loading) return <CalciteLoader />;
 *   
 *   return (
 *     <div>
 *       <h2>{group.title}</h2>
 *       <p>{group.description}</p>
 *       <img src={group.thumbnailUrl} />
 *       
 *       <h3>Group Items ({items?.total})</h3>
 *       <CalciteList>
 *         {items?.results.map(item => (
 *           <CalciteListItem key={item.id}>
 *             {item.title}
 *           </CalciteListItem>
 *         ))}
 *       </CalciteList>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePortalGroup(options: UsePortalGroupOptions) {
  const [group, setGroup] = useState<__esri.PortalGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<any>(null);

  const { Module: PortalGroupModule } = useEsriModule(
    () => import('@arcgis/core/portal/PortalGroup'),
    'PortalGroup'
  );

  const { Module: PortalQueryParamsModule } = useEsriModule(
    () => import('@arcgis/core/portal/PortalQueryParams'),
    'PortalQueryParams'
  );

  const load = useCallback(async () => {
    if (!PortalGroupModule || !options.id) return;

    setLoading(true);
    setError(null);

    try {
      const portalGroup = new PortalGroupModule({
        id: options.id,
        portal: options.portal
      });

      await (portalGroup as any).load();
      setGroup(portalGroup);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [PortalGroupModule, options.id, options.portal]);

  useEffect(() => {
    load();
  }, [load]);

  const queryItems = useCallback(async (queryOptions: GroupContentOptions = {}) => {
    if (!group || !PortalQueryParamsModule) {
      throw new Error('Group not loaded or module not available');
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new PortalQueryParamsModule({
        sortField: queryOptions.sortField || 'modified',
        sortOrder: queryOptions.sortOrder || 'desc',
        num: queryOptions.num || 10,
        start: queryOptions.start || 1,
        categories: queryOptions.categories
      });

      const response = await group.queryItems(queryParams);
      setItems(response);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [group, PortalQueryParamsModule]);

  const getMembers = useCallback(async () => {
    if (!group) {
      throw new Error('Group not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const members = await group.fetchMembers();
      return members;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [group]);

  return {
    group,
    loading,
    error,
    reload: load,
    queryItems,
    getMembers,
    items
  };
}

export default usePortalGroup;
