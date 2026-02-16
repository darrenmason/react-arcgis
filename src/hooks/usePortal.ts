import { useState, useEffect } from 'react';
import type Portal from '@arcgis/core/portal/Portal';
import { useEsriModule } from './useEsriModule';

export interface UsePortalOptions {
  url?: string;
  authMode?: 'immediate' | 'auto' | 'no-prompt';
}

/**
 * Hook to connect to ArcGIS Online or Portal
 * 
 * @example
 * ```tsx
 * function PortalConnection() {
 *   const { portal, user, loading, signIn, signOut } = usePortal({
 *     url: 'https://www.arcgis.com'
 *   });
 *   
 *   if (loading) return <div>Connecting...</div>;
 *   
 *   return (
 *     <div>
 *       {user ? (
 *         <div>
 *           <p>Logged in as: {user.username}</p>
 *           <button onClick={signOut}>Sign Out</button>
 *         </div>
 *       ) : (
 *         <button onClick={signIn}>Sign In</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePortal(options: UsePortalOptions = {}) {
  const { url = 'https://www.arcgis.com', authMode = 'auto' } = options;

  const [portal, setPortal] = useState<Portal | null>(null);
  const [user, setUser] = useState<__esri.PortalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { Module: PortalModule } = useEsriModule<Portal>(
    () => import('@arcgis/core/portal/Portal'),
    'Portal'
  );

  useEffect(() => {
    if (!PortalModule) return;

    let mounted = true;

    const loadPortal = async () => {
      try {
        setLoading(true);
        setError(null);

        const portalInstance = new PortalModule({ url, authMode });
        await portalInstance.load();

        if (!mounted) return;

        setPortal(portalInstance);
        setUser(portalInstance.user);
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error('Portal loading error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPortal();

    return () => {
      mounted = false;
    };
  }, [PortalModule, url, authMode]);

  const signIn = async () => {
    if (!portal) return;

    try {
      const credential = await (portal as any).load();
      setUser(portal.user);
      return credential;
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    if (!portal) return;

    try {
      const IdentityManager = await import('@arcgis/core/identity/IdentityManager');
      await IdentityManager.default.destroyCredentials();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      throw err;
    }
  };

  return {
    portal,
    user,
    loading,
    error,
    signIn,
    signOut
  };
}

export default usePortal;
