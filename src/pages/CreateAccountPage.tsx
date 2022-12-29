import React, { useEffect, useRef, useState } from 'react';
import { redirect, Link } from 'react-router-dom';
import { useIdentityContext } from 'react-netlify-identity';

const passwordPattern = /^.{6,}$/;

export function CreateAccountPage() {
  const { loginUser, signupUser } = useIdentityContext();
  const [error, setError] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null!);
  const passwordInput = useRef<HTMLInputElement>(null!);
  const signUpButton = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    signUpButton.current.disabled = true;
  }, [emailInput, passwordInput]);

  const handleChange = (): void => {
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    if (email && passwordPattern.test(password)) {
      signUpButton.current.disabled = false;
    } else {
      signUpButton.current.disabled = true;
    }
  };

  const signUp = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    signupUser(email, password, {})
      .then(() => loginUser(email, password, true))
      .then(() => {
        redirect('/'); // necessary?
      })
      .catch((error) => {
        setError(true);
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
      <h1>Create account</h1>
      <form onSubmit={signUp}>
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
          Password (min. 6 characters)
        </label>
        <input
          style={{ display: 'block' }}
          type="password"
          id="password"
          ref={passwordInput}
          onChange={handleChange}
        />
        {error ? (
          <p>The email and/or password seems to be incorrect. Please check it and try again.</p>
        ) : null}
        <button type="submit" ref={signUpButton}>
          Create account
        </button>
      </form>
      <Link to="../log-in">Log In</Link>
    </div>
  );
}
