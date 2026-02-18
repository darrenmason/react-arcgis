import React from 'react';
import { PropDoc } from '../utils/componentDocs';
import './PropsTable.css';

interface PropsTableProps {
  props: PropDoc[];
}

export default function PropsTable({ props }: PropsTableProps) {
  if (!props || props.length === 0) {
    return null;
  }

  return (
    <section className="props-section">
      <h2>Props</h2>
      <div className="table-container">
        <table className="props-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Required</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop, index) => (
              <tr key={index}>
                <td className="prop-name">
                  <code>{prop.name}</code>
                </td>
                <td className="prop-type">
                  <code>{prop.type}</code>
                </td>
                <td className="prop-required">
                  {prop.required ? (
                    <span className="required-badge">Required</span>
                  ) : (
                    <span className="optional-badge">Optional</span>
                  )}
                </td>
                <td className="prop-default">
                  {prop.default ? <code>{prop.default}</code> : <span className="no-default">—</span>}
                </td>
                <td className="prop-description">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
