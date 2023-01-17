import { Link } from 'react-router-dom';

import { useIdentityContext } from 'react-netlify-identity';
import { docSiteLogoSrc } from '../icons';
import { Field, withTypes } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { TextField } from '../components/TextField';
import { FormError } from '../components/FormError';

interface LoginFormFields {
  email: string;
  password: string;
}

const { Form } = withTypes<LoginFormFields>();

export function LogInPage() {
  const { loginUser } = useIdentityContext();

  const onSubmit = async ({ email, password }: LoginFormFields) => {
    try {
      await loginUser(email, password, true);
    } catch (e: any) {
      console.error(e);
      if (e?.json?.error_description) {
        return { [FORM_ERROR]: e?.json?.error_description };
      }
      return { [FORM_ERROR]: 'Failed to log in' };
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-heading text-3xl font-semibold flex gap-2">
        <img src={docSiteLogoSrc} alt="DocSite Logo" className="inline-block w-8" />
        <span>DocSite</span>
      </h1>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, submitError }) => (
          <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
            <Field
              name="email"
              type="email"
              label="Email"
              placeholder="you@email.com"
              className="border-muted-3 text-heading placeholder:text-text/50 focus:border-primary mt-2 block w-full rounded-xl border-2 bg-transparent px-4 py-2.5 font-semibold focus:outline-none focus:ring-0 sm:text-sm"
              component={TextField}
            />

            <Field
              name="password"
              type="password"
              label="Password"
              placeholder="············"
              className="border-muted-3 text-heading placeholder:text-text/50 focus:border-primary mt-2 block w-full rounded-xl border-2 bg-transparent px-4 py-2.5 font-semibold focus:outline-none focus:ring-0 sm:text-sm"
              component={TextField}
            />

            {submitError && <FormError>{submitError}</FormError>}

            <button
              type="submit"
              disabled={submitting}
              className="border-primary bg-primary hover:border-primary-accent hover:bg-primary-accent disabled:hover:border-primary disabled:hover:bg-primary mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
            >
              Login
            </button>

            <p className="text-text mt-6 text-center text-sm">
              No account?&nbsp;
              <Link
                to="../create-account"
                className="text-primary hover:text-primary-accent font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </form>
        )}
      />
    </div>
  );
}
