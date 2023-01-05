import { FormEvent, useEffect, useState } from 'react';
import { GooglePickerButton } from './picker/GooglePickerButton';
import { Link } from 'react-router-dom';
import { useIdentityContext } from 'react-netlify-identity';
import { SiteCard } from './SiteCard';

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
        <ul className="mt-4 flex flex-col space-y-6 md:mt-5 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">
          {projects.map((project: any) => (
            <SiteCard key={project.projectId} refreshFile={refreshFile} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}
