import { useState, useEffect, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface UsePortalUserOptions {
  username?: string;
  portal?: __esri.Portal;
}

export interface UserContentOptions {
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  num?: number;
  start?: number;
  folder?: string;
}

/**
 * Hook for working with Portal Users
 * 
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { 
 *     user, 
 *     loading, 
 *     error, 
 *     fetchContent, 
 *     content 
 *   } = usePortalUser({
 *     username: 'johndoe',
 *     portal: myPortal
 *   });
 *   
 *   useEffect(() => {
 *     if (user) {
 *       fetchContent({ num: 20 });
 *     }
 *   }, [user]);
 *   
 *   if (loading) return <CalciteLoader />;
 *   
 *   return (
 *     <div>
 *       <img src={user.thumbnailUrl} alt={user.fullName} />
 *       <h2>{user.fullName}</h2>
 *       <p>{user.description}</p>
 *       <div>Username: {user.username}</div>
 *       <div>Organization: {user.orgId}</div>
 *       
 *       <h3>User Content ({content?.total})</h3>
 *       <CalciteList>
 *         {content?.items.map(item => (
 *           <CalciteListItem key={item.id}>
 *             {item.title} - {item.type}
 *           </CalciteListItem>
 *         ))}
 *       </CalciteList>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePortalUser(options: UsePortalUserOptions = {}) {
  const [user, setUser] = useState<__esri.PortalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [content, setContent] = useState<any>(null);

  const { Module: PortalUserModule } = useEsriModule(
    () => import('@arcgis/core/portal/PortalUser'),
    'PortalUser'
  );

  const { Module: PortalQueryParamsModule } = useEsriModule(
    () => import('@arcgis/core/portal/PortalQueryParams'),
    'PortalQueryParams'
  );

  const load = useCallback(async () => {
    if (!PortalUserModule) return;

    setLoading(true);
    setError(null);

    try {
      let portalUser: __esri.PortalUser;

      if (options.username) {
        // Load specific user
        portalUser = new PortalUserModule({
          username: options.username,
          portal: options.portal
        });
        await (portalUser as any).load();
      } else if (options.portal?.user) {
        // Use signed-in user from portal
        portalUser = options.portal.user;
        await (portalUser as any).load();
      } else {
        throw new Error('Username or signed-in portal required');
      }

      setUser(portalUser);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [PortalUserModule, options.username, options.portal]);

  useEffect(() => {
    load();
  }, [load]);

  const fetchContent = useCallback(async (queryOptions: UserContentOptions = {}) => {
    if (!user || !PortalQueryParamsModule) {
      throw new Error('User not loaded or module not available');
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new PortalQueryParamsModule({
        sortField: queryOptions.sortField || 'modified',
        sortOrder: queryOptions.sortOrder || 'desc',
        num: queryOptions.num || 10,
        start: queryOptions.start || 1
      });

      const response = await (user as any).fetchContent(queryOptions.folder);
      setContent(response);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, PortalQueryParamsModule]);

  const fetchFolders = useCallback(async () => {
    if (!user) {
      throw new Error('User not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const folders = await user.fetchFolders();
      return folders;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchGroups = useCallback(async () => {
    if (!user) {
      throw new Error('User not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const groups = await user.fetchGroups();
      return groups;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    reload: load,
    fetchContent,
    fetchFolders,
    fetchGroups,
    content
  };
}

export default usePortalUser;
