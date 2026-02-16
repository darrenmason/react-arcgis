import { useState, useEffect } from 'react';
import type WebScene from '@arcgis/core/WebScene';
import { useEsriModule } from './useEsriModule';

export interface UseWebSceneOptions {
  portalItem: { id: string } | __esri.PortalItemProperties;
}

/**
 * Hook to load a WebScene from ArcGIS Online or Portal
 * 
 * @example
 * ```tsx
 * function WebSceneLoader() {
 *   const { webScene, loading, error } = useWebScene({
 *     portalItem: { id: 'abc123' }
 *   });
 *   
 *   if (loading) return <div>Loading scene...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <SceneView map={webScene} camera={{ position: {...} }} />
 *   );
 * }
 * ```
 */
export function useWebScene({ portalItem }: UseWebSceneOptions) {
  const [webScene, setWebScene] = useState<WebScene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { Module: WebSceneModule } = useEsriModule<WebScene>(
    () => import('@arcgis/core/WebScene'),
    'WebScene'
  );

  useEffect(() => {
    if (!WebSceneModule) return;

    let mounted = true;

    const loadWebScene = async () => {
      try {
        setLoading(true);
        setError(null);

        const webSceneInstance = new WebSceneModule({
          portalItem: portalItem as any
        });

        await webSceneInstance.load();

        if (!mounted) {
          webSceneInstance.destroy();
          return;
        }

        setWebScene(webSceneInstance);
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error('WebScene loading error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWebScene();

    return () => {
      mounted = false;
    };
  }, [WebSceneModule, portalItem]);

  return { webScene, loading, error };
}

export default useWebScene;
