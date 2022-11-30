import { useState } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState<any>(null);

  const connectGoogleDrive = async () => {
    const response = await fetch('/.netlify/functions/drive-auth-url');
    const { url } = await response.json();
    console.log('url', url);
    window.open(url);
  };

  const refreshFile = async () => {
    try {
      await fetch('/.netlify/functions/refresh-file');
      alert('Success');
    } catch (e) {
      alert(e);
    }
  };

  const listFiles = async () => {
    const response = await fetch('/.netlify/functions/list-files');
    const files = await response.json();
    setFiles(files);
  };

  return (
    <div
      style={{
        width: '100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <button onClick={connectGoogleDrive}>Connect to Google Drive</button>
      <button onClick={refreshFile}>Refresh File</button>
      <a href="https://docs.google.com/document/d/1h68ecL4rxSxAHwj7sh5L5nxpu6Uih3PQa2DtHFLTK5Y/edit#">
        Edit doc
      </a>
      <a
        href={process.env.REACT_APP_EXAMPLE_SITE}
        target="_blank"
        rel="noreferrer"
      >
        Example Site
      </a>
      <button onClick={listFiles}>List File</button>
      {files && (
        <pre>
          <code>{JSON.stringify(files, null, 2)}</code>
        </pre>
      )}
    </div>
  );
}

export default App;
