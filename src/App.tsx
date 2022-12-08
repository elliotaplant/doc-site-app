import { useState } from 'react';
import './App.css';

const projects = [
  {
    projectId: 'first-project',
    driveLink: 'https://docs.google.com/document/d/1h68ecL4rxSxAHwj7sh5L5nxpu6Uih3PQa2DtHFLTK5Y',
    deploymentLocation: process.env.REACT_APP_EXAMPLE_SITE,
  },
];

function App() {
  const [files, setFiles] = useState<any>(null);

  const connectGoogleDrive = async () => {
    const response = await fetch('/.netlify/functions/drive-auth-url');
    const { url } = await response.json();
    console.log('url', url);
    window.open(url);
  };

  const refreshFile = async (projectId: string) => {
    try {
      const resp = await fetch('/.netlify/functions/refresh-file', {
        method: 'post',
        body: JSON.stringify({ projectId }),
        headers: {
          'content-type': 'application/json',
        },
      });
      if (!resp.ok) {
        throw new Error(await resp.text());
      }
      alert('Success');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
      }}
    >
      <button style={{ width: 100 }} onClick={connectGoogleDrive}>
        Connect to Google Drive
      </button>
      <ul>
        {projects.map((project) => (
          <li key={project.projectId} style={{ display: 'flex', gap: '10px' }}>
            {project.projectId}
            <button onClick={() => refreshFile(project.projectId)}>Refresh File</button>
            <a href={project.driveLink} target="_blank" rel="noreferrer">
              Edit doc
            </a>
            <a href={project.deploymentLocation} target="_blank" rel="noreferrer">
              Example Site
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
