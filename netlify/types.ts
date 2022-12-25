export interface Project {
  projectId: string;
  name: string;
  rootFileId: string;
  type: 'page' | 'site';
}

export interface Page {
  id: string;
  fileKey: string;
  fileName: string;
  images: Image[];
  parent: Page;
  children: Page[];
}

export interface Image {
  id: string;
  fileKey: string;
}
