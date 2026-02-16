# Calcite Design Patterns for Mapping Apps

Common UI patterns combining Calcite components with React ArcGIS.

## Pattern 1: Application Shell with Action Bar

A professional mapping application layout with side panel and action bar.

```tsx
import {
  Map,
  MapView,
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteActionBar,
  CalciteAction
} from 'react-arcgis';

function MapApp() {
  const [activePanel, setActivePanel] = useState('layers');

  return (
    <CalciteShell>
      <CalciteShellPanel slot="panel-start">
        <CalciteActionBar slot="action-bar">
          <CalciteAction
            text="Layers"
            icon="layers"
            active={activePanel === 'layers'}
            onClick={() => setActivePanel('layers')}
          />
          <CalciteAction
            text="Basemap"
            icon="basemap"
            active={activePanel === 'basemap'}
            onClick={() => setActivePanel('basemap')}
          />
          <CalciteAction
            text="Settings"
            icon="gear"
            slot="actions-end"
            onClick={() => setActivePanel('settings')}
          />
        </CalciteActionBar>

        {activePanel === 'layers' && (
          <CalcitePanel heading="Layers">
            {/* Layer controls */}
          </CalcitePanel>
        )}
      </CalciteShellPanel>

      <Map basemap="streets-vector">
        <MapView center={[-98.5795, 39.8283]} zoom={4} />
      </Map>
    </CalciteShell>
  );
}
```

## Pattern 2: Layer List with Toggle

Interactive layer list with visibility controls.

```tsx
function LayerList() {
  const { map } = useView();
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (map) {
      setLayers(map.layers.toArray());
    }
  }, [map]);

  return (
    <CalciteList>
      {layers.map((layer, index) => (
        <CalciteListItem
          key={index}
          label={layer.title}
          description={layer.type}
        >
          <CalciteAction
            slot="actions-end"
            icon={layer.visible ? 'view-visible' : 'view-hide'}
            onClick={() => {
              layer.visible = !layer.visible;
              setLayers([...layers]);
            }}
          />
          <CalciteSlider
            slot="actions-end"
            min={0}
            max={1}
            step={0.1}
            value={layer.opacity}
            onCalciteSliderChange={(e) => {
              layer.opacity = e.target.value;
            }}
          />
        </CalciteListItem>
      ))}
    </CalciteList>
  );
}
```

## Pattern 3: Search with Autocomplete

Search functionality with Calcite input and combobox.

```tsx
function SearchWidget() {
  const { view } = useView();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    // Perform search with ArcGIS API
    const searchResults = await performSearch(query, view);
    setResults(searchResults);
  };

  return (
    <CalciteBlock heading="Search" collapsible>
      <div style={{ padding: '1rem' }}>
        <CalciteLabel>
          Location
          <CalciteInput
            placeholder="Search..."
            value={query}
            icon="search"
            onCalciteInputInput={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </CalciteLabel>

        <CalciteButton
          width="full"
          style={{ marginTop: '0.5rem' }}
          onClick={handleSearch}
        >
          Search
        </CalciteButton>

        {results.length > 0 && (
          <CalciteList style={{ marginTop: '1rem' }}>
            {results.map((result, i) => (
              <CalciteListItem
                key={i}
                label={result.name}
                description={result.address}
                onClick={() => view.goTo(result.location)}
              />
            ))}
          </CalciteList>
        )}
      </div>
    </CalciteBlock>
  );
}
```

## Pattern 4: Measurement Tools

Measurement tools with result display.

```tsx
function MeasurementTools() {
  const { view } = useView();
  const [measuring, setMeasuring] = useState(false);
  const [result, setResult] = useState(null);
  const [tool, setTool] = useState<'distance' | 'area'>('distance');

  const startMeasure = async () => {
    setMeasuring(true);
    // Initialize measurement using ArcGIS API
    const measurement = await startMeasurement(view, tool);
    setResult(measurement);
    setMeasuring(false);
  };

  return (
    <CalcitePanel heading="Measurements">
      <div style={{ padding: '1rem' }}>
        <CalciteLabel>
          Measurement Type
          <CalciteSegmentedControl>
            <CalciteSegmentedControlItem
              value="distance"
              checked={tool === 'distance'}
              onClick={() => setTool('distance')}
            >
              Distance
            </CalciteSegmentedControlItem>
            <CalciteSegmentedControlItem
              value="area"
              checked={tool === 'area'}
              onClick={() => setTool('area')}
            >
              Area
            </CalciteSegmentedControlItem>
          </CalciteSegmentedControl>
        </CalciteLabel>

        <CalciteButton
          width="full"
          style={{ marginTop: '1rem' }}
          onClick={startMeasure}
          loading={measuring}
        >
          Start Measuring
        </CalciteButton>

        {result && (
          <CalciteNotice kind="success" open style={{ marginTop: '1rem' }}>
            <div slot="title">Measurement Complete</div>
            <div slot="message">{result.value} {result.unit}</div>
          </CalciteNotice>
        )}
      </div>
    </CalcitePanel>
  );
}
```

## Pattern 5: Tabbed Panels

Multiple panels organized with tabs.

```tsx
function TabbedPanels() {
  return (
    <CalcitePanel>
      <CalciteTabs>
        <CalciteTabNav slot="title-group">
          <CalciteTabTitle>Layers</CalciteTabTitle>
          <CalciteTabTitle>Legend</CalciteTabTitle>
          <CalciteTabTitle>Bookmarks</CalciteTabTitle>
        </CalciteTabNav>

        <CalciteTab>
          {/* Layers content */}
          <LayerList />
        </CalciteTab>

        <CalciteTab>
          {/* Legend content */}
          <Legend />
        </CalciteTab>

        <CalciteTab>
          {/* Bookmarks content */}
          <Bookmarks />
        </CalciteTab>
      </CalciteTabs>
    </CalcitePanel>
  );
}
```

## Pattern 6: Feature Table with Actions

Display feature attributes in a table with actions.

```tsx
function FeatureTable({ features }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <>
      <CalciteList>
        {features.map((feature, index) => (
          <CalciteListItem
            key={index}
            label={feature.attributes.NAME}
            description={feature.attributes.TYPE}
            onClick={() => setSelectedFeature(feature)}
          >
            <CalciteAction
              slot="actions-end"
              icon="pin"
              text="Zoom to"
              onClick={(e) => {
                e.stopPropagation();
                zoomToFeature(feature);
              }}
            />
            <CalciteAction
              slot="actions-end"
              icon="information"
              text="Details"
              onClick={(e) => {
                e.stopPropagation();
                showDetails(feature);
              }}
            />
          </CalciteListItem>
        ))}
      </CalciteList>

      {selectedFeature && (
        <CalciteModal open onCalciteModalClose={() => setSelectedFeature(null)}>
          <div slot="header">{selectedFeature.attributes.NAME}</div>
          <div slot="content">
            {/* Feature details */}
          </div>
        </CalciteModal>
      )}
    </>
  );
}
```

## Pattern 7: Filter Panel

Advanced filtering interface.

```tsx
function FilterPanel() {
  const [filters, setFilters] = useState({
    category: 'all',
    minValue: 0,
    maxValue: 100,
    showInactive: false
  });

  return (
    <CalcitePanel heading="Filters">
      <div style={{ padding: '1rem' }}>
        <CalciteLabel>
          Category
          <CalciteSelect
            value={filters.category}
            onCalciteSelectChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <CalciteOption value="all">All Categories</CalciteOption>
            <CalciteOption value="type1">Type 1</CalciteOption>
            <CalciteOption value="type2">Type 2</CalciteOption>
          </CalciteSelect>
        </CalciteLabel>

        <CalciteLabel style={{ marginTop: '1rem' }}>
          Value Range: {filters.minValue} - {filters.maxValue}
          <CalciteSlider
            min={0}
            max={100}
            minValue={filters.minValue}
            maxValue={filters.maxValue}
            onCalciteSliderChange={(e) =>
              setFilters({
                ...filters,
                minValue: e.target.minValue,
                maxValue: e.target.maxValue
              })
            }
          />
        </CalciteLabel>

        <CalciteLabel style={{ marginTop: '1rem' }}>
          <CalciteCheckbox
            checked={filters.showInactive}
            onCalciteCheckboxChange={(e) =>
              setFilters({ ...filters, showInactive: e.target.checked })
            }
          />
          Show inactive items
        </CalciteLabel>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <CalciteButton width="full" onClick={() => applyFilters(filters)}>
            Apply
          </CalciteButton>
          <CalciteButton
            width="full"
            appearance="outline"
            onClick={() => setFilters({ category: 'all', minValue: 0, maxValue: 100, showInactive: false })}
          >
            Reset
          </CalciteButton>
        </div>
      </div>
    </CalcitePanel>
  );
}
```

## Pattern 8: Loading States

Handle async operations with loading indicators.

```tsx
function MapWithLoading() {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing map...');

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {loading && (
        <CalciteScrim loading>
          <CalciteLoader text={loadingMessage} />
        </CalciteScrim>
      )}

      <Map basemap="streets-vector">
        <MapView
          center={[-98.5795, 39.8283]}
          zoom={4}
          onViewReady={async (view) => {
            setLoadingMessage('Loading layers...');
            await loadLayers(view);
            setLoading(false);
          }}
        />
      </Map>
    </div>
  );
}
```

## Pattern 9: Toast Notifications

Show non-intrusive notifications.

```tsx
function useToast() {
  const [alerts, setAlerts] = useState([]);

  const showToast = (message, kind = 'success') => {
    const id = Date.now();
    setAlerts([...alerts, { id, message, kind }]);
    setTimeout(() => {
      setAlerts(alerts => alerts.filter(a => a.id !== id));
    }, 3000);
  };

  return { showToast, alerts };
}

function MapWithToasts() {
  const { showToast, alerts } = useToast();

  return (
    <>
      {alerts.map(alert => (
        <CalciteAlert
          key={alert.id}
          kind={alert.kind}
          open
          autoClose
          autoCloseDuration="fast"
        >
          <div slot="message">{alert.message}</div>
        </CalciteAlert>
      ))}

      <Map basemap="streets-vector">
        <MapView
          onClick={() => showToast('Map clicked', 'info')}
          onViewReady={() => showToast('Map ready', 'success')}
        />
      </Map>
    </>
  );
}
```

## Best Practices

1. **Use CalciteShell**: Always wrap your app in CalciteShell for consistent layout
2. **Action Bar Navigation**: Use CalciteActionBar for primary navigation
3. **Collapsible Panels**: Make panels collapsible to maximize map space
4. **Loading States**: Always show loading indicators for async operations
5. **Consistent Spacing**: Use padding and margins consistently (typically 1rem)
6. **Icons**: Leverage Calcite's extensive icon library
7. **Responsive Design**: Test on different screen sizes
8. **Accessibility**: Calcite components are accessible by default, maintain this
9. **Theme Support**: Consider dark mode with CalciteShell's theme prop
10. **Event Handling**: Use proper event handlers (onCalcite...Change)
