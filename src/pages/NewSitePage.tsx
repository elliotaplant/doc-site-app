import { useState, FormEvent } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { GooglePickerButton } from './picker/GooglePickerButton';
import { serializeName } from '../utils';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../layout/PageTitle';

export function NewSitePage() {
  const [driveId, setDriveId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { authedFetch } = useIdentityContext();
  const navigate = useNavigate();

  const createProject = async (e: FormEvent) => {
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <PageTitle>New Site</PageTitle>
      {!driveId && (
        <GooglePickerButton
          onSelected={({ name, id }) => {
            setDriveId(id);
            setProjectId(serializeName(name));
          }}
        />
      )}
      {driveId && (
        <div className="flex justify-center">
          <form onSubmit={(e) => createProject(e)} className="mt-4 flex max-w-sm flex-col ">
            <label htmlFor="email" className="text-heading block text-sm font-semibold">
              Site Name
            </label>
            <input
              name="project-id"
              value={projectId}
              placeholder="project-id"
              className="border-muted-3 text-heading placeholder:text-text/50 focus:border-primary mt-2 block w-full rounded-xl border-2 bg-transparent px-4 py-2.5 font-semibold focus:outline-none focus:ring-0 sm:text-sm"
              onChange={(e) => setProjectId(e.currentTarget.value)}
            />
            <p aria-live="polite" id="email:helper" className="text-text mt-2 text-xs font-medium">
              You can use lowercase letters, numbers, and "-". Must be globally unique.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="border-primary bg-primary hover:border-primary-accent hover:bg-primary-accent disabled:hover:border-primary disabled:hover:bg-primary mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
            >
              Create Project
            </button>
          </form>
        </div>
      )}
    </>
  );
}
