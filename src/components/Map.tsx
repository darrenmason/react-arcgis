import React, { useEffect, useRef, useState } from 'react';
import type { BaseMapProps } from '../types';
import type EsriMap from '@arcgis/core/Map';
import { useEsriModule } from '../hooks/useEsriModule';
import { usePropertyUpdater } from '../hooks/usePropertyUpdater';

export function Map({
  basemap = 'topo-vector',
  ground,
  layers,
  onLoad,
  children
}: BaseMapProps) {
  const [map, setMap] = useState<EsriMap | null>(null);
  const mapRef = useRef<EsriMap | null>(null);

  const { Module: MapModule } = useEsriModule<EsriMap>(
    () => import('@arcgis/core/Map'),
    'Map'
  );

  useEffect(() => {
    if (!MapModule) return;

    let mounted = true;

    const initializeMap = async () => {
      try {
        const mapInstance = new MapModule({
          basemap,
          ground,
          layers: layers || []
        });

        if (!mounted) {
          mapInstance.destroy();
          return;
        }

        mapRef.current = mapInstance;
        setMap(mapInstance);
        onLoad?.(mapInstance);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [MapModule]);

  usePropertyUpdater(map, {
    basemap: { value: basemap as any },
    ground: { value: ground as any, condition: !!ground }
  });

  // Update layers collection
  useEffect(() => {
    if (map && layers) {
      map.removeAll();
      map.addMany(layers);
    }
  }, [map, layers]);

  if (!map) return null;

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { map });
        }
        return child;
      })}
    </>
  );
}

export default Map;
