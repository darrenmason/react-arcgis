# Calcite Components Integration

React ArcGIS includes full support for Esri's Calcite Design System through `@esri/calcite-components-react`. All Calcite web components are available as React-friendly components.

## Installation

Calcite components are included as dependencies of `react-arcgis`, so no additional installation is needed. However, you must import the Calcite CSS:

```tsx
import '@esri/calcite-components/dist/calcite/calcite.css';
```

## Usage

Import Calcite components directly from `react-arcgis`:

```tsx
import {
  Map,
  MapView,
  // Calcite components
  CalciteShell,
  CalcitePanel,
  CalciteButton,
  CalciteSwitch,
  CalciteSlider
} from 'react-arcgis';
```

## Quick Example

```tsx
import React, { useState } from 'react';
import {
  Map,
  MapView,
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteButton,
  CalciteSwitch
} from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

function App() {
  const [layerVisible, setLayerVisible] = useState(true);

  return (
    <CalciteShell>
      <CalciteShellPanel slot="panel-start">
        <CalcitePanel heading="Controls">
          <CalciteSwitch
            checked={layerVisible}
            onCalciteSwitchChange={(e) => setLayerVisible(e.target.checked)}
          >
            Show Layer
          </CalciteSwitch>
          
          <CalciteButton>Zoom In</CalciteButton>
        </CalcitePanel>
      </CalciteShellPanel>

      <Map basemap="topo-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
    </CalciteShell>
  );
}
```

## Common Patterns

### App Shell with Panels

Create a professional mapping application layout:

```tsx
import {
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteActionBar,
  CalciteAction
} from 'react-arcgis';

function MapApp() {
  return (
    <CalciteShell style={{ height: '100vh' }}>
      <CalciteShellPanel slot="panel-start">
        <CalciteActionBar slot="action-bar">
          <CalciteAction text="Layers" icon="layers" />
          <CalciteAction text="Basemap" icon="basemap" />
          <CalciteAction text="Legend" icon="legend" />
        </CalciteActionBar>
        
        <CalcitePanel heading="Layers">
          {/* Layer controls */}
        </CalcitePanel>
      </CalciteShellPanel>

      {/* Map content */}
      <Map basemap="streets-vector">
        <MapView center={[-98.5795, 39.8283]} zoom={4} />
      </Map>
    </CalciteShell>
  );
}
```

### Map Controls

Create interactive map controls using Calcite components:

```tsx
import { useView } from 'react-arcgis';

function MapControls() {
  const { view } = useView();
  const [opacity, setOpacity] = useState(1);

  return (
    <CalciteBlock heading="Layer Controls" collapsible>
      <CalciteLabel>
        Opacity
        <CalciteSlider
          min={0}
          max={1}
          step={0.1}
          value={opacity}
          onCalciteSliderChange={(e) => setOpacity(e.target.value)}
        />
      </CalciteLabel>

      <CalciteButton
        onClick={() => view.goTo({ zoom: view.zoom + 1 })}
        iconStart="plus"
      >
        Zoom In
      </CalciteButton>
    </CalciteBlock>
  );
}
```

### Modal Dialogs

Use Calcite modals for user interactions:

```tsx
function FeatureDetails() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CalciteButton onClick={() => setOpen(true)}>
        Show Details
      </CalciteButton>

      <CalciteModal
        open={open}
        onCalciteModalClose={() => setOpen(false)}
      >
        <div slot="header">Feature Information</div>
        <div slot="content">
          {/* Feature details */}
        </div>
        <CalciteButton slot="primary" onClick={() => setOpen(false)}>
          Close
        </CalciteButton>
      </CalciteModal>
    </>
  );
}
```

### Alerts and Notifications

Show feedback to users:

```tsx
function MapWithAlerts() {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <CalciteAlert
        open={alertOpen}
        kind="success"
        icon="check-circle"
        autoClose
        autoCloseDuration="fast"
        onCalciteAlertClose={() => setAlertOpen(false)}
      >
        <div slot="title">Success</div>
        <div slot="message">Layer loaded successfully!</div>
      </CalciteAlert>

      {/* Map content */}
    </>
  );
}
```

### Form Controls

Build forms with Calcite inputs:

```tsx
function SearchForm() {
  const [query, setQuery] = useState('');

  return (
    <CalcitePanel heading="Search">
      <CalciteLabel>
        Location
        <CalciteInput
          placeholder="Enter address..."
          value={query}
          onCalciteInputInput={(e) => setQuery(e.target.value)}
        />
      </CalciteLabel>

      <CalciteLabel>
        Filter by
        <CalciteSelect>
          <CalciteOption value="all">All Features</CalciteOption>
          <CalciteOption value="points">Points</CalciteOption>
          <CalciteOption value="polygons">Polygons</CalciteOption>
        </CalciteSelect>
      </CalciteLabel>

      <CalciteButton type="submit" width="full">
        Search
      </CalciteButton>
    </CalcitePanel>
  );
}
```

### Loading States

Show loading indicators:

```tsx
function MapWithLoader() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <CalciteLoader scale="l" text="Loading map..." />
      )}
      
      <Map basemap="streets-vector">
        <MapView
          center={[-118.805, 34.027]}
          zoom={13}
          onViewReady={() => setLoading(false)}
        />
      </Map>
    </>
  );
}
```

## Available Components

All Calcite components are available. Here are the most commonly used ones:

### Layout Components
- `CalciteShell` - Application shell
- `CalciteShellPanel` - Side panels
- `CalcitePanel` - Content panels
- `CalciteBlock` - Content blocks
- `CalciteFlow` - Multi-step flows

### Action Components
- `CalciteActionBar` - Vertical action bar
- `CalciteActionPad` - Grid of actions
- `CalciteAction` - Single action button

### Form Components
- `CalciteButton` - Buttons
- `CalciteInput` - Text inputs
- `CalciteInputNumber` - Number inputs
- `CalciteTextArea` - Multi-line text
- `CalciteSelect` - Dropdowns
- `CalciteCheckbox` - Checkboxes
- `CalciteRadioButton` - Radio buttons
- `CalciteSwitch` - Toggle switches
- `CalciteSlider` - Range sliders
- `CalciteCombobox` - Searchable select
- `CalciteDatePicker` - Date picker

### Feedback Components
- `CalciteAlert` - Alert messages
- `CalciteNotice` - Inline notices
- `CalciteModal` - Modal dialogs
- `CalciteTooltip` - Tooltips
- `CalciteLoader` - Loading indicators
- `CalciteProgress` - Progress bars

### Navigation Components
- `CalciteTabs` - Tab navigation
- `CalciteNavigation` - Top navigation bar
- `CalciteMenu` - Dropdown menus

### Data Components
- `CalciteList` - Lists
- `CalciteCard` - Cards
- `CalciteTree` - Tree view
- `CalciteValueList` - Reorderable lists
- `CalcitePagination` - Pagination

### Other Components
- `CalciteIcon` - Icons
- `CalciteChip` - Tags/chips
- `CalciteAvatar` - User avatars
- `CalcitePopover` - Popovers
- `CalciteDropdown` - Dropdowns
- `CalciteRating` - Star ratings

## TypeScript Support

All Calcite components are fully typed. Import types as needed:

```tsx
import type {
  CalciteButtonCustomEvent,
  CalciteSwitchCustomEvent,
  CalciteSelectCustomEvent
} from 'react-arcgis';

function MyComponent() {
  const handleChange = (event: CalciteSwitchCustomEvent<void>) => {
    console.log('Checked:', event.target.checked);
  };

  return <CalciteSwitch onCalciteSwitchChange={handleChange} />;
}
```

## Event Handling

Calcite events follow a naming convention: `onCalcite[Component][EventName]`

```tsx
// Switch change event
<CalciteSwitch onCalciteSwitchChange={(e) => {...}} />

// Button click (uses standard onClick)
<CalciteButton onClick={() => {...}} />

// Slider change
<CalciteSlider onCalciteSliderChange={(e) => {...}} />

// Select change
<CalciteSelect onCalciteSelectChange={(e) => {...}} />

// Input events
<CalciteInput
  onCalciteInputInput={(e) => {...}}    // As user types
  onCalciteInputChange={(e) => {...}}   // On blur
/>
```

## Styling

Calcite components use CSS custom properties for theming:

```css
:root {
  --calcite-ui-brand: #007ac2;
  --calcite-ui-brand-hover: #00619b;
  --calcite-ui-brand-press: #004874;
  --calcite-ui-text-1: #151515;
  --calcite-ui-text-2: #4a4a4a;
  --calcite-ui-background: #ffffff;
}
```

Or use Calcite's built-in mode:

```tsx
<CalciteShell theme="dark">
  {/* Dark theme content */}
</CalciteShell>
```

## Best Practices

1. **Always import Calcite CSS**: Required for proper styling
2. **Use CalciteShell**: Provides consistent layout structure
3. **Leverage slots**: Many components use slots for flexible content placement
4. **Handle events properly**: Use the correct event handlers (onCalcite...)
5. **Check component docs**: [Calcite Design System Docs](https://developers.arcgis.com/calcite-design-system/components/)

## Resources

- [Calcite Design System](https://developers.arcgis.com/calcite-design-system/)
- [Calcite Components](https://developers.arcgis.com/calcite-design-system/components/)
- [Calcite Icons](https://developers.arcgis.com/calcite-design-system/icons/)
- [Calcite Tutorials](https://developers.arcgis.com/calcite-design-system/tutorials/)
