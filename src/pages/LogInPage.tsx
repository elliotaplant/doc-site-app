import React, { useEffect, useRef, useState } from 'react';
import { redirect, Link } from 'react-router-dom';

import { useIdentityContext } from 'react-netlify-identity';

export function LogInPage() {
  const { loginUser } = useIdentityContext();
  const [error, setError] = useState('');
  const emailInput = useRef<HTMLInputElement>(null!);
  const passwordInput = useRef<HTMLInputElement>(null!);
  const logInButton = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    logInButton.current.disabled = true;
  }, [emailInput, passwordInput]);

  const handleChange = (): void => {
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    if (email && password) {
      logInButton.current.disabled = false;
    } else {
      logInButton.current.disabled = true;
    }
  };

  const logIn = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    loginUser(email, password, true)
      .then(() => {
        redirect('/'); // necessary?
      })
      .catch((error) => {
        if (error?.json?.error_description) {
          setError(error.json.error_description);
        } else {
          setError('Failed to log in');
        }
        console.log(error);
      });
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
      <form onSubmit={logIn}>
        <label style={{ display: 'block' }} htmlFor="email">
          Email
        </label>
        <input
          style={{ display: 'block' }}
          type="email"
          id="email"
          ref={emailInput}
          onChange={handleChange}
        />
        <label style={{ display: 'block' }} htmlFor="password">
          Password
        </label>
        <input
          style={{ display: 'block' }}
          type="password"
          id="password"
          ref={passwordInput}
          onChange={handleChange}
        />
        {error ? <p>{error}</p> : null}
        <button type="submit" ref={logInButton}>
          Log in
        </button>
      </form>
      <Link to="../create-account">Create Account</Link>
    </div>
  );
}
