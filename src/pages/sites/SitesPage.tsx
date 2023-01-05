import { useEffect, useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { Project } from '../../types';
import { SiteCard } from './SiteCard';
import { Link } from 'react-router-dom';
import { PageTitle } from '../../layout/PageTitle';

export function SitesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
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
    <>
      <PageTitle>Sites</PageTitle>
      <Link to="new" style={{ alignSelf: 'flex-end' }}>
        New Site
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
    </>
  );
}
