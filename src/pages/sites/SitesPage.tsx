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
      <PageTitle
        actions={
          <Link
            to="new"
            className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold text-text shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
          >
            New Site
          </Link>
        }
      >
        Sites
      </PageTitle>
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
