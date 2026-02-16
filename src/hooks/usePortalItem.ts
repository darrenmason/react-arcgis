import { useState, useEffect, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface UsePortalItemOptions {
  id: string;
  portal?: __esri.Portal;
}

/**
 * Hook for loading and working with Portal Items
 * 
 * @example
 * ```tsx
 * function PortalItemView() {
 *   const { item, loading, error, reload } = usePortalItem({
 *     id: 'abc123',
 *     portal: myPortal
 *   });
 *   
 *   if (loading) return <CalciteLoader />;
 *   if (error) return <CalciteNotice kind="danger">{error.message}</CalciteNotice>;
 *   
 *   return (
 *     <div>
 *       <h3>{item.title}</h3>
 *       <p>{item.description}</p>
 *       <img src={item.thumbnailUrl} alt={item.title} />
 *       <div>Type: {item.type}</div>
 *       <div>Owner: {item.owner}</div>
 *       <div>Views: {item.numViews}</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePortalItem(options: UsePortalItemOptions) {
  const [item, setItem] = useState<__esri.PortalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { Module: PortalItemModule } = useEsriModule<__esri.PortalItem>(
    () => import('@arcgis/core/portal/PortalItem'),
    'PortalItem'
  );

  const load = useCallback(async () => {
    if (!PortalItemModule || !options.id) return;

    setLoading(true);
    setError(null);

    try {
      const portalItem = new PortalItemModule({
        id: options.id,
        portal: options.portal
      });

      await portalItem.load();
      setItem(portalItem);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [PortalItemModule, options.id, options.portal]);

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(() => {
    load();
  }, [load]);

  const updateItem = useCallback(async (properties: Partial<__esri.PortalItem>) => {
    if (!item) {
      throw new Error('Item not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      // Update properties
      Object.assign(item, properties);
      await item.update();
      setItem({ ...item });
      return item;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [item]);

  return {
    item,
    loading,
    error,
    reload,
    updateItem
  };
}

export default usePortalItem;
