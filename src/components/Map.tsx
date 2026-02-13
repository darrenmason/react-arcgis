import React, { useEffect, useRef, useState } from 'react';
import type { BaseMapProps } from '../types';
import type EsriMap from '@arcgis/core/Map';

export const Map: React.FC<BaseMapProps> = ({
  basemap = 'topo-vector',
  ground,
  layers,
  onLoad,
  children
}) => {
  const [map, setMap] = useState<EsriMap | null>(null);
  const mapRef = useRef<EsriMap | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      try {
        const [Map] = await Promise.all([
          import('@arcgis/core/Map')
        ]);

        if (!mounted) return;

        const mapInstance = new Map.default({
          basemap,
          ground,
          layers: layers || []
        });

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
  }, []);

  // Update basemap
  useEffect(() => {
    if (map) {
      map.basemap = basemap as any;
    }
  }, [map, basemap]);

  // Update ground
  useEffect(() => {
    if (map && ground) {
      map.ground = ground as any;
    }
  }, [map, ground]);

  // Update layers
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
};

export default Map;
