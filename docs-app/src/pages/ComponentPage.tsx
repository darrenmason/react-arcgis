import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { componentDocs, ComponentDoc } from '../utils/componentDocs';
import CodeExample from '../components/CodeExample';
import LiveExample from '../components/LiveExample';
import PropsTable from '../components/PropsTable';
import './ComponentPage.css';

export default function ComponentPage() {
  const { name } = useParams<{ name: string }>();
  const doc = componentDocs.find(d => d.name === name);

  if (!doc) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="component-page">
      <ComponentHeader doc={doc} />
      <ComponentDescription doc={doc} />
      <Instructions doc={doc} />
      <LiveExample doc={doc} />
      <CodeExample doc={doc} />
      <PropsTable props={doc.props} />
    </div>
  );
}

function ComponentHeader({ doc }: { doc: ComponentDoc }) {
  return (
    <div className="component-header">
      <div className="component-badge">{doc.category}</div>
      <h1>{doc.name}</h1>
      <p className="component-description">{doc.description}</p>
    </div>
  );
}

function ComponentDescription({ doc }: { doc: ComponentDoc }) {
  return (
    <section className="component-section">
      <h2>Overview</h2>
      <p>{doc.description}</p>
    </section>
  );
}

function Instructions({ doc }: { doc: ComponentDoc }) {
  if (!doc.instructions || doc.instructions.length === 0) {
    return null;
  }

  return (
    <section className="component-section">
      <h2>Usage Instructions</h2>
      <ol className="instructions-list">
        {doc.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </section>
  );
}
