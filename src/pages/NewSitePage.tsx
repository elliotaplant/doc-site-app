import { useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { GooglePickerButton } from './picker/GooglePickerButton';
import { serializeName } from '../utils';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../layout/PageTitle';
import { Field, withTypes } from 'react-final-form';
import { TextField } from '../components/TextField';
import { FORM_ERROR } from 'final-form';
import { FormError } from '../components/FormError';

const projectIdValidator = (value: string) => {
  return /^[a-z0-9-]+$/.test(value)
    ? undefined
    : 'You may only use lowercase letters, numbers, and dashes (-)';
};

interface NewSiteFormFields {
  projectId: string;
}

const { Form } = withTypes<NewSiteFormFields>();

export function NewSitePage() {
  const [driveId, setDriveId] = useState('');
  const [initialProjectId, setInitialProjectId] = useState('');
  const { authedFetch } = useIdentityContext();
  const navigate = useNavigate();

  const createProject = async (projectId: string) => {
    try {
      const response = await authedFetch.post('/.netlify/functions/project', {
        body: JSON.stringify({ projectId, rootFileId: driveId }),
      });

      if (response?.ok === false) {
        throw new Error('Failed to create site');
      }

      setDriveId('');
      setInitialProjectId('');
      alert('Site created');
      navigate('/');
    } catch (e) {
      console.error(e);
      return {
        [FORM_ERROR]: 'Failed to create site',
      };
    }
  };

  return (
    <>
      <PageTitle>New Site</PageTitle>
      {!driveId && (
        <GooglePickerButton
          onSelected={({ name, id }) => {
            setDriveId(id);
            setInitialProjectId(serializeName(name));
          }}
        />
      )}
      {driveId && (
        <div className="flex justify-center">
          <Form
            onSubmit={({ projectId }) => createProject(projectId)}
            initialValues={{ projectId: initialProjectId }}
            render={({ handleSubmit, submitting, valid, submitError }) => (
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col w-full">
                <Field
                  name="projectId"
                  label="Site Name"
                  placeholder="project-id"
                  spellcheck={false}
                  component={TextField}
                  helpText="You can use lowercase letters, numbers, and '-'. Must be globally unique."
                  validate={projectIdValidator}
                />
                <button
                  type="submit"
                  disabled={submitting || !valid}
                  className="border-primary bg-primary hover:border-primary-accent hover:bg-primary-accent disabled:hover:border-primary disabled:hover:bg-primary mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
                >
                  {submitting ? 'Creating Project...' : 'Create Project'}
                </button>
                {submitError && <FormError>{submitError}</FormError>}
              </form>
            )}
          />
        </div>
      )}
    </>
  );
}
