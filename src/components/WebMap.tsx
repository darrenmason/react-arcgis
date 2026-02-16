import { useEffect, useRef, useState } from 'react';
import React from 'react';
import type EsriWebMap from '@arcgis/core/WebMap';
import { useEsriModule } from '../hooks/useEsriModule';

export interface WebMapProps {
  portalItem: { id: string } | __esri.PortalItemProperties;
  onLoad?: (webMap: EsriWebMap) => void;
  children?: React.ReactNode;
}

export function WebMap({ portalItem, onLoad, children }: WebMapProps) {
  const [webMap, setWebMap] = useState<EsriWebMap | null>(null);
  const webMapRef = useRef<EsriWebMap | null>(null);

  const { Module: WebMapModule } = useEsriModule<EsriWebMap>(
    () => import('@arcgis/core/WebMap'),
    'WebMap'
  );

  useEffect(() => {
    if (!WebMapModule) return;

    let mounted = true;

    const initializeWebMap = async () => {
      try {
        const webMapInstance = new WebMapModule({
          portalItem: portalItem as any
        });

        await webMapInstance.load();

        if (!mounted) {
          webMapInstance.destroy();
          return;
        }

        webMapRef.current = webMapInstance;
        setWebMap(webMapInstance);
        onLoad?.(webMapInstance);
      } catch (error) {
        console.error('Error loading WebMap:', error);
      }
    };

    initializeWebMap();

    return () => {
      mounted = false;
      if (webMapRef.current) {
        webMapRef.current.destroy();
        webMapRef.current = null;
      }
    };
  }, [WebMapModule, portalItem]);

  if (!webMap) return null;

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { map: webMap });
        }
        return child;
      })}
    </>
  );
}

export default WebMap;
