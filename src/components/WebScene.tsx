import { useEffect, useRef, useState } from 'react';
import React from 'react';
import type EsriWebScene from '@arcgis/core/WebScene';
import { useEsriModule } from '../hooks/useEsriModule';

export interface WebSceneProps {
  portalItem: { id: string } | __esri.PortalItemProperties;
  onLoad?: (webScene: EsriWebScene) => void;
  children?: React.ReactNode;
}

export function WebScene({ portalItem, onLoad, children }: WebSceneProps) {
  const [webScene, setWebScene] = useState<EsriWebScene | null>(null);
  const webSceneRef = useRef<EsriWebScene | null>(null);

  const { Module: WebSceneModule } = useEsriModule<EsriWebScene>(
    () => import('@arcgis/core/WebScene'),
    'WebScene'
  );

  useEffect(() => {
    if (!WebSceneModule) return;

    let mounted = true;

    const initializeWebScene = async () => {
      try {
        const webSceneInstance = new WebSceneModule({
          portalItem: portalItem as any
        });

        await webSceneInstance.load();

        if (!mounted) {
          webSceneInstance.destroy();
          return;
        }

        webSceneRef.current = webSceneInstance;
        setWebScene(webSceneInstance);
        onLoad?.(webSceneInstance);
      } catch (error) {
        console.error('Error loading WebScene:', error);
      }
    };

    initializeWebScene();

    return () => {
      mounted = false;
      if (webSceneRef.current) {
        webSceneRef.current.destroy();
        webSceneRef.current = null;
      }
    };
  }, [WebSceneModule, portalItem]);

  if (!webScene) return null;

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { map: webScene });
        }
        return child;
      })}
    </>
  );
}

export default WebScene;
