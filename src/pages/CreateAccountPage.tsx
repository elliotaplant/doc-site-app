import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useIdentityContext } from 'react-netlify-identity';

export function CreateAccountPage() {
  const { loginUser, signupUser } = useIdentityContext();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');

  const signUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    signupUser(email, password, {})
      .then(() => loginUser(email, password, true))
      .catch((error) => {
        if (error?.json?.error_description) {
          setError(error.json.error_description);
        } else {
          setError('Failed to log in');
        }
        console.log(error);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="flex flex-col gap-4 p-4 align-middle">
      <h1 className="text-heading text-3xl font-semibold">DocSite</h1>
      <form onSubmit={signUp} className="flex w-full max-w-sm flex-col">
        <label htmlFor="email" className="text-heading block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@email.com"
          className="border-muted-3 text-heading placeholder:text-text/50 focus:border-primary mt-2 block w-full rounded-xl border-2 bg-transparent px-4 py-2.5 font-semibold focus:outline-none focus:ring-0 sm:text-sm"
          onChange={(e) => setEmail(e.currentTarget.value)}
        />

        <label htmlFor="password" className="text-heading mt-4 block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="············"
          className="border-muted-3 text-heading placeholder:text-text/50 focus:border-primary mt-2 block w-full rounded-xl border-2 bg-transparent px-4 py-2.5 font-semibold focus:outline-none focus:ring-0 sm:text-sm"
          onChange={(e) => setPassWord(e.currentTarget.value)}
        />
        {error ? <p>{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="border-primary bg-primary hover:border-primary-accent hover:bg-primary-accent disabled:hover:border-primary disabled:hover:bg-primary mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-white dark:focus:ring-white/80"
        >
          Register
        </button>
      </form>
      <p className="text-text mt-6 text-center text-sm">
        Already have an account?&nbsp;
        <Link to="../log-in" className="text-primary hover:text-primary-accent font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
}
