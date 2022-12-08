import { useEffect, useState } from 'react';
import './App.css';

const driveFolderRoot = 'https://drive.google.com/drive/folders';

function App() {
  const [projects, setProjects] = useState<any>(null);

  useEffect(() => {
    let unmounted = false;

    fetch('/.netlify/functions/project')
      .then((response) => response.json())
      .then((projects) => unmounted || setProjects(projects))
      .catch(console.error);

    return () => {
      unmounted = true;
    };
  }, [setProjects]);

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

  const createProject = async () => {
    try {
      const resp = await fetch('/.netlify/functions/project', {
        method: 'post',
        body: JSON.stringify({
          projectId: 'second-project',
          rootFileId: '1wM8uLpdr0wA0WcAaBcp5DaAhhBna1xkT',
        }),
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
      <button style={{ width: 100 }} onClick={createProject}>
        Create project
      </button>
      {projects && (
        <ul>
          {projects.map((project: any) => (
            <li
              key={project.projectId}
              style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}
            >
              {project.projectId}
              <button onClick={() => refreshFile(project.projectId)}>Refresh File</button>
              <a href={`${driveFolderRoot}/${project.rootFileId}`} target="_blank" rel="noreferrer">
                Edit doc
              </a>
              <a
                href={`${process.env.REACT_APP_EXAMPLE_SITE}/pages/${project.projectId}/${project.rootFile}`}
                target="_blank"
                rel="noreferrer"
              >
                Deployed Site
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
