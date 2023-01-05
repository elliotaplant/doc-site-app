import { useState, FormEvent } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { GooglePickerButton } from './picker/GooglePickerButton';
import { serializeName } from '../utils';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../layout/PageTitle';

export function NewSitePage() {
  const [driveId, setDriveId] = useState('');
  const [projectId, setProjectId] = useState('');
  const { authedFetch } = useIdentityContext();
  const navigate = useNavigate();

  const createProject = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const response = await authedFetch.post('/.netlify/functions/project', {
        body: JSON.stringify({ projectId, rootFileId: driveId }),
      });

      if (response?.ok === false) {
        throw new Error('Failed to create project');
      }

      setDriveId('');
      setProjectId('');
      alert('Success');
      navigate('/');
    } catch (e) {
      alert(e);
    }
  };
  return (
    <>
      <PageTitle>New Site</PageTitle>
      <GooglePickerButton
        onSelected={({ name, id }) => {
          setDriveId(id);
          setProjectId(serializeName(name));
        }}
      />
      {driveId && (
        <form onSubmit={(e) => createProject(e)} style={{ display: 'flex', gap: '10px' }}>
          <label>Site name (must be globally unique):</label>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.currentTarget.value)}
            placeholder="project-id"
          />
          <button style={{ width: 100 }}>Create project</button>
        </form>
      )}
    </>
  );
}
