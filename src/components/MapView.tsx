import React, { useRef, useEffect } from 'react';
import type { MapViewProps } from '../types';
import type EsriMapView from '@arcgis/core/views/MapView';
import { ViewProvider } from '../context/ViewContext';
import { useEsriModule } from '../hooks/useEsriModule';
import { useEsriView } from '../hooks/useView';
import { usePropertyUpdater } from '../hooks/usePropertyUpdater';
import { useEventHandlers } from '../hooks/useEventHandlers';

export function MapView({
  map,
  center,
  zoom = 10,
  scale,
  extent,
  rotation,
  ui,
  constraints,
  onLoad,
  onViewReady,
  onClick,
  onPointerMove,
  className,
  style,
  children
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { Module: MapViewModule } = useEsriModule<EsriMapView>(
    () => import('@arcgis/core/views/MapView'),
    'MapView'
  );

  const { view, isReady } = useEsriView({
    Module: MapViewModule,
    container: containerRef.current,
    config: {
      map: map as any,
      center: center as any,
      zoom,
      scale,
      extent: extent as any,
      rotation,
      constraints: constraints as any
    },
    onLoad,
    onViewReady
  });

  // Configure UI components
  useEffect(() => {
    if (view && ui?.components) {
      ui.components.forEach((component) => {
        if (component.startsWith('-')) {
          view.ui.remove(component.substring(1));
        }
      });
    }
  }, [view, ui]);

  usePropertyUpdater(view, {
    center: { value: center as any, condition: isReady && !!center },
    zoom: { value: zoom, condition: isReady && zoom !== undefined },
    scale: { value: scale, condition: isReady && scale !== undefined },
    rotation: { value: rotation, condition: isReady && rotation !== undefined }
  });

  useEventHandlers(view, [
    { eventName: 'click', handler: onClick },
    { eventName: 'pointer-move', handler: onPointerMove }
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      {view && (
        <ViewProvider value={{ view, map: map || null }}>
          {children}
        </ViewProvider>
      )}
    </div>
  );
}

export default MapView;
