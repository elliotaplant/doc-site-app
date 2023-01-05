import { FormEvent, useEffect, useState } from 'react';
import { GooglePickerButton } from '../picker/GooglePickerButton';
import { useIdentityContext } from 'react-netlify-identity';
import { Project } from '../../types';
import { SiteCard } from './SiteCard';

export function SitesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
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
      {projects && (
        <ul
          style={{
            maxWidth: '800px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            margin: 0,
            padding: 0,
          }}
        >
          {projects.map((project: any) => (
            <SiteCard key={project.projectId} project={project} refreshFile={refreshFile} />
          ))}
        </ul>
      )}
    </div>
  );
}
