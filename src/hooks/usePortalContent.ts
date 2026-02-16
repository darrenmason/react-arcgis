import { useState, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface AddItemOptions {
  type: string;
  title: string;
  description?: string;
  snippet?: string;
  tags?: string[];
  thumbnail?: File | Blob;
  data?: any;
  folder?: string;
  access?: 'private' | 'org' | 'public';
}

export interface UpdateItemOptions {
  title?: string;
  description?: string;
  snippet?: string;
  tags?: string[];
  thumbnail?: File | Blob;
  data?: any;
  access?: 'private' | 'org' | 'public';
}

/**
 * Hook for managing Portal content (add, update, delete items)
 * 
 * @example
 * ```tsx
 * function ContentManager() {
 *   const { addItem, updateItem, deleteItem, loading, error } = usePortalContent(portal);
 *   
 *   const createWebMap = async () => {
 *     const item = await addItem({
 *       type: 'Web Map',
 *       title: 'My New Web Map',
 *       description: 'A custom web map',
 *       tags: ['map', 'custom'],
 *       data: {
 *         baseMap: { title: 'Topographic' },
 *         operationalLayers: []
 *       },
 *       access: 'private'
 *     });
 *     
 *     console.log('Created item:', item.id);
 *   };
 *   
 *   const updateWebMap = async (itemId: string) => {
 *     await updateItem(itemId, {
 *       title: 'Updated Web Map Title',
 *       tags: ['map', 'custom', 'updated'],
 *       access: 'public'
 *     });
 *   };
 *   
 *   const removeItem = async (itemId: string) => {
 *     await deleteItem(itemId);
 *   };
 *   
 *   return (
 *     <div>
 *       <CalciteButton onClick={createWebMap} loading={loading}>
 *         Create Web Map
 *       </CalciteButton>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePortalContent(portal?: __esri.Portal) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { Module: PortalItemModule } = useEsriModule(
    () => import('@arcgis/core/portal/PortalItem'),
    'PortalItem'
  );

  const addItem = useCallback(async (options: AddItemOptions) => {
    if (!portal?.user) {
      throw new Error('User must be signed in to add items');
    }

    if (!PortalItemModule) {
      throw new Error('PortalItem module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const item = new PortalItemModule({
        type: options.type,
        title: options.title,
        description: options.description,
        snippet: options.snippet,
        tags: options.tags,
        portal: portal
      });

      // Add the item
      const addItemOptions: any = {
        folder: options.folder,
        data: options.data
      };

      if (options.thumbnail) {
        addItemOptions.thumbnail = options.thumbnail;
      }

      await portal.user.addItem(addItemOptions);

      // Set access level if specified
      if (options.access && options.access !== 'private') {
        await item.update({
          access: options.access
        });
      }

      return item;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [portal, PortalItemModule]);

  const updateItem = useCallback(async (itemId: string, options: UpdateItemOptions) => {
    if (!portal?.user) {
      throw new Error('User must be signed in to update items');
    }

    if (!PortalItemModule) {
      throw new Error('PortalItem module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const item = new PortalItemModule({
        id: itemId,
        portal: portal
      });

      await item.load();

      // Update properties
      const updateOptions: any = {};
      if (options.title) updateOptions.title = options.title;
      if (options.description) updateOptions.description = options.description;
      if (options.snippet) updateOptions.snippet = options.snippet;
      if (options.tags) updateOptions.tags = options.tags;
      if (options.thumbnail) updateOptions.thumbnail = options.thumbnail;
      if (options.data) updateOptions.data = options.data;
      if (options.access) updateOptions.access = options.access;

      await item.update(updateOptions);
      return item;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [portal, PortalItemModule]);

  const deleteItem = useCallback(async (itemId: string) => {
    if (!portal?.user) {
      throw new Error('User must be signed in to delete items');
    }

    if (!PortalItemModule) {
      throw new Error('PortalItem module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const item = new PortalItemModule({
        id: itemId,
        portal: portal
      });

      await item.load();
      await portal.user.deleteItem(item);
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [portal, PortalItemModule]);

  const shareItem = useCallback(async (
    itemId: string,
    options: { everyone?: boolean; org?: boolean; groups?: string[] }
  ) => {
    if (!portal?.user) {
      throw new Error('User must be signed in to share items');
    }

    if (!PortalItemModule) {
      throw new Error('PortalItem module not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const item = new PortalItemModule({
        id: itemId,
        portal: portal
      });

      await item.load();
      await item.share(options);
      return item;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [portal, PortalItemModule]);

  return {
    addItem,
    updateItem,
    deleteItem,
    shareItem,
    loading,
    error
  };
}

export default usePortalContent;
