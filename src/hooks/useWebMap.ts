import { useState, useEffect } from 'react';
import type WebMap from '@arcgis/core/WebMap';
import { useEsriModule } from './useEsriModule';

export interface UseWebMapOptions {
  portalItem: { id: string } | __esri.PortalItemProperties;
}

/**
 * Hook to load a WebMap from ArcGIS Online or Portal
 * 
 * @example
 * ```tsx
 * function WebMapLoader() {
 *   const { webMap, loading, error } = useWebMap({
 *     portalItem: { id: 'abc123' }
 *   });
 *   
 *   if (loading) return <div>Loading map...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <MapView map={webMap} center={[-118.805, 34.027]} zoom={13} />
 *   );
 * }
 * ```
 */
export function useWebMap({ portalItem }: UseWebMapOptions) {
  const [webMap, setWebMap] = useState<WebMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { Module: WebMapModule } = useEsriModule<WebMap>(
    () => import('@arcgis/core/WebMap'),
    'WebMap'
  );

  useEffect(() => {
    if (!WebMapModule) return;

    let mounted = true;

    const loadWebMap = async () => {
      try {
        setLoading(true);
        setError(null);

        const webMapInstance = new WebMapModule({
          portalItem: portalItem as any
        });

        await webMapInstance.load();

        if (!mounted) {
          webMapInstance.destroy();
          return;
        }

        setWebMap(webMapInstance);
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error('WebMap loading error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWebMap();

    return () => {
      mounted = false;
    };
  }, [WebMapModule, portalItem]);

  return { webMap, loading, error };
}

export default useWebMap;
