import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useIdentityContext } from 'react-netlify-identity';

export function LogInPage() {
  const { loginUser } = useIdentityContext();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');

  const logIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    loginUser(email, password, true)
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
      }}
    >
      <h1>Sign In</h1>
      <form onSubmit={logIn} className="w-full max-w-sm">
        <label htmlFor="email" className="block text-sm font-semibold text-heading">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@email.com"
          className="mt-2 block w-full rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
          onChange={(e) => setEmail(e.currentTarget.value)}
        />

        <label htmlFor="password" className="mt-4 block text-sm font-semibold text-heading">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="mt-2 block w-full rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
          onChange={(e) => setPassWord(e.currentTarget.value)}
        />
        {error ? <p>{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-primary bg-primary px-4 py-2.5 text-base font-semibold text-white shadow-sm hover:border-primary-accent hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-white dark:focus:ring-white/80"
        >
          Sign In
        </button>
      </form>
      <Link to="../create-account">Create Account</Link>
    </div>
  );
}
