# React ArcGIS Documentation

A comprehensive documentation site for React ArcGIS components, hooks, and utilities.

## Features

- **Live Examples**: Interactive examples of each component
- **Code Examples**: Copy-paste ready code snippets
- **Prop Documentation**: Complete prop descriptions with types and defaults
- **Usage Instructions**: Step-by-step guides for using components
- **Navigation**: Easy browsing of all components by category

## Getting Started

### Installation

```bash
cd docs-app
npm install
```

### Development

```bash
npm run dev
```

The documentation site will be available at `http://localhost:3001`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Structure

- `src/pages/` - Page components (HomePage, ComponentPage)
- `src/components/` - Reusable components (LiveExample, CodeExample, PropsTable)
- `src/utils/componentDocs.ts` - Documentation data for all components
- `src/App.tsx` - Main app with routing and sidebar navigation

## Adding New Components

To add documentation for a new component:

1. Add component data to `src/utils/componentDocs.ts`
2. Add a live example implementation in `src/components/LiveExample.tsx`
3. The component will automatically appear in the navigation

## Technologies

- React 18
- Vite
- TypeScript
- React Router
- React ArcGIS (local package)
