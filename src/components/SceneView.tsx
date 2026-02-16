import React, { useRef } from 'react';
import type { SceneViewProps } from '../types';
import type EsriSceneView from '@arcgis/core/views/SceneView';
import { ViewProvider } from '../context/ViewContext';
import { useEsriModule } from '../hooks/useEsriModule';
import { useEsriView } from '../hooks/useView';
import { usePropertyUpdater } from '../hooks/usePropertyUpdater';
import { useEventHandlers } from '../hooks/useEventHandlers';

export function SceneView({
  map,
  center,
  zoom = 10,
  scale,
  camera,
  viewingMode = 'global',
  onLoad,
  onViewReady,
  onClick,
  className,
  style,
  children
}: SceneViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { Module: SceneViewModule } = useEsriModule<EsriSceneView>(
    () => import('@arcgis/core/views/SceneView'),
    'SceneView'
  );

  const { view, isReady } = useEsriView({
    Module: SceneViewModule,
    container: containerRef.current,
    config: {
      map: map as any,
      center: center as any,
      zoom,
      scale,
      camera: camera as any,
      viewingMode
    },
    onLoad,
    onViewReady
  });

  usePropertyUpdater(view, {
    camera: { value: camera as any, condition: isReady && !!camera }
  });

  useEventHandlers(view, [
    { eventName: 'click', handler: onClick }
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

export default SceneView;
