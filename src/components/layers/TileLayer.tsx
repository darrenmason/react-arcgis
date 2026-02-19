import type { LayerProps } from '../../types';
import type EsriTileLayer from '@arcgis/core/layers/TileLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface TileLayerProps extends LayerProps {
  /** API key for the layer (appended to requests). */
  apiKey?: string | null;
  /** Blend mode for the layer. See TileLayer blendMode in the API. */
  blendMode?: __esri.TileLayerProperties['blendMode'];
  /** Copyright text as defined by the service. */
  copyright?: string | null;
  /** Custom parameters appended to all layer request URLs. */
  customParameters?: Record<string, string> | null;
  /** CSS filter-like effect applied to the layer. */
  effect?: __esri.Effect | string | null;
  /** Unique ID for the layer. */
  id?: string;
  /** Whether the layer is included in the legend. */
  legendEnabled?: boolean;
  /** How the layer displays in the LayerList. */
  listMode?: 'show' | 'hide' | 'hide-children';
  /** Maximum scale (most zoomed in) at which the layer is visible. 0 = no maximum. */
  maxScale?: number;
  /** Minimum scale (most zoomed out) at which the layer is visible. 0 = no minimum. */
  minScale?: number;
  /** When true, the layer can be persisted in a WebMap or WebScene. */
  persistenceEnabled?: boolean;
  /** Portal item (e.g. { id }) to load the layer from. */
  portalItem?: __esri.PortalItemProperties;
  /** Refresh interval in minutes. 0 = no refresh. */
  refreshInterval?: number;
  /** When true, tile images are resampled at lower LOD when tiles are not available. */
  resampling?: boolean;
  /** Tiling scheme for the layer. */
  tileInfo?: __esri.TileInfo;
  /** Array of tile server URLs for changing map tiles. */
  tileServers?: string[];
  /** Title for the layer (e.g. in Legend, LayerList). */
  title?: string | null;
  /** URL of the REST endpoint of the layer. */
  url?: string | null;
  /** Time extent during which the layer is visible. */
  visibilityTimeExtent?: __esri.TimeExtentProperties | null;
}

export function TileLayer({
  apiKey,
  blendMode,
  copyright,
  customParameters,
  effect,
  id,
  legendEnabled,
  listMode,
  maxScale,
  minScale,
  persistenceEnabled,
  portalItem,
  refreshInterval,
  resampling,
  tileInfo,
  tileServers,
  title,
  url,
  visibilityTimeExtent,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: TileLayerProps) {
  const { Module } = useEsriModule<EsriTileLayer>(
    () => import('@arcgis/core/layers/TileLayer'),
    'TileLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      apiKey,
      blendMode,
      copyright,
      customParameters,
      effect: effect as any,
      id,
      legendEnabled,
      listMode,
      maxScale,
      minScale,
      persistenceEnabled,
      portalItem,
      refreshInterval,
      resampling,
      tileInfo,
      tileServers,
      title,
      url,
      visibilityTimeExtent: visibilityTimeExtent as any,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    blendMode: { value: blendMode },
    copyright: { value: copyright, condition: copyright !== undefined },
    effect: { value: effect as any, condition: effect !== undefined },
    legendEnabled: { value: legendEnabled },
    listMode: { value: listMode },
    maxScale: { value: maxScale },
    minScale: { value: minScale },
    persistenceEnabled: { value: persistenceEnabled },
    refreshInterval: { value: refreshInterval, condition: refreshInterval !== undefined },
    resampling: { value: resampling },
    title: { value: title },
    visibilityTimeExtent: { value: visibilityTimeExtent as any, condition: visibilityTimeExtent !== undefined },
    visible: { value: visible },
    opacity: { value: opacity }
  });

  return null;
}

export default TileLayer;
