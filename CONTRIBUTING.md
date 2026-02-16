# Contributing to React ArcGIS

Thank you for your interest in contributing to React ArcGIS!

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run the example app:
   ```bash
   cd example
   npm install
   npm run dev
   ```

## Project Structure

```
react-arcgis/
├── src/              # Source code
│   ├── components/   # React components
│   ├── hooks/        # React hooks
│   ├── context/      # Context providers
│   ├── utils/        # Utilities
│   └── index.ts      # Main exports
├── docs/             # Documentation
├── example/          # Example application
└── dist/             # Build output
```

## Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Commit with clear messages:
   ```bash
   git commit -m "Add: new feature description"
   ```

## Code Style

- Use TypeScript
- Follow existing patterns
- Add JSDoc comments
- Export types
- Handle errors gracefully

## Pull Requests

1. Update README.md if needed
2. Update CHANGELOG.md
3. Ensure build succeeds:
   ```bash
   npm run build
   ```
4. Open a pull request

## Questions?

Open an issue for discussion.
