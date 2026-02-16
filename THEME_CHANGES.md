# Theme Support Changes

## Summary

Added comprehensive light/dark mode support for both Calcite Design System and ArcGIS Maps SDK. Users can now control themes dynamically with hooks, including automatic system preference detection.

## What Was Added

### New Hooks

#### 1. `useTheme(mode, options?)`
**File:** `src/hooks/useTheme.ts`

Unified hook that manages both Calcite and ArcGIS themes together.

```tsx
useTheme('light');  // Light mode for everything
useTheme('dark');   // Dark mode for everything  
useTheme('auto');   // Follows system preference
```

#### 2. `useCalciteMode(mode)`
**File:** `src/hooks/useCalciteMode.ts`

Controls only Calcite Design System theme.

```tsx
useCalciteMode('dark');  // Dark mode for Calcite components only
```

#### 3. `useArcGISTheme(theme)`
**File:** `src/hooks/useArcGISTheme.ts`

Controls only ArcGIS Maps SDK theme.

```tsx
useArcGISTheme('dark');  // Dark mode for ArcGIS maps/widgets only
```

#### 4. `useSystemTheme()`
**File:** `src/hooks/useTheme.ts`

Returns and tracks the current system theme preference.

```tsx
const systemTheme = useSystemTheme();  // 'light' or 'dark'
```

#### 5. `getSystemTheme()`
**File:** `src/hooks/useTheme.ts`

Utility function to get system theme without a hook.

```tsx
const theme = getSystemTheme();  // 'light' or 'dark'
```

### Documentation

1. **THEMING.md** - Complete theming guide with:
   - All hook APIs
   - Usage examples
   - Best practices
   - Advanced patterns
   - Troubleshooting
   - TypeScript types

2. **THEME_QUICK_START.md** - Quick start guide with:
   - Installation
   - Basic usage
   - Auto mode setup
   - Complete examples
   - Important notes

3. **Updated README.md** - Added Theme Support section

### Examples

**ThemeExample.tsx** - Complete working example showing:
- Theme switcher UI with segmented control
- System theme detection
- Effective theme display
- Basemap syncing with theme
- Professional Calcite layout

### Breaking Changes

#### HTML Changes

**Before:**
```html
<head>
  <link rel="stylesheet" href="https://js.arcgis.com/4.28/@arcgis/core/assets/esri/themes/light/main.css">
</head>
```

**After:**
```html
<head>
  <!-- ArcGIS theme is now managed by useTheme/useArcGISTheme hooks -->
</head>
```

The hardcoded ArcGIS theme link has been removed from `example/index.html`. The theme CSS is now dynamically injected by the hooks.

#### CSS Import Changes

**Before:**
```tsx
import '@arcgis/core/assets/esri/themes/light/main.css';
```

**After:**
```tsx
// Import only Calcite CSS
import '@esri/calcite-components/dist/calcite/calcite.css';

// ArcGIS theme is managed by useTheme() hook
useTheme('light');
```

### Updated Files

- `src/hooks/index.ts` - Exported new theme hooks
- `example/index.html` - Removed hardcoded ArcGIS theme link
- `example/src/App.tsx` - Added `useTheme('light')` call
- `README.md` - Added Theme Support section

## Migration Guide

### For Existing Users

If you have hardcoded theme CSS in your HTML or imports:

1. **Remove hardcoded ArcGIS theme from HTML:**
   ```html
   <!-- Remove this -->
   <link rel="stylesheet" href="https://js.arcgis.com/...themes/light/main.css">
   ```

2. **Remove theme import from code:**
   ```tsx
   // Remove this
   import '@arcgis/core/assets/esri/themes/light/main.css';
   ```

3. **Add theme hook:**
   ```tsx
   import { useTheme } from 'react-arcgis';
   
   function App() {
     useTheme('light');  // or 'dark' or 'auto'
     // ...
   }
   ```

4. **Keep Calcite CSS import:**
   ```tsx
   import '@esri/calcite-components/dist/calcite/calcite.css';
   ```

### For New Users

Just use the `useTheme` hook:

```tsx
import { useState } from 'react';
import { Map, MapView, useTheme } from 'react-arcgis';
import '@esri/calcite-components/dist/calcite/calcite.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useTheme(theme);
  
  return (
    <Map basemap="topo-vector">
      <MapView center={[-118.805, 34.027]} zoom={13} />
    </Map>
  );
}
```

## Technical Details

### How It Works

#### Calcite Theme
- Sets CSS class on `<html>` element: `calcite-mode-{light|dark|auto}`
- Sets data attribute: `data-calcite-mode="{mode}"`
- Calcite components automatically respond to these classes

#### ArcGIS Theme
- Dynamically creates/updates `<link>` element in document head
- Points to appropriate ArcGIS theme CSS on CDN
- Automatically cleaned up on unmount

#### Auto Mode
- Uses `prefers-color-scheme` media query
- Listens for system theme changes
- For Calcite: Uses native `calcite-mode-auto`
- For ArcGIS: Resolves to actual 'light' or 'dark' (no auto mode in ArcGIS)

### TypeScript Types

```typescript
import type {
  Theme,          // 'light' | 'dark'
  ThemeMode,      // 'light' | 'dark' | 'auto'
  CalciteMode,    // 'light' | 'dark' | 'auto'
  ArcGISTheme     // 'light' | 'dark'
} from 'react-arcgis';
```

## Benefits

1. **User Control**: Let users choose their preferred theme
2. **System Integration**: Automatically respect OS-level theme preference
3. **Consistent Experience**: Sync theme across Calcite and ArcGIS components
4. **Dynamic Switching**: Change theme at runtime without page reload
5. **Accessibility**: Better support for users with light sensitivity
6. **Modern UX**: Expected feature in modern web applications

## Examples Use Cases

### Basic Toggle
```tsx
const [theme, setTheme] = useState<'light' | 'dark'>('light');
useTheme(theme);
```

### Auto Mode (System Preference)
```tsx
useTheme('auto');  // Follows OS setting
```

### Persistent Theme
```tsx
const [theme, setTheme] = useState(() => 
  localStorage.getItem('theme') || 'light'
);
useTheme(theme);
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

### Synced Basemap
```tsx
const [theme, setTheme] = useState('auto');
const systemTheme = useSystemTheme();
useTheme(theme);

const effectiveTheme = theme === 'auto' ? systemTheme : theme;
const basemap = effectiveTheme === 'dark' ? 'dark-gray-vector' : 'topo-vector';
```

### Context Provider
```tsx
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  useTheme(theme);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Testing

To test the theme functionality:

1. **Manual Theme Switching:**
   - Run the ThemeExample.tsx
   - Click theme buttons
   - Verify both Calcite and ArcGIS update

2. **Auto Mode:**
   - Set theme to 'auto'
   - Change OS theme (System Settings)
   - Verify app follows OS theme

3. **Persistent Theme:**
   - Set a theme
   - Reload page
   - Verify theme persists

## Future Enhancements

Potential future additions:
- Theme transition animations
- Custom theme colors
- Per-component theme overrides
- Theme scheduling (e.g., dark at night)
- More granular control (e.g., widget-specific themes)

## Support

For issues or questions:
- See [THEMING.md](./THEMING.md) for troubleshooting
- Check [examples](./example/src/) for working code
- Review [THEME_QUICK_START.md](./THEME_QUICK_START.md) for basics
