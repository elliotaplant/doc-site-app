import { FormEvent, useEffect, useState } from 'react';
import { GooglePickerButton } from './picker/GooglePickerButton';
import { Link } from 'react-router-dom';
import { useIdentityContext } from 'react-netlify-identity';

const driveFolderRoot = 'https://drive.google.com/drive/folders';

function makeRootUrl(project: any) {
  if (process.env.REACT_APP_APPEND_SUBDOMAIN_TO_PATH) {
    return `https://${project.projectId}.${process.env.REACT_APP_EXAMPLE_SITE}/${project.rootFile}`;
  }
  return `${process.env.REACT_APP_EXAMPLE_SITE}/${project.projectId}/${project.rootFile}`;
}

export function SitesPage() {
  const [projects, setProjects] = useState<any>(null);
  const [driveId, setDriveId] = useState('');
  const [projectIdToCreate, setProjectIdToCreate] = useState('');
  const { authedFetch } = useIdentityContext();

  useEffect(() => {
    let unmounted = false;

    authedFetch
      .get('/.netlify/functions/project')
      .then((projects) => unmounted || setProjects(projects))
      .catch(console.error);

    return () => {
      unmounted = true;
    };
  }, [setProjects, authedFetch]);

  const connectGoogleDrive = async () => {
    const { url } = await authedFetch.get('/.netlify/functions/drive-auth-url');
    console.log('url', url);
    window.open(url);
  };

  const refreshFile = async (projectId: string) => {
    try {
      const resp = await authedFetch.post('/.netlify/functions/refresh-file', {
        body: JSON.stringify({ projectId }),
      });
      if (resp?.ok === false) {
        throw new Error(resp);
      }
      setProjects(resp);
      alert('Success');
    } catch (e) {
      alert(e);
    }
  };

  const createProject = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const response = await authedFetch.post('/.netlify/functions/project', {
        body: JSON.stringify({
          projectId: projectIdToCreate,
          rootFileId: driveId,
        }),
      });

      if (response?.ok === false) {
        throw new Error('Failed to create project');
      }

      setDriveId('');
      setProjectIdToCreate('');
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
      <GooglePickerButton onSelected={setDriveId} />
      <form onSubmit={(e) => createProject(e)} style={{ display: 'flex', gap: '10px' }}>
        <input
          value={projectIdToCreate}
          onChange={(e) => setProjectIdToCreate(e.currentTarget.value)}
          placeholder="project-id"
        />
        <input
          value={driveId}
          onChange={(e) => setDriveId(e.currentTarget.value)}
          placeholder="abc-123-drive-id"
        />
        <button style={{ width: 100 }}>Create project</button>
      </form>
      <Link to="account">Account</Link>
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
              {project.rootFile && (
                <a href={makeRootUrl(project)} target="_blank" rel="noreferrer">
                  Deployed Site
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
