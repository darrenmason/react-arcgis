# Widget Component Library

React ArcGIS provides **18 widget components** that can be used declaratively in JSX. All widgets automatically manage their lifecycle, positioning, and cleanup.

## Quick Reference

| Category | Widgets | Count |
|----------|---------|-------|
| **Navigation & View** | Zoom, Home, Compass, Locate, Track, Fullscreen | 6 |
| **Information** | LayerList, Legend, ScaleBar | 3 |
| **Search** | Search | 1 |
| **Basemap** | BasemapGallery, BasemapToggle | 2 |
| **Editing** | Editor, Sketch | 2 |
| **Data & Analysis** | FeatureTable, TimeSlider, Measurement, HistogramRangeSlider, ElevationProfile | 5 |
| **Advanced** | Print, Directions, CoordinateConversion, Swipe | 4 |
| **Utility** | Expand | 1 |
| **TOTAL** | | **18** |

---

## Navigation & View Control

### Zoom

Zoom in/out buttons.

```tsx
<MapView>
  <Zoom position="top-left" layout="vertical" />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-left')
- `layout` - 'vertical' or 'horizontal'

---

### Home

Return to initial viewpoint.

```tsx
<MapView>
  <Home position="top-left" />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-left')
- `viewpoint` - Custom home viewpoint

---

### Compass

Shows map rotation, click to reset.

```tsx
<MapView rotation={45}>
  <Compass position="top-left" />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-left')

---

### Locate

One-time geolocation.

```tsx
<MapView>
  <Locate
    position="top-left"
    useHeadingEnabled={true}
    onLocate={(event) => console.log('Location:', event.position)}
    onLocateError={(error) => console.error(error)}
  />
</MapView>
```

**Props:**
- `position` - UI position
- `useHeadingEnabled` - Use device heading
- `goToLocationEnabled` - Navigate to location
- `rotationEnabled` - Rotate map to heading
- `scale` - Target scale
- `onLocate` - Location found callback
- `onLocateError` - Error callback

---

### Track

Continuous GPS tracking.

```tsx
<MapView>
  <Track
    position="top-left"
    useHeadingEnabled={true}
    rotationEnabled={true}
    onTrack={(event) => console.log('Tracking:', event.position)}
  />
</MapView>
```

**Props:**
- `position` - UI position
- `useHeadingEnabled` - Use device heading
- `rotationEnabled` - Rotate map while tracking
- `onTrack` - Position update callback
- `onTrackError` - Error callback

---

### Fullscreen

Toggle fullscreen mode.

```tsx
<MapView>
  <Fullscreen position="top-right" />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-right')
- `element` - Element to make fullscreen

---

## Information & Display

### LayerList

Table of contents for layers.

```tsx
<MapView>
  <FeatureLayer url="..." />
  <TileLayer url="..." />
  
  <LayerList
    position="top-right"
    selectionEnabled={true}
    visibilityAppearance="checkbox"
    listItemCreatedFunction={(event) => {
      const item = event.item;
      if (item.layer.type === "feature") {
        item.panel = {
          content: "legend",
          open: true
        };
      }
    }}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-right')
- `selectionEnabled` - Allow layer selection
- `visibilityAppearance` - 'default' or 'checkbox'
- `listItemCreatedFunction` - Customize list items

---

### Legend

Map legend showing layer symbology.

```tsx
<MapView>
  <FeatureLayer url="..." />
  
  <Legend
    position="bottom-right"
    style="card"
    respectLayerVisibility={true}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'bottom-right')
- `style` - 'classic' or 'card'
- `respectLayerVisibility` - Hide legends for invisible layers
- `layerInfos` - Custom layer info

---

### ScaleBar

Display map scale.

```tsx
<MapView>
  <ScaleBar
    position="bottom-left"
    unit="dual"
    style="ruler"
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'bottom-left')
- `unit` - 'metric', 'imperial', or 'dual'
- `style` - 'ruler' or 'line'

---

## Search & Location

### Search

Search and geocoding widget.

```tsx
<MapView>
  <Search
    position="top-right"
    includeDefaultSources={true}
    searchAllEnabled={true}
    suggestionsEnabled={true}
    sources={[
      {
        layer: featureLayer,
        searchFields: ["NAME"],
        displayField: "NAME",
        exactMatch: false,
        outFields: ["*"],
        placeholder: "Search features"
      }
    ]}
    onSearchComplete={(event) => {
      console.log('Results:', event.results);
    }}
    onSearchClear={() => {
      console.log('Search cleared');
    }}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-right')
- `sources` - Search sources
- `includeDefaultSources` - Include world geocoder
- `searchAllEnabled` - Search all sources
- `suggestionsEnabled` - Show suggestions
- `locationEnabled` - Use current location
- `popupEnabled` - Open popup on selection
- `onSearchComplete` - Search complete callback
- `onSearchClear` - Search clear callback

---

## Basemap Control

### BasemapGallery

Basemap selector gallery.

```tsx
<MapView>
  <BasemapGallery
    position="top-right"
    expanded={false}
    source={{
      portal: {
        url: "https://www.arcgis.com"
      },
      query: "basemap"
    }}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-right')
- `source` - Basemap source (portal or local)
- `expanded` - Initially expanded

---

### BasemapToggle

Toggle between two basemaps.

```tsx
<Map basemap="topo-vector">
  <MapView>
    <BasemapToggle
      position="bottom-left"
      nextBasemap="satellite"
    />
  </MapView>
</Map>
```

**Props:**
- `position` - UI position (default: 'bottom-left')
- `nextBasemap` - Alternate basemap

---

## Editing & Drawing

### Editor

Feature editing widget.

```tsx
<MapView>
  <FeatureLayer url="..." onLoad={setLayer} />
  
  <Editor
    position="top-right"
    layerInfos={[
      {
        layer: featureLayer,
        formTemplate: {
          elements: [
            {
              type: "field",
              fieldName: "name",
              label: "Name"
            }
          ]
        },
        enabled: true,
        addEnabled: true,
        updateEnabled: true,
        deleteEnabled: true
      }
    ]}
    allowedWorkflows={["create", "update"]}
    snappingOptions={{
      enabled: true,
      featureSources: [{ layer: featureLayer }]
    }}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-right')
- `layerInfos` - Layer editing configuration
- `snappingOptions` - Snapping settings
- `allowedWorkflows` - ['create', 'update']

---

### Sketch

Drawing tools widget.

```tsx
<MapView>
  <GraphicsLayer onLoad={setGraphicsLayer} />
  
  <Sketch
    layer={graphicsLayer}
    position="top-right"
    availableCreateTools={["point", "polyline", "polygon", "rectangle", "circle"]}
    creationMode="update"
    onCreate={(event) => {
      if (event.state === 'complete') {
        console.log('Created:', event.graphic);
      }
    }}
    onUpdate={(event) => {
      if (event.state === 'complete') {
        console.log('Updated:', event.graphics);
      }
    }}
    onDelete={(event) => {
      console.log('Deleted:', event.graphics);
    }}
  />
</MapView>
```

**Props:**
- `layer` - Graphics layer for drawings
- `position` - UI position (default: 'top-right')
- `availableCreateTools` - Available drawing tools
- `creationMode` - 'update' or 'single'
- `onCreate` - Create event callback
- `onUpdate` - Update event callback
- `onDelete` - Delete event callback

---

## Data & Analysis

### FeatureTable

Tabular feature display.

```tsx
<MapView>
  <FeatureLayer url="..." onLoad={setLayer} />
  
  <FeatureTable
    layer={featureLayer}
    container="tableDiv"
    multiSortEnabled={true}
    visibleElements={{
      header: true,
      menu: true,
      menuItems: {
        clearSelection: true,
        refreshData: true,
        toggleColumns: true,
        zoomToSelection: true
      }
    }}
  />
</MapView>

<div id="tableDiv" style={{ height: '300px' }} />
```

**Props:**
- `layer` - Feature layer to display
- `container` - Container element or ID
- `multiSortEnabled` - Allow multi-column sorting
- `visibleElements` - Control UI elements
- `tableTemplate` - Column configuration

---

### TimeSlider

Temporal data visualization.

```tsx
<MapView>
  <FeatureLayer
    url="..."
    timeInfo={{...}}
    timeExtent={{...}}
  />
  
  <TimeSlider
    position="bottom"
    mode="time-window"
    playRate={1000}
    loop={true}
    onTimeExtentChange={(event) => {
      console.log('Time range:', event.timeExtent);
    }}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'bottom')
- `mode` - 'instant', 'time-window', 'cumulative-from-start', 'cumulative-from-end'
- `playRate` - Animation speed (ms)
- `loop` - Loop animation
- `fullTimeExtent` - Full time range
- `stops` - Time stops
- `onTimeExtentChange` - Time change callback

---

### Measurement

Measure distance and area.

```tsx
<MapView>
  <Measurement
    position="top-right"
    activeTool="distance"
    linearUnit="miles"
    areaUnit="square-miles"
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-right')
- `activeTool` - 'distance' or 'area'
- `linearUnit` - Distance unit
- `areaUnit` - Area unit

---

### HistogramRangeSlider

Filter data with histogram visualization.

```tsx
<div id="slider-container" style={{ width: '300px', height: '150px' }} />

<HistogramRangeSlider
  container="slider-container"
  min={0}
  max={1000000}
  values={[100000, 900000]}
  bins={histogramData}
  rangeType="equal"
  onValueChange={(values) => {
    setDefinitionExpression(`POP BETWEEN ${values[0]} AND ${values[1]}`);
  }}
/>
```

**Props:**
- `container` - Container element or ID
- `min/max` - Data range
- `values` - Selected range
- `bins` - Histogram data
- `rangeType` - Range selection type
- `onValueChange` - Value change callback

---

### ElevationProfile

Display elevation profiles (3D).

```tsx
<SceneView>
  <ElevationProfile
    position="bottom"
    unit="metric"
    visibleElements={{
      legend: true,
      sketchButton: true,
      selectButton: true
    }}
  />
</SceneView>
```

**Props:**
- `position` - UI position (default: 'bottom')
- `unit` - 'metric' or 'imperial'
- `profiles` - Custom profiles
- `visibleElements` - Control UI elements

---

## Advanced Tools

### Print

Export and print maps.

```tsx
<MapView>
  <Print
    position="top-right"
    printServiceUrl="https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    allowedFormats={["pdf", "png32", "jpg"]}
    allowedLayouts={["letter-ansi-a-landscape", "letter-ansi-a-portrait"]}
    templateOptions={{
      title: "My Map",
      author: "John Doe",
      copyright: "© 2026"
    }}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-right')
- `printServiceUrl` - Print service URL
- `templateOptions` - Print template options
- `allowedFormats` - Allowed export formats
- `allowedLayouts` - Allowed layouts

---

### Directions

Turn-by-turn routing.

```tsx
<MapView>
  <Directions
    position="top-left"
    routeServiceUrl="https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
    maxStops={10}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-left')
- `routeServiceUrl` - Routing service URL
- `maxStops` - Maximum number of stops
- `searchProperties` - Search configuration

---

### CoordinateConversion

Convert between coordinate systems.

```tsx
<MapView>
  <CoordinateConversion
    position="bottom-right"
    formats={[
      { name: "DD", ... },
      { name: "DMS", ... },
      { name: "MGRS", ... }
    ]}
  />
</MapView>
```

**Props:**
- `position` - UI position (default: 'bottom-right')
- `formats` - Coordinate formats
- `conversions` - Available conversions

---

### Swipe

Compare layers side-by-side.

```tsx
<MapView>
  <FeatureLayer url="..." onLoad={setLayer1} />
  <FeatureLayer url="..." onLoad={setLayer2} />
  
  <Swipe
    leadingLayers={[layer1]}
    trailingLayers={[layer2]}
    direction="horizontal"
    position={50}
    onPositionChange={(pos) => console.log('Swipe at:', pos)}
  />
</MapView>
```

**Props:**
- `leadingLayers` - Left/top layers
- `trailingLayers` - Right/bottom layers
- `direction` - 'horizontal' or 'vertical'
- `position` - Swipe position percentage (0-100)
- `disabled` - Disable interaction
- `onPositionChange` - Position change callback

---

## Utility

### Expand

Expandable container for custom content.

```tsx
<MapView>
  <Expand
    position="top-right"
    expandIcon="layers"
    expandTooltip="Layer Controls"
    mode="floating"
  >
    <div style={{ padding: '1rem' }}>
      <h3>Custom Content</h3>
      <p>Any React components here!</p>
      <LayerList />
    </div>
  </Expand>
</MapView>
```

**Props:**
- `position` - UI position (default: 'top-right')
- `content` - Widget or HTML content
- `children` - React children (alternative to content)
- `expanded` - Initially expanded
- `expandIcon` - Icon name
- `expandTooltip` - Tooltip text
- `mode` - 'floating', 'drawer', or 'auto'
- `group` - Group name for collapsing
- `onExpand` - Expand callback
- `onCollapse` - Collapse callback

---

## Usage Patterns

### Basic Widget Setup

```tsx
<Map basemap="gray-vector">
  <MapView center={[-118, 34]} zoom={10}>
    {/* Layers */}
    <FeatureLayer url="..." />
    
    {/* Widgets */}
    <Zoom position="top-left" />
    <Home position="top-left" />
    <Search position="top-right" />
    <LayerList position="top-right" />
    <Legend position="bottom-right" />
    <ScaleBar position="bottom-left" />
  </MapView>
</Map>
```

### Complete UI

```tsx
function CompleteMap() {
  const [graphicsLayer, setGraphicsLayer] = useState(null);
  
  return (
    <Map basemap="topo-vector">
      <MapView center={[-98.5795, 39.8283]} zoom={4}>
        {/* Layers */}
        <FeatureLayer url="..." />
        <GraphicsLayer onLoad={setGraphicsLayer} />
        
        {/* Navigation */}
        <Zoom position="top-left" />
        <Home position="top-left" />
        <Compass position="top-left" />
        <Locate position="top-left" />
        <Fullscreen position="top-right" />
        
        {/* Information */}
        <Search position="top-right" />
        <LayerList position="top-right" />
        <Legend position="bottom-right" />
        <ScaleBar position="bottom-left" unit="dual" />
        
        {/* Basemap */}
        <BasemapToggle position="bottom-left" nextBasemap="satellite" />
        
        {/* Editing */}
        {graphicsLayer && (
          <Sketch
            layer={graphicsLayer}
            position="top-right"
            availableCreateTools={["point", "polyline", "polygon"]}
          />
        )}
      </MapView>
    </Map>
  );
}
```

### Conditional Widgets

```tsx
function MapWithControls() {
  const [showTools, setShowTools] = useState(false);
  
  return (
    <MapView>
      <FeatureLayer url="..." />
      
      {/* Always visible */}
      <Zoom position="top-left" />
      <Home position="top-left" />
      
      {/* Conditional */}
      {showTools && (
        <>
          <Sketch layer={graphicsLayer} />
          <Measurement activeTool="distance" />
        </>
      )}
    </MapView>
  );
}
```

### Custom Expand Content

```tsx
<MapView>
  <Expand
    position="top-right"
    expandIcon="layer"
    expandTooltip="Layer Controls"
  >
    <CalcitePanel heading="Layer Controls">
      <CalciteBlock heading="Visibility">
        {layers.map(layer => (
          <CalciteLabel key={layer.id}>
            {layer.title}
            <CalciteSwitch
              checked={layer.visible}
              onChange={() => layer.visible = !layer.visible}
            />
          </CalciteLabel>
        ))}
      </CalciteBlock>
    </CalcitePanel>
  </Expand>
</MapView>
```

### Multiple Expands with Groups

```tsx
<MapView>
  <Expand
    position="top-right"
    expandIcon="layers"
    expandTooltip="Layers"
    group="widgets"
  >
    <LayerList />
  </Expand>
  
  <Expand
    position="top-right"
    expandIcon="legend"
    expandTooltip="Legend"
    group="widgets"
  >
    <Legend />
  </Expand>
  
  {/* Only one expand in "widgets" group can be open at a time */}
</MapView>
```

---

## Component vs Hook

React ArcGIS provides both component and hook versions for flexibility:

### Use Components When:
- ✅ Declarative JSX is preferred
- ✅ Widget is always visible
- ✅ Simple configuration
- ✅ Better for readability

```tsx
<MapView>
  <LayerList position="top-right" />
  <Legend position="bottom-right" />
</MapView>
```

### Use Hooks When:
- ✅ Need programmatic control
- ✅ Conditional logic required
- ✅ Access to widget instance needed
- ✅ Complex event handling

```tsx
function MapWidgets() {
  const { view } = useView();
  const { widget, loading } = useLayerList({ view, position: 'top-right' });
  
  useEffect(() => {
    if (widget) {
      // Access widget methods
      widget.triggerAction(...);
    }
  }, [widget]);
  
  return null;
}
```

**Both approaches work together!** Use whichever feels more natural for your use case.

---

## Common Props

All widget components support:

```tsx
interface WidgetProps {
  view?: MapView | SceneView;  // View (auto-provided from context)
  position?: string;           // UI position
  onLoad?: (widget) => void;   // Widget loaded callback
}
```

---

## Position Reference

Common position values:

- `"top-left"` - Top left corner
- `"top-right"` - Top right corner
- `"bottom-left"` - Bottom left corner
- `"bottom-right"` - Bottom right corner
- `"top"` - Top center
- `"bottom"` - Bottom center
- `"manual"` - No automatic positioning

Or use object:

```tsx
position={{
  position: "top-right",
  index: 0
}}
```

---

## TypeScript Support

```tsx
import type {
  LayerListProps,
  LegendProps,
  SearchProps,
  SketchProps
} from 'react-arcgis';
```

---

## Performance Tips

1. **Use Expand** for infrequently used widgets
2. **Limit visible widgets** - Too many slow down UI
3. **Lazy load** - Render widgets conditionally
4. **Disable when hidden** - Set `disabled` prop if available

---

## Complete Example

See [WidgetLibraryExample.tsx](./example/src/WidgetLibraryExample.tsx) for a working demo with all widgets.

---

**18 Widget Components - Complete UI Toolkit** ✅
