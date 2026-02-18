import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ComponentPage from './pages/ComponentPage';
import { componentDocs } from './utils/componentDocs';
import './App.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/component/:name" element={<ComponentPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Sidebar() {
  const location = useLocation();
  
  const categories = [
    {
      title: 'Core Components',
      items: ['Map', 'MapView', 'SceneView', 'WebMap', 'WebScene']
    },
    {
      title: 'Layers',
      items: ['FeatureLayer', 'TileLayer', 'GraphicsLayer', 'GeoJSONLayer']
    },
    {
      title: 'Widgets',
      items: ['Zoom', 'Home', 'Search', 'LayerList', 'Legend']
    },
    {
      title: 'Hooks',
      items: ['useView', 'useGraphic', 'useQueryFeatures']
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>React ArcGIS</h1>
        <p className="sidebar-subtitle">Documentation</p>
      </div>
      <nav className="sidebar-nav">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        {categories.map(category => (
          <div key={category.title} className="nav-category">
            <h3 className="nav-category-title">{category.title}</h3>
            {category.items.map(item => {
              const doc = componentDocs.find(d => d.name === item);
              if (!doc) return null;
              return (
                <Link
                  key={item}
                  to={`/component/${item}`}
                  className={`nav-link nav-link-nested ${
                    location.pathname === `/component/${item}` ? 'active' : ''
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default App;
