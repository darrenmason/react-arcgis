# React ArcGIS Examples

This directory contains example applications demonstrating React ArcGIS usage.

## Examples

### Basic Example (`App.tsx`)
- Simple map with feature layer
- Basic controls (basemap selector, zoom slider)
- Click event handling

### Advanced Example (`AdvancedExample.tsx`)
- Multiple layers
- State management
- Search and basemap gallery widgets
- Population filtering

### Calcite Example (`CalciteExample.tsx`)
- Calcite Shell layout
- Action bar navigation
- Panel-based controls
- Calcite form components

### Calcite Advanced Example (`CalciteAdvancedExample.tsx`)
- Full-featured mapping application
- Layer management panel
- Basemap selector panel
- Drawing tools with SketchViewModel
- Modal dialogs and alerts
- Professional UI with Calcite components

## Running the Examples

```bash
npm install
npm start
```

Then open http://localhost:3000

## Switching Examples

Edit `main.tsx` to import different example components:

```tsx
import App from './App';                          // Basic
import App from './AdvancedExample';              // Advanced
import App from './CalciteExample';               // Calcite
import App from './CalciteAdvancedExample';       // Calcite Advanced
```
