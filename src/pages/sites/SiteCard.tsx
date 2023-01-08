import { Project } from '../../types';

const driveFolderRoot = 'https://drive.google.com/drive/folders';

export interface SiteCardProps {
  project: Project;
  refreshFile: (projectId: string) => void;
}

export function SiteCard({ project, refreshFile }: SiteCardProps) {
  return (
    <li
      key={project.projectId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '10px',
        width: '100%',
        border: '2px solid darkblue',
        borderRadius: '16px',
      }}
    >
      <h3>{project.projectId}</h3>
      <div
        style={{ display: 'flex', flexDirection: 'row-reverse', gap: '40px', marginBottom: '10px' }}
      >
        <button onClick={() => refreshFile(project.projectId)}>Refresh File</button>
        <a href={`${driveFolderRoot}/${project.rootFileId}`} target="_blank" rel="noreferrer">
          Edit Google Doc
        </a>
        {project.rootFile && (
          <a href={makeRootUrl(project)} target="_blank" rel="noreferrer">
            {makeRootOrigin(project)}
          </a>
        )}
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
