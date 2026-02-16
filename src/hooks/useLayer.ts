import { useEffect, useRef, useState } from 'react';
import { useView } from '../context/ViewContext';
import type EsriMap from '@arcgis/core/Map';

interface UseLayerOptions<T> {
  Module: (new (...args: any[]) => T) | null;
  config: any;
  map?: EsriMap | null;
  onLoad?: (layer: T) => void;
}

export function useLayer<T extends { destroy: () => void }>(
  options: UseLayerOptions<T>
) {
  const { Module, config, map: propMap, onLoad } = options;
  const layerRef = useRef<T | null>(null);
  const [layer, setLayer] = useState<T | null>(null);
  const contextView = useView();
  const targetMap = propMap || contextView.map;

  useEffect(() => {
    if (!Module) return;

    let mounted = true;

    const initializeLayer = async () => {
      try {
        // Remove undefined properties from config
        const cleanConfig = Object.entries(config).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {} as any);

        const layerInstance = new Module(cleanConfig);

        if (!mounted) {
          layerInstance.destroy();
          return;
        }

        layerRef.current = layerInstance;
        setLayer(layerInstance);

        if (targetMap) {
          (targetMap as any).add(layerInstance);
        }

        onLoad?.(layerInstance);
      } catch (error) {
        console.error('Error initializing layer:', error);
      }
    };

    initializeLayer();

    return () => {
      mounted = false;
      if (layerRef.current && targetMap) {
        (targetMap as any).remove(layerRef.current);
        layerRef.current.destroy();
        layerRef.current = null;
      }
    };
  }, [Module, targetMap]);

  return layer;
}
