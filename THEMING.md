# Theming Guide

React ArcGIS provides comprehensive theme support for both Calcite Design System and ArcGIS Maps SDK, allowing your applications to support light mode, dark mode, and automatic theme switching based on system preferences.

## Table of Contents

- [Quick Start](#quick-start)
- [Theme Hooks](#theme-hooks)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Advanced Configuration](#advanced-configuration)

## Quick Start

### Basic Theme Control

Use the `useTheme` hook to control both Calcite and ArcGIS themes together:

```tsx
import { useState } from 'react';
import { Map, MapView, useTheme, CalciteShell, CalciteButton } from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useTheme(theme);

  return (
    <CalciteShell>
      <CalciteButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </CalciteButton>
      
      <Map basemap="topo-vector">
        <MapView center={[-118.805, 34.027]} zoom={13} />
      </Map>
    </CalciteShell>
  );
}
```

### Auto Mode (System Preference)

Enable automatic theme switching based on system preferences:

```tsx
import { useTheme, useSystemTheme } from 'react-arcgis';

function App() {
  // Use 'auto' to follow system preference
  useTheme('auto');
  
  // Get the current system theme
  const systemTheme = useSystemTheme(); // 'light' or 'dark'

  return <div>Current system theme: {systemTheme}</div>;
}
```

## Theme Hooks

### `useTheme(mode, options?)`

Unified hook to manage both Calcite and ArcGIS themes together.

**Parameters:**
- `mode`: `'light' | 'dark' | 'auto'` - The theme mode
- `options.syncArcGIS`: `boolean` - Whether to sync ArcGIS theme (default: `true`)

**Example:**
```tsx
import { useTheme } from 'react-arcgis';

function App() {
  useTheme('dark');
  // Both Calcite and ArcGIS now use dark theme
}
```

### `useCalciteMode(mode)`

Controls only the Calcite Design System theme.

**Parameters:**
- `mode`: `'light' | 'dark' | 'auto'` - The Calcite mode

**Example:**
```tsx
import { useCalciteMode } from 'react-arcgis';

function App() {
  useCalciteMode('dark');
  // Only Calcite components use dark theme
}
```

### `useArcGISTheme(theme)`

Controls only the ArcGIS Maps SDK theme.

**Parameters:**
- `theme`: `'light' | 'dark'` - The ArcGIS theme (no auto mode)

**Example:**
```tsx
import { useArcGISTheme } from 'react-arcgis';

function App() {
  useArcGISTheme('dark');
  // Only ArcGIS maps/widgets use dark theme
}
```

### `useSystemTheme()`

Returns the current system theme preference and listens for changes.

**Returns:** `'light' | 'dark'`

**Example:**
```tsx
import { useSystemTheme } from 'react-arcgis';

function App() {
  const systemTheme = useSystemTheme();
  
  return <div>Your system prefers: {systemTheme}</div>;
}
```

### `getSystemTheme()`

Utility function to get the current system theme without a hook.

**Returns:** `'light' | 'dark'`

**Example:**
```tsx
import { getSystemTheme } from 'react-arcgis';

const theme = getSystemTheme();
console.log(`System theme: ${theme}`);
```

## Usage Examples

### Theme Switcher with Buttons

```tsx
import { useState } from 'react';
import { useTheme, CalciteButton } from 'react-arcgis';

function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  useTheme(theme);

  return (
    <div>
      <CalciteButton onClick={() => setTheme('light')}>
        Light
      </CalciteButton>
      <CalciteButton onClick={() => setTheme('dark')}>
        Dark
      </CalciteButton>
      <CalciteButton onClick={() => setTheme('auto')}>
        Auto
      </CalciteButton>
    </div>
  );
}
```

### Theme Switcher with Segmented Control

```tsx
import { useState } from 'react';
import {
  useTheme,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem
} from 'react-arcgis';

function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  useTheme(theme);

  return (
    <CalciteSegmentedControl
      onCalciteSegmentedControlChange={(e: any) => {
        setTheme(e.target.selectedItem.value);
      }}
    >
      <CalciteSegmentedControlItem value="light" checked={theme === 'light'}>
        Light
      </CalciteSegmentedControlItem>
      <CalciteSegmentedControlItem value="dark" checked={theme === 'dark'}>
        Dark
      </CalciteSegmentedControlItem>
      <CalciteSegmentedControlItem value="auto" checked={theme === 'auto'}>
        Auto
      </CalciteSegmentedControlItem>
    </CalciteSegmentedControl>
  );
}
```

### Persistent Theme (LocalStorage)

```tsx
import { useState, useEffect } from 'react';
import { useTheme } from 'react-arcgis';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('theme');
    return (saved as any) || 'light';
  });

  useTheme(theme);

  useEffect(() => {
    // Save to localStorage whenever theme changes
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

### Syncing Basemap with Theme

```tsx
import { useState } from 'react';
import { useTheme, useSystemTheme, Map, MapView } from 'react-arcgis';

function App() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const systemTheme = useSystemTheme();
  
  useTheme(themeMode);

  // Determine the effective theme
  const effectiveTheme = themeMode === 'auto' ? systemTheme : themeMode;
  
  // Choose basemap based on theme
  const basemap = effectiveTheme === 'dark' ? 'dark-gray-vector' : 'topo-vector';

  return (
    <Map basemap={basemap}>
      <MapView center={[-118.805, 34.027]} zoom={13} />
    </Map>
  );
}
```

### Context-Based Theme Provider

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { useTheme, type ThemeMode } from 'react-arcgis';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  useTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}

// Usage
function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

function ThemeButton() {
  const { theme, setTheme } = useThemeContext();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}
```

## Best Practices

### 1. Import Calcite CSS

Always import the Calcite CSS file when using Calcite components:

```tsx
import '@esri/calcite-components/dist/calcite/calcite.css';
```

### 2. Don't Hardcode ArcGIS Theme in HTML

Remove any hardcoded ArcGIS theme links from your `index.html`:

```html
<!-- ❌ Don't do this -->
<link rel="stylesheet" href="https://js.arcgis.com/4.28/@arcgis/core/assets/esri/themes/light/main.css">

<!-- ✅ Let the hooks manage the theme -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My App</title>
</head>
```

### 3. Use Auto Mode for Better UX

Consider defaulting to `'auto'` mode to respect user system preferences:

```tsx
function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  useTheme(theme);
  // ...
}
```

### 4. Sync Basemap with Theme

Choose appropriate basemaps for each theme:

```tsx
const basemaps = {
  light: 'topo-vector',
  dark: 'dark-gray-vector'
};

const basemap = basemaps[effectiveTheme];
```

### 5. Persist User Preference

Save the user's theme choice to localStorage or a backend:

```tsx
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

## Advanced Configuration

### Separate Calcite and ArcGIS Themes

You can control Calcite and ArcGIS themes independently:

```tsx
import { useCalciteMode, useArcGISTheme } from 'react-arcgis';

function App() {
  useCalciteMode('dark');    // Calcite dark
  useArcGISTheme('light');   // ArcGIS light
}
```

### Disable ArcGIS Theme Sync

If you want to manage ArcGIS theme manually:

```tsx
import { useTheme } from 'react-arcgis';

function App() {
  useTheme('dark', { syncArcGIS: false });
  // Only Calcite theme changes, manage ArcGIS separately
}
```

### Custom Theme Detection Logic

```tsx
import { useSystemTheme, useTheme } from 'react-arcgis';

function App() {
  const systemTheme = useSystemTheme();
  const isBusinessHours = new Date().getHours() >= 9 && new Date().getHours() < 17;
  
  // Use dark theme outside business hours, light during work
  const theme = isBusinessHours ? 'light' : systemTheme;
  
  useTheme(theme);
}
```

### CSS Custom Properties

Calcite exposes CSS custom properties you can override:

```css
/* Override Calcite colors */
:root {
  --calcite-ui-brand: #007ac2;
  --calcite-ui-brand-hover: #00619b;
}

.calcite-mode-dark {
  --calcite-ui-background: #1a1a1a;
}
```

## TypeScript Types

```typescript
import type {
  Theme,          // 'light' | 'dark'
  ThemeMode,      // 'light' | 'dark' | 'auto'
  CalciteMode,    // 'light' | 'dark' | 'auto'
  ArcGISTheme     // 'light' | 'dark'
} from 'react-arcgis';
```

## Troubleshooting

### Theme not applying

1. Make sure you imported Calcite CSS:
   ```tsx
   import '@esri/calcite-components/dist/calcite/calcite.css';
   ```

2. Remove hardcoded theme links from your HTML

3. Check browser console for errors

### ArcGIS widgets showing wrong theme

The ArcGIS theme is applied via a `<link>` tag. Make sure:
1. You're using `useTheme` or `useArcGISTheme`
2. No conflicting theme links exist in your HTML

### Auto mode not working

Auto mode reads from `prefers-color-scheme` media query. Make sure:
1. Your OS has a light/dark mode setting
2. Your browser supports `prefers-color-scheme`
3. Test by changing your OS theme

## Complete Example

See `example/src/ThemeExample.tsx` for a full working example with:
- Theme switcher UI
- System theme detection
- Synced basemap selection
- Persistent theme storage

## Learn More

- [Calcite Design System](https://developers.arcgis.com/calcite-design-system/)
- [ArcGIS Maps SDK Styling](https://developers.arcgis.com/javascript/latest/styling/)
- [CSS prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
