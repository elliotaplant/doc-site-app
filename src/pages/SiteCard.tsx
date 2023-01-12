const driveFolderRoot = 'https://drive.google.com/drive/folders';
function makeRootUrl(project: any) {
  if (process.env.REACT_APP_APPEND_SUBDOMAIN_TO_PATH) {
    return `https://${project.projectId}.${process.env.REACT_APP_EXAMPLE_SITE}/${project.rootFile}`;
  }
  return `${process.env.REACT_APP_EXAMPLE_SITE}/${project.projectId}/${project.rootFile}`;
}

export function SiteCard({ project, refreshFile }: any) {
  return (
    <li key={project.projectId} className="bg-layer-2 mb-4 flex gap-4 rounded-xl md:flex-col">
      <h4 className="font-semibold text-lg">{project.projectId}</h4>
      <button onClick={() => refreshFile(project.projectId)}>Refresh File</button>
      <a href={`${driveFolderRoot}/${project.rootFileId}`} target="_blank" rel="noreferrer">
        Edit doc
      </a>
      {project.rootFile && (
        <a href={makeRootUrl(project)} target="_blank" rel="noreferrer">
          Deployed Site
        </a>
      )}
    </li>
  );
}
