import type { LayerProps } from '../../types';
import type EsriCSVLayer from '@arcgis/core/layers/CSVLayer';
import { useEsriModule } from '../../hooks/useEsriModule';
import { useLayer } from '../../hooks/useLayer';
import { usePropertyUpdater } from '../../hooks/usePropertyUpdater';

export interface CSVLayerProps extends LayerProps {
  attributeTableTemplate?: __esri.AttributeTableTemplateProperties | null;
  blendMode?: __esri.CSVLayerProperties['blendMode'];
  copyright?: string | null;
  customParameters?: Record<string, string> | null;
  dateFieldsTimeZone?: string | null;
  definitionExpression?: string | null;
  delimiter?: string;
  displayField?: string | null;
  displayFilterEnabled?: boolean;
  displayFilterInfo?: __esri.DisplayFilterInfoProperties | null;
  effect?: __esri.Effect | string | null;
  elevationInfo?: __esri.ElevationInfoProperties | null;
  featureEffect?: __esri.FeatureEffectProperties | null;
  featureReduction?: __esri.FeatureReductionBinning | __esri.FeatureReductionCluster | __esri.FeatureReductionSelection | null;
  fields?: __esri.Field[];
  id?: string;
  labelingInfo?: __esri.LabelClassProperties[] | null;
  labelsVisible?: boolean;
  latitudeField?: string | null;
  longitudeField?: string | null;
  legendEnabled?: boolean;
  listMode?: 'show' | 'hide' | 'hide-children';
  maxScale?: number;
  minScale?: number;
  objectIdField?: string;
  orderBy?: __esri.OrderByInfoProperties[] | null;
  outFields?: string[] | null;
  persistenceEnabled?: boolean;
  popupEnabled?: boolean;
  popupTemplate?: __esri.PopupTemplateProperties | null;
  portalItem?: __esri.PortalItemProperties;
  refreshInterval?: number;
  renderer?: __esri.RendererProperties | null;
  screenSizePerspectiveEnabled?: boolean;
  spatialReference?: __esri.SpatialReferenceProperties;
  timeExtent?: __esri.TimeExtentProperties | null;
  timeInfo?: __esri.TimeInfoProperties | null;
  timeOffset?: __esri.TimeIntervalProperties | null;
  title?: string | null;
  trackInfo?: __esri.TrackInfoProperties | null;
  url?: string | null;
  useViewTime?: boolean;
  visibilityTimeExtent?: __esri.TimeExtentProperties | null;
}

export function CSVLayer({
  attributeTableTemplate,
  blendMode,
  copyright,
  customParameters,
  dateFieldsTimeZone,
  definitionExpression,
  delimiter,
  displayField,
  displayFilterEnabled,
  displayFilterInfo,
  effect,
  elevationInfo,
  featureEffect,
  featureReduction,
  fields,
  id,
  labelingInfo,
  labelsVisible,
  latitudeField,
  longitudeField,
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
  spatialReference,
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
}: CSVLayerProps) {
  const { Module } = useEsriModule<EsriCSVLayer>(
    () => import('@arcgis/core/layers/CSVLayer'),
    'CSVLayer'
  );

  const layer = useLayer({
    Module,
    config: {
      attributeTableTemplate,
      blendMode,
      copyright,
      customParameters,
      dateFieldsTimeZone,
      definitionExpression,
      delimiter,
      displayField,
      displayFilterEnabled,
      displayFilterInfo,
      effect,
      elevationInfo,
      featureEffect,
      featureReduction,
      fields,
      id,
      labelingInfo,
      labelsVisible,
      latitudeField,
      longitudeField,
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
      spatialReference,
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

export default CSVLayer;
