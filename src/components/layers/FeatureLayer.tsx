import { useEffect, useRef } from 'react';
import type { FeatureLayerProps } from '../../types';
import type EsriFeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { useView } from '../../context/ViewContext';

export const FeatureLayer: React.FC<FeatureLayerProps> = ({
  url,
  portalItem,
  fields,
  geometryType,
  objectIdField,
  renderer,
  popupTemplate,
  definitionExpression,
  outFields = ['*'],
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}) => {
  const layerRef = useRef<EsriFeatureLayer | null>(null);
  const contextView = useView();
  const targetView = view || contextView.view;
  const targetMap = map || contextView.map;

  useEffect(() => {
    let mounted = true;

    const initializeLayer = async () => {
      try {
        const [FeatureLayer] = await Promise.all([
          import('@arcgis/core/layers/FeatureLayer')
        ]);

        if (!mounted) return;

        const layerConfig: any = {
          url,
          portalItem,
          fields,
          geometryType,
          objectIdField,
          renderer,
          popupTemplate,
          definitionExpression,
          outFields,
          visible,
          opacity
        };

        // Remove undefined properties
        Object.keys(layerConfig).forEach(key => {
          if (layerConfig[key] === undefined) {
            delete layerConfig[key];
          }
        });

        const layer = new FeatureLayer.default(layerConfig);

        layerRef.current = layer;

        if (targetMap) {
          targetMap.add(layer);
        }

        onLoad?.(layer);
      } catch (error) {
        console.error('Error initializing FeatureLayer:', error);
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

  // Update definitionExpression
  useEffect(() => {
    if (layerRef.current && definitionExpression !== undefined) {
      layerRef.current.definitionExpression = definitionExpression;
    }
  }, [definitionExpression]);

  // Update renderer
  useEffect(() => {
    if (layerRef.current && renderer) {
      layerRef.current.renderer = renderer as any;
    }
  }, [renderer]);

  // Update popupTemplate
  useEffect(() => {
    if (layerRef.current && popupTemplate) {
      layerRef.current.popupTemplate = popupTemplate as any;
    }
  }, [popupTemplate]);

  return null;
};

export default FeatureLayer;
