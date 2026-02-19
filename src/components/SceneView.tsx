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
  viewpoint,
  viewingMode = 'global',
  padding,
  popup,
  popupEnabled,
  environment,
  constraints,
  displayFilterEnabled,
  spatialReference,
  theme,
  ui,
  onLoad,
  onViewReady,
  onClick,
  onPointerMove,
  className,
  style,
  children
}: SceneViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { Module: SceneViewModule } = useEsriModule<EsriSceneView>(
    () => import('@arcgis/core/views/SceneView'),
    'SceneView'
  );

  const config: __esri.SceneViewProperties = {
    map: map as __esri.Map | __esri.WebMap | undefined,
    center: center as __esri.PointProperties | number[] | undefined,
    zoom,
    scale,
    camera: camera as __esri.CameraProperties | undefined,
    viewpoint: viewpoint as __esri.ViewpointProperties | undefined,
    viewingMode,
    padding,
    popup: popup as __esri.PopupProperties | null | undefined,
    popupEnabled,
    environment: environment as __esri.SceneViewEnvironmentProperties | undefined,
    constraints: constraints as __esri.SceneViewConstraintsProperties | undefined,
    displayFilterEnabled,
    spatialReference: spatialReference as __esri.SpatialReferenceProperties | undefined,
    theme: theme as __esri.ThemeProperties | null | undefined,
    ui: ui as __esri.DefaultUIProperties | undefined
  };

  const { view, isReady } = useEsriView({
    Module: SceneViewModule,
    container: containerRef.current,
    config,
    onLoad,
    onViewReady
  });

  usePropertyUpdater(view, {
    camera: { value: camera as __esri.Camera, condition: isReady && camera !== undefined },
    center: { value: center as __esri.Point, condition: isReady && center !== undefined },
    zoom: { value: zoom, condition: isReady && zoom !== undefined },
    scale: { value: scale, condition: isReady && scale !== undefined },
    padding: { value: padding, condition: padding !== undefined },
    popupEnabled: { value: popupEnabled, condition: popupEnabled !== undefined },
    displayFilterEnabled: { value: displayFilterEnabled, condition: displayFilterEnabled !== undefined },
    theme: { value: theme as __esri.Theme | null | undefined, condition: theme !== undefined }
  });

  useEventHandlers(view, [
    { eventName: 'click', handler: onClick },
    { eventName: 'pointer-move', handler: onPointerMove }
  ]);


  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      {/* Dedicated empty container for ArcGIS - view and its UI overlay render here */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }}
      />
      {view && (
        <ViewProvider value={{ view, map: map || null }}>
          {children}
        </ViewProvider>
      )}
    </div>
  );
}

export default SceneView;
