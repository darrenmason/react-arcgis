import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>React ArcGIS Documentation</h1>
        <p className="hero-subtitle">
          Comprehensive documentation for React ArcGIS components, hooks, and utilities.
          Explore live examples, prop descriptions, and usage instructions.
        </p>
      </div>

      <div className="home-sections">
        <section className="home-section">
          <h2>Getting Started</h2>
          <p>
            React ArcGIS provides React wrapper components for the ArcGIS SDK for JavaScript.
            Get started by exploring the core components below.
          </p>
        </section>

        <section className="home-section">
          <h2>Core Components</h2>
          <div className="component-grid">
            <ComponentCard name="Map" description="The base map component that wraps ArcGIS Map" />
            <ComponentCard name="MapView" description="2D map view for displaying maps" />
            <ComponentCard name="SceneView" description="3D scene view for displaying 3D maps" />
            <ComponentCard name="WebMap" description="Load web maps from ArcGIS Online or Portal" />
            <ComponentCard name="WebScene" description="Load web scenes from ArcGIS Online or Portal" />
          </div>
        </section>

        <section className="home-section">
          <h2>Layers</h2>
          <div className="component-grid">
            <ComponentCard name="FeatureLayer" description="Display feature data from services" />
            <ComponentCard name="TileLayer" description="Display tiled map services" />
            <ComponentCard name="GraphicsLayer" description="Display graphics and user-drawn features" />
            <ComponentCard name="GeoJSONLayer" description="Display GeoJSON data" />
          </div>
        </section>

        <section className="home-section">
          <h2>Widgets</h2>
          <div className="component-grid">
            <ComponentCard name="Zoom" description="Zoom in/out controls" />
            <ComponentCard name="Home" description="Return to initial extent" />
            <ComponentCard name="Search" description="Search for locations" />
            <ComponentCard name="LayerList" description="Display and manage layers" />
            <ComponentCard name="Legend" description="Show map legend" />
          </div>
        </section>

        <section className="home-section">
          <h2>Hooks</h2>
          <div className="component-grid">
            <ComponentCard name="useView" description="Access the current map view instance" />
            <ComponentCard name="useGraphic" description="Create and manage graphics" />
            <ComponentCard name="useQueryFeatures" description="Query features from layers" />
          </div>
        </section>
      </div>
    </div>
  );
}

function ComponentCard({ name, description }: { name: string; description: string }) {
  return (
    <Link to={`/component/${name}`} className="component-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <span className="card-link">View Documentation →</span>
    </Link>
  );
}
