import { FormEvent, useEffect, useState } from 'react';
import { GooglePickerButton } from '../picker/GooglePickerButton';
import { useIdentityContext } from 'react-netlify-identity';
import { Project } from '../../types';
import { SiteCard } from './SiteCard';
import { Link } from 'react-router-dom';

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

  return (
    <div
      style={{
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        margin: '0 auto',
      }}
    >
      <Link to="new" style={{ alignSelf: 'flex-end' }}>
        New Project
      </Link>
      {projects && (
        <ul
          style={{
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
