import { Project } from '../../types';

const driveFolderRoot = 'https://drive.google.com/drive/folders';

export interface SiteCardProps {
  project: Project;
  refreshFile: (projectId: string) => void;
}

export function SiteCard({ project, refreshFile }: SiteCardProps) {
  return (
    <li key={project.projectId} className="rounded-xl bg-layer-2">
      <div className="w-full px-8 py-6">
        <dt className="text-lg font-semibold text-heading">{project.projectId}</dt>
        <div className="flex flex-row-reverse gap-4">
          <button
            className="inline-flex h-full cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold text-text shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
            onClick={() => refreshFile(project.projectId)}
          >
            Publish Site
          </button>
          <a
            className="inline-flex h-full cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold text-text shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
            href={`${driveFolderRoot}/${project.rootFileId}`}
            target="_blank"
            rel="noreferrer"
          >
            Edit Google Doc
          </a>
          {project.rootFile && (
            <a
              className="inline-flex h-full cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold text-text shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
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

function makeRootOrigin(project: Project) {
  if (process.env.REACT_APP_APPEND_SUBDOMAIN_TO_PATH) {
    return `${project.projectId}.${process.env.REACT_APP_EXAMPLE_SITE}`;
  }
  return `${process.env.REACT_APP_EXAMPLE_SITE}/${project.projectId}`;
}
