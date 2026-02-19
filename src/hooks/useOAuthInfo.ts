import { useState, useEffect, useCallback } from 'react';
import { useEsriModule } from './useEsriModule';

export interface OAuthInfoOptions extends Partial<__esri.OAuthInfoProperties> {
  appId: string;
  portalUrl?: string;
  popup?: boolean;
  flowType?: 'auto' | 'authorization-code' | 'implicit';
}

/**
 * Hook for OAuth authentication with ArcGIS Online/Enterprise
 * 
 * @example
 * ```tsx
 * function AuthenticatedApp() {
 *   const { 
 *     checkSignInStatus, 
 *     signIn, 
 *     signOut, 
 *     credential, 
 *     loading 
 *   } = useOAuthInfo({
 *     appId: 'YOUR_APP_ID',
 *     portalUrl: 'https://www.arcgis.com'
 *   });
 *   
 *   useEffect(() => {
 *     checkSignInStatus();
 *   }, []);
 *   
 *   return (
 *     <div>
 *       {credential ? (
 *         <div>
 *           <p>Signed in as: {credential.userId}</p>
 *           <CalciteButton onClick={signOut}>Sign Out</CalciteButton>
 *         </div>
 *       ) : (
 *         <CalciteButton onClick={signIn} loading={loading}>
 *           Sign In
 *         </CalciteButton>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOAuthInfo(options: OAuthInfoOptions) {
  const [credential, setCredential] = useState<__esri.Credential | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { Module: OAuthInfoModule } = useEsriModule(
    () => import('@arcgis/core/identity/OAuthInfo'),
    'OAuthInfo'
  );

  const { Module: esriIdModule } = useEsriModule(
    () => import('@arcgis/core/identity/IdentityManager'),
    'IdentityManager'
  );

  // Register OAuth info
  useEffect(() => {
    if (!OAuthInfoModule || !esriIdModule) return;

    try {
      const info = new OAuthInfoModule({
        appId: options.appId,
        portalUrl: options.portalUrl || 'https://www.arcgis.com/sharing',
        popup: options.popup !== false,
        flowType: options.flowType || 'auto'
      });

      (esriIdModule as any).registerOAuthInfos([info]);
    } catch (err) {
      console.error('Failed to register OAuth info:', err);
    }
  }, [OAuthInfoModule, esriIdModule, options]);

  const checkSignInStatus = useCallback(async () => {
    if (!esriIdModule) return;

    setLoading(true);
    setError(null);

    try {
      const cred = await (esriIdModule as any).checkSignInStatus(
        options.portalUrl || 'https://www.arcgis.com/sharing'
      );
      setCredential(cred);
      return cred;
    } catch (err) {
      // User not signed in
      setCredential(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [esriIdModule, options.portalUrl]);

  const signIn = useCallback(async () => {
    if (!esriIdModule) {
      throw new Error('IdentityManager not loaded');
    }

    setLoading(true);
    setError(null);

    try {
      const cred = await (esriIdModule as any).getCredential(
        options.portalUrl || 'https://www.arcgis.com/sharing'
      );
      setCredential(cred);
      return cred;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [esriIdModule, options.portalUrl]);

  const signOut = useCallback(async () => {
    if (!esriIdModule) return;

    setLoading(true);
    setError(null);

    try {
      await (esriIdModule as any).destroyCredentials();
      setCredential(null);
      
      // Reload page to clear session
      window.location.reload();
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [esriIdModule]);

  return {
    credential,
    loading,
    error,
    checkSignInStatus,
    signIn,
    signOut
  };
}

export default useOAuthInfo;
