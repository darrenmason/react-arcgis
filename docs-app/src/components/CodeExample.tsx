import React, { useState } from 'react';
import { ComponentDoc } from '../utils/componentDocs';
import './CodeExample.css';

interface CodeExampleProps {
  doc: ComponentDoc;
}

export default function CodeExample({ doc }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.exampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="code-example-section">
      <div className="code-header">
        <h2>Code Example</h2>
        <button onClick={handleCopy} className="copy-button">
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="code-block">
        <code>{doc.exampleCode}</code>
      </pre>
    </section>
  );
}
