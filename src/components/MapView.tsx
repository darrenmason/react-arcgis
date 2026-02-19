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
  viewpoint,
  padding,
  popup,
  popupEnabled,
  background,
  constraints,
  displayFilterEnabled,
  spatialReference,
  animationsEnabled,
  resizeAlign,
  theme,
  ui,
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

  const config: __esri.MapViewProperties = {
    map: map as __esri.Map | __esri.WebMap | undefined,
    center: center as __esri.PointProperties | number[] | undefined,
    zoom,
    scale,
    extent: extent as __esri.ExtentProperties | undefined,
    rotation,
    viewpoint: viewpoint as __esri.ViewpointProperties | undefined,
    padding,
    popup: popup as __esri.PopupProperties | null | undefined,
    popupEnabled,
    background: background as __esri.ColorBackgroundProperties | null | undefined,
    constraints: constraints as __esri.View2DConstraintsProperties | undefined,
    displayFilterEnabled,
    spatialReference: spatialReference as __esri.SpatialReferenceProperties | undefined,
    animationsEnabled,
    resizeAlign,
    theme: theme as __esri.ThemeProperties | null | undefined,
    ui: ui as __esri.UIProperties | undefined
  };

  const { view, isReady } = useEsriView({
    Module: MapViewModule,
    container: containerRef.current,
    config,
    onLoad,
    onViewReady
  });

  // Configure UI components (custom components array for removing default UI)
  useEffect(() => {
    const uiWithComponents = ui as { components?: string[] } | undefined;
    if (view && uiWithComponents?.components) {
      uiWithComponents.components.forEach((component: string) => {
        if (component.startsWith('-')) {
          view.ui.remove(component.substring(1));
        }
      });
    }
  }, [view, ui]);

  usePropertyUpdater(view, {
    center: { value: center as __esri.Point, condition: isReady && center !== undefined },
    zoom: { value: zoom, condition: isReady && zoom !== undefined },
    scale: { value: scale, condition: isReady && scale !== undefined },
    extent: { value: extent as __esri.Extent, condition: isReady && extent !== undefined },
    rotation: { value: rotation, condition: isReady && rotation !== undefined },
    padding: { value: padding, condition: padding !== undefined },
    popupEnabled: { value: popupEnabled, condition: popupEnabled !== undefined },
    displayFilterEnabled: { value: displayFilterEnabled, condition: displayFilterEnabled !== undefined },
    animationsEnabled: { value: animationsEnabled, condition: animationsEnabled !== undefined },
    resizeAlign: { value: resizeAlign as __esri.View2D['resizeAlign'], condition: resizeAlign !== undefined },
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

export default MapView;
