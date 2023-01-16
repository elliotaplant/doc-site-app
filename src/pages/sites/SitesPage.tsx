import { Project } from '../../types';
import { SiteCard } from './SiteCard';
import { Link } from 'react-router-dom';
import { PageTitle } from '../../layout/PageTitle';
import { FormError } from '../../components/FormError';
import { useAuthedGet } from '../../hooks/useAuthedGet';

const PROJECTS_URL = '/.netlify/functions/project';

export function SitesPage() {
  const { data, error, mutate } = useAuthedGet<Project[]>(PROJECTS_URL);

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
      {error && <FormError>Failed to load sites</FormError>}
      {data && (
        <ul className="mt-4 flex w-full flex-col gap-4">
          {data.map((project: any) => (
            <SiteCard key={project.projectId} project={project} mutateProjects={mutate} />
          ))}
        </ul>
      )}
    </>
  );
}
