import { useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { KeyedMutator } from 'swr';
import { Project } from '../../types';

const driveFolderRoot = 'https://drive.google.com/drive/folders';

export interface SiteCardProps {
  project: Project;
  mutateProjects: KeyedMutator<Project[]>;
}

export function SiteCard({ project, mutateProjects }: SiteCardProps) {
  const { authedFetch } = useIdentityContext();
  const [publishing, setPublishing] = useState(false);

  const refreshFile = async (projectId: string) => {
    setPublishing(true);
    try {
      const resp = await authedFetch.post('/.netlify/functions/refresh-file', {
        body: JSON.stringify({ projectId }),
      });
      if (resp?.ok === false) {
        throw new Error(resp);
      }
      mutateProjects(resp);
      alert('Site published');
    } catch (e) {
      console.error(e);
      alert('Failed to publish site');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <li key={project.projectId} className="bg-layer-2 rounded-xl">
      <div className="w-full px-8 py-6">
        <dt className="text-heading text-lg font-semibold">{project.projectId}</dt>
        <div className="flex flex-col gap-4 mt-4">
          <button
            className="border-muted-3 text-text hover:text-heading focus:text-heading disabled:hover:text-text inline-flex h-full cursor-pointer items-center justify-center rounded-xl border-2 bg-transparent px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 dark:focus:ring-white/80"
            disabled={publishing}
            onClick={() => refreshFile(project.projectId)}
          >
            {publishing ? 'Publishing site...' : 'Publish Site'}
          </button>
          <a
            className="border-muted-3 text-text hover:text-heading focus:text-heading disabled:hover:text-text inline-flex h-full cursor-pointer items-center justify-center rounded-xl border-2 bg-transparent px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 dark:focus:ring-white/80"
            href={`${driveFolderRoot}/${project.rootFileId}`}
            target="_blank"
            rel="noreferrer"
          >
            Edit Google Doc
          </a>
          {project.rootFile && (
            <a
              className="border-muted-3 text-text hover:text-heading focus:text-heading disabled:hover:text-text inline-flex h-full cursor-pointer items-center justify-center rounded-xl border-2 bg-transparent px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 dark:focus:ring-white/80"
              href={makeRootUrl(project)}
              target="_blank"
              rel="noreferrer"
            >
              Visit Published Site
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

function makeRootUrl(project: Project) {
  if (process.env.REACT_APP_APPEND_SUBDOMAIN_TO_PATH) {
    return `https://${project.projectId}.${process.env.REACT_APP_EXAMPLE_SITE}/${project.rootFile}`;
  }
  return `${process.env.REACT_APP_EXAMPLE_SITE}/${project.projectId}/${project.rootFileId}`;
}
