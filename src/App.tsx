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
