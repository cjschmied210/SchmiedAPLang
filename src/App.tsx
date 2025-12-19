import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { useAppDispatch } from './app/hooks';
import { createAnnotation } from './features/analysis/analysisSlice';

function App() {
  const dispatch = useAppDispatch();

  const handleSimulateHighlight = () => {
    dispatch(createAnnotation({
      textId: 'test-text-1',
      start: 0,
      end: 10,
      text: 'Simulated highlighted text segment ' + Math.floor(Math.random() * 100),
    }));
  };

  return (
    <div className="app-container">
      {/* Main Content Area (Reader) */}
      <main className="main-reader">
        <div className="reader-content">
          <header style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-ink)' }}>RhetoricOS Prototype</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-ink-light)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              "To operationalize rhetorical analysis through a specialized reading interface."
            </p>
          </header>

          <div style={{ lineHeight: 1.8, fontSize: '1.125rem', color: 'var(--color-ink)' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              This is the <strong>Reader Interface</strong> placeholder. The text would go here.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              In the final version, selecting text here will trigger the creation of a card in the sidebar.
            </p>

            <div className="debug-panel">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '1rem' }}>Debug Controls</h3>
              <button
                onClick={handleSimulateHighlight}
                className="btn-primary"
              >
                Simulate Text Highlight
              </button>
            </div>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </main>

      {/* The Thinking Sidebar */}
      <Sidebar />
    </div>
  );
}

export default App;
