import { useEffect, useRef } from 'react';
import type { LayerProps } from '../../types';
import type EsriGeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { useView } from '../../context/ViewContext';

export interface GeoJSONLayerProps extends LayerProps {
  url?: string;
  copyright?: string;
  renderer?: __esri.RendererProperties;
  popupTemplate?: __esri.PopupTemplateProperties;
}

export const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({
  url,
  copyright,
  renderer,
  popupTemplate,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}) => {
  const layerRef = useRef<EsriGeoJSONLayer | null>(null);
  const contextView = useView();
  const targetView = view || contextView.view;
  const targetMap = map || contextView.map;

  useEffect(() => {
    let mounted = true;

    const initializeLayer = async () => {
      try {
        const [GeoJSONLayer] = await Promise.all([
          import('@arcgis/core/layers/GeoJSONLayer')
        ]);

        if (!mounted) return;

        const layer = new GeoJSONLayer.default({
          url,
          copyright,
          renderer: renderer as any,
          popupTemplate: popupTemplate as any,
          visible,
          opacity
        });

        layerRef.current = layer;

        if (targetMap) {
          targetMap.add(layer);
        }

        onLoad?.(layer);
      } catch (error) {
        console.error('Error initializing GeoJSONLayer:', error);
      }
    };

    initializeLayer();

    return () => {
      mounted = false;
      if (layerRef.current && targetMap) {
        targetMap.remove(layerRef.current);
        layerRef.current.destroy();
        layerRef.current = null;
      }
    };
  }, []);

  // Update visible
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.visible = visible;
    }
  }, [visible]);

  // Update opacity
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.opacity = opacity;
    }
  }, [opacity]);

  return null;
};

export default GeoJSONLayer;
