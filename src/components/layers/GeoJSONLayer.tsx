import type { LayerProps } from '../../types';
import type EsriGeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface GeoJSONLayerProps extends LayerProps {
  /** Attribute table template for the layer's FeatureTable. */
  attributeTableTemplate?: __esri.AttributeTableTemplateProperties | null;
  /** Blend mode for the layer. See GeoJSONLayer blendMode in the API. */
  blendMode?: __esri.GeoJSONLayerProperties['blendMode'];
  /** Copyright information for the layer. */
  copyright?: string | null;
  /** Custom parameters appended to the URL of all resources fetched by the layer. */
  customParameters?: Record<string, string> | null;
  /** SQL where clause used to filter features on the client. */
  definitionExpression?: string | null;
  /** Name of the layer's primary display field. */
  displayField?: string | null;
  /** Whether the layer's displayFilterInfo is applied when rendering. */
  displayFilterEnabled?: boolean;
  /** Display filter (visibility) for the layer. */
  displayFilterInfo?: __esri.DisplayFilterInfoProperties | null;
  /** Whether the layer is editable (client-side only; source file not modified). */
  editingEnabled?: boolean;
  /** CSS filter-like effect applied to the layer. */
  effect?: __esri.Effect | string | null;
  /** How features are placed on the vertical axis (z). SceneView only. */
  elevationInfo?: __esri.ElevationInfoProperties | null;
  /** Feature effect (filter + included/excluded effects). */
  featureEffect?: __esri.FeatureEffectProperties | null;
  /** Feature reduction (cluster, binning, selection). */
  featureReduction?: __esri.FeatureReductionBinning | __esri.FeatureReductionCluster | __esri.FeatureReductionSelection | null;
  /** Array of field definitions for the layer. */
  fields?: __esri.Field[];
  /** Geometry type of features in the layer. */
  geometryType?: __esri.GeoJSONLayerProperties['geometryType'];
  /** Unique ID for the layer. */
  id?: string;
  /** Label definition (array of LabelClass). */
  labelingInfo?: __esri.LabelClassProperties[] | null;
  /** Whether to display labels. */
  labelsVisible?: boolean;
  /** Whether the layer is included in the legend. */
  legendEnabled?: boolean;
  /** How the layer displays in the LayerList. */
  listMode?: 'show' | 'hide' | 'hide-children';
  /** Maximum scale (most zoomed in) at which the layer is visible. 0 = no maximum. */
  maxScale?: number;
  /** Minimum scale (most zoomed out) at which the layer is visible. 0 = no minimum. */
  minScale?: number;
  /** Name of the field containing a unique identifier for each feature. */
  objectIdField?: string;
  /** Order in which features are drawn (e.g. by field). */
  orderBy?: __esri.OrderByInfoProperties[] | null;
  /** Field names to include with each feature (e.g. ["*"]). */
  outFields?: string[] | null;
  /** Whether the layer can be persisted in WebMap/WebScene. */
  persistenceEnabled?: boolean;
  /** Whether to display popups when features are clicked. */
  popupEnabled?: boolean;
  /** Popup template for the layer. */
  popupTemplate?: __esri.PopupTemplateProperties | null;
  /** Portal item referencing the GeoJSON file to load from. */
  portalItem?: __esri.PortalItemProperties;
  /** Refresh interval in minutes. 0 = no refresh. */
  refreshInterval?: number;
  /** Renderer for styling features. */
  renderer?: __esri.RendererProperties | null;
  /** Apply perspective scaling to screen-size symbols in SceneView. */
  screenSizePerspectiveEnabled?: boolean;
  /** Time extent for the layer. */
  timeExtent?: __esri.TimeExtentProperties | null;
  /** Time info (start/end fields, fullTimeExtent). Must be set at layer init. */
  timeInfo?: __esri.TimeInfoProperties | null;
  /** Temporary time offset for the layer. */
  timeOffset?: __esri.TimeIntervalProperties | null;
  /** Title for the layer (e.g. in Legend, LayerList). */
  title?: string | null;
  /** Track info for rendering track data. */
  trackInfo?: __esri.TrackInfoProperties | null;
  /** URL of the GeoJSON file (or blob URL for in-memory data). */
  url?: string | null;
  /** Whether temporal data follows the view's timeExtent. */
  useViewTime?: boolean;
  /** Time extent during which the layer is visible. */
  visibilityTimeExtent?: __esri.TimeExtentProperties | null;
}

export function GeoJSONLayer({
  attributeTableTemplate,
  blendMode,
  copyright,
  customParameters,
  definitionExpression,
  displayField,
  displayFilterEnabled,
  displayFilterInfo,
  editingEnabled,
  effect,
  elevationInfo,
  featureEffect,
  featureReduction,
  fields,
  geometryType,
  id,
  labelingInfo,
  labelsVisible,
  legendEnabled,
  listMode,
  maxScale,
  minScale,
  objectIdField,
  orderBy,
  outFields,
  persistenceEnabled,
  popupEnabled,
  popupTemplate,
  portalItem,
  refreshInterval,
  renderer,
  screenSizePerspectiveEnabled,
  timeExtent,
  timeInfo,
  timeOffset,
  title,
  trackInfo,
  url,
  useViewTime,
  visibilityTimeExtent,
  visible = true,
  opacity = 1,
  map,
  view,
  onLoad
}: GeoJSONLayerProps) {
  const { Module } = useEsriModule<EsriGeoJSONLayer>(
    () => import('@arcgis/core/layers/GeoJSONLayer'),
    'GeoJSONLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      attributeTableTemplate,
      blendMode,
      copyright,
      customParameters,
      definitionExpression,
      displayField,
      displayFilterEnabled,
      displayFilterInfo,
      editingEnabled,
      effect,
      elevationInfo,
      featureEffect,
      featureReduction,
      fields,
      geometryType,
      id,
      labelingInfo,
      labelsVisible,
      legendEnabled,
      listMode,
      maxScale,
      minScale,
      objectIdField,
      orderBy,
      outFields,
      persistenceEnabled,
      popupEnabled,
      popupTemplate,
      portalItem,
      refreshInterval,
      renderer,
      screenSizePerspectiveEnabled,
      timeExtent,
      timeInfo,
      timeOffset,
      title,
      trackInfo,
      url,
      useViewTime,
      visibilityTimeExtent,
      visible,
      opacity
    },
    map,
    onLoad
  });

  usePropertyUpdater(layer, {
    attributeTableTemplate: { value: attributeTableTemplate as __esri.AttributeTableTemplate | null, condition: attributeTableTemplate !== undefined },
    blendMode: { value: blendMode },
    copyright: { value: copyright, condition: copyright !== undefined },
    customParameters: { value: customParameters, condition: customParameters !== undefined },
    definitionExpression: { value: definitionExpression, condition: definitionExpression !== undefined },
    displayField: { value: displayField, condition: displayField !== undefined },
    displayFilterEnabled: { value: displayFilterEnabled },
    displayFilterInfo: { value: displayFilterInfo as __esri.DisplayFilterInfo | null, condition: displayFilterInfo !== undefined },
    effect: { value: effect as __esri.Effect | null, condition: effect !== undefined },
    elevationInfo: { value: elevationInfo as __esri.ElevationInfo | null, condition: elevationInfo !== undefined },
    featureEffect: { value: featureEffect as __esri.FeatureEffect | null, condition: featureEffect !== undefined },
    featureReduction: { value: featureReduction as __esri.FeatureReductionBinning | __esri.FeatureReductionCluster | __esri.FeatureReductionSelection | null, condition: featureReduction !== undefined },
    labelingInfo: { value: labelingInfo as __esri.LabelClass[] | null, condition: labelingInfo !== undefined },
    labelsVisible: { value: labelsVisible },
    legendEnabled: { value: legendEnabled },
    listMode: { value: listMode },
    maxScale: { value: maxScale },
    minScale: { value: minScale },
    orderBy: { value: orderBy as __esri.OrderByInfo[] | null, condition: orderBy !== undefined },
    outFields: { value: outFields, condition: outFields !== undefined },
    persistenceEnabled: { value: persistenceEnabled },
    popupEnabled: { value: popupEnabled },
    popupTemplate: { value: popupTemplate as __esri.PopupTemplate | null, condition: popupTemplate !== undefined },
    refreshInterval: { value: refreshInterval, condition: refreshInterval !== undefined },
    renderer: { value: renderer as __esri.RendererUnion | null, condition: renderer !== undefined },
    screenSizePerspectiveEnabled: { value: screenSizePerspectiveEnabled },
    timeExtent: { value: timeExtent as __esri.TimeExtent | null, condition: timeExtent !== undefined },
    timeOffset: { value: timeOffset as __esri.TimeInterval | null, condition: timeOffset !== undefined },
    title: { value: title },
    trackInfo: { value: trackInfo as __esri.TrackInfo | null, condition: trackInfo !== undefined },
    useViewTime: { value: useViewTime },
    visibilityTimeExtent: { value: visibilityTimeExtent as __esri.TimeExtent | null, condition: visibilityTimeExtent !== undefined },
    visible: { value: visible },
    opacity: { value: opacity }
  });

  return null;
}

export default GeoJSONLayer;
