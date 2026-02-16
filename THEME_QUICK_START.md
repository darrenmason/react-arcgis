# Theme Quick Start

React ArcGIS supports light/dark mode for both Calcite and ArcGIS components out of the box!

## Installation

```bash
npm install react-arcgis @esri/calcite-components @esri/calcite-components-react
```

## Basic Usage

### 1. Import Calcite CSS

```tsx
import '@esri/calcite-components/dist/calcite/calcite.css';
```

### 2. Use the Theme Hook

```tsx
import { useState } from 'react';
import { Map, MapView, useTheme, CalciteButton, CalciteShell } from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // This single hook manages both Calcite and ArcGIS themes
  useTheme(theme);

  return (
    <CalciteShell>
      <CalciteButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle {theme === 'light' ? '🌙' : '☀️'}
      </CalciteButton>
      
      <Map basemap="topo-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
    </CalciteShell>
  );
}
```

## Auto Mode (System Preference)

```tsx
import { useTheme } from 'react-arcgis';

function App() {
  // Automatically follows the user's system dark/light mode preference
  useTheme('auto');
  
  return <YourApp />;
}
```

## Available Hooks

| Hook | Purpose |
|------|---------|
| `useTheme(mode)` | ✅ **Recommended** - Controls both Calcite and ArcGIS |
| `useCalciteMode(mode)` | Controls only Calcite components |
| `useArcGISTheme(theme)` | Controls only ArcGIS maps/widgets |
| `useSystemTheme()` | Returns current system preference ('light' \| 'dark') |

## Theme Modes

- **`'light'`** - Light mode for everything
- **`'dark'`** - Dark mode for everything  
- **`'auto'`** - Follows system preference (light/dark)

## Complete Example

```tsx
import { useState } from 'react';
import {
  Map,
  MapView,
  useTheme,
  useSystemTheme,
  CalciteShell,
  CalciteShellPanel,
  CalcitePanel,
  CalciteButton
} from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

function App() {
  const [mode, setMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const systemTheme = useSystemTheme();
  
  useTheme(mode);

  const effectiveTheme = mode === 'auto' ? systemTheme : mode;
  const basemap = effectiveTheme === 'dark' ? 'dark-gray-vector' : 'topo-vector';

  return (
    <CalciteShell>
      <CalciteShellPanel slot="panel-start">
        <CalcitePanel heading="Theme Settings">
          <CalciteButton onClick={() => setMode('light')}>☀️ Light</CalciteButton>
          <CalciteButton onClick={() => setMode('dark')}>🌙 Dark</CalciteButton>
          <CalciteButton onClick={() => setMode('auto')}>🔄 Auto</CalciteButton>
          <p>Current: {mode} (Effective: {effectiveTheme})</p>
        </CalcitePanel>
      </CalciteShellPanel>
      
      <Map basemap={basemap}>
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
    </CalciteShell>
  );
}

export default App;
```

## Important Notes

### ❌ Don't Hardcode Theme in HTML

Remove any hardcoded ArcGIS theme from your `index.html`:

```html
<!-- ❌ Remove this -->
<link rel="stylesheet" href="https://js.arcgis.com/4.28/@arcgis/core/assets/esri/themes/light/main.css">

<!-- ✅ Let the hooks manage the theme -->
```

### ✅ The hooks dynamically inject the correct theme CSS

The `useTheme` and `useArcGISTheme` hooks automatically load the appropriate ArcGIS theme CSS, so you don't need to include it in your HTML.

## Persistent Theme (LocalStorage)

```tsx
import { useState, useEffect } from 'react';
import { useTheme } from 'react-arcgis';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as any) || 'light';
  });

  useTheme(theme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

## Examples

Check out these example files:
- `example/src/ThemeExample.tsx` - Complete theme switching demo
- `example/src/App.tsx` - Basic usage
- `example/src/CalciteExample.tsx` - Calcite with theming

## Full Documentation

See [THEMING.md](./THEMING.md) for:
- Advanced configuration
- TypeScript types
- Context providers
- Custom theme logic
- Troubleshooting
- Best practices

## Support

- **Calcite Modes:** `'light'`, `'dark'`, `'auto'`
- **ArcGIS Themes:** `'light'`, `'dark'`
- **Browser Support:** Modern browsers with CSS custom properties
- **System Preference:** Uses `prefers-color-scheme` media query
