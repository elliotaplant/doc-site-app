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
            className="border-muted-3 text-text hover:text-heading focus:text-heading disabled:hover:text-text inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 bg-transparent px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 dark:focus:ring-white/80"
          >
            New Site
          </Link>
        }
      >
        Sites
      </PageTitle>
      {projects && (
        <ul className="mt-4 flex w-full flex-col gap-4">
          {projects.map((project: any) => (
            <SiteCard key={project.projectId} project={project} refreshFile={refreshFile} />
          ))}
        </ul>
      )}
    </>
  );
}
