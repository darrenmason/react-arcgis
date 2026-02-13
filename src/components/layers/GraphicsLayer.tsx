import { useEffect, useRef } from 'react';
import type { GraphicsLayerProps } from '../../types';
import type EsriGraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { useView } from '../../context/ViewContext';

export const GraphicsLayer: React.FC<GraphicsLayerProps> = ({
  graphics = [],
  elevationInfo,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}) => {
  const layerRef = useRef<EsriGraphicsLayer | null>(null);
  const contextView = useView();
  const targetView = view || contextView.view;
  const targetMap = map || contextView.map;

  useEffect(() => {
    let mounted = true;

    const initializeLayer = async () => {
      try {
        const [GraphicsLayer] = await Promise.all([
          import('@arcgis/core/layers/GraphicsLayer')
        ]);

        if (!mounted) return;

        const layer = new GraphicsLayer.default({
          graphics,
          elevationInfo: elevationInfo as any,
          visible,
          opacity
        });

        layerRef.current = layer;

        if (targetMap) {
          targetMap.add(layer);
        }

        onLoad?.(layer);
      } catch (error) {
        console.error('Error initializing GraphicsLayer:', error);
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

  // Update graphics
  useEffect(() => {
    if (layerRef.current && graphics) {
      layerRef.current.removeAll();
      layerRef.current.addMany(graphics);
    }
  }, [graphics]);

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

export default GraphicsLayer;
