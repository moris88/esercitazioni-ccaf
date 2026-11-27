import { type FormEvent, type ReactNode, useState } from 'react';
import { isAuthConfigured, useAuth } from '../useAuth';

const inputClass =
  'w-full rounded border border-line bg-white px-3 py-2 text-ink outline-none focus:border-accent';

/** Mostra il simulatore solo dopo l'accesso con utente e password */
export function LoginGate({ children }: { children: ReactNode }) {
  const { loggedIn, login, logout } = useAuth();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (loggedIn) {
    const handleLogout = () => {
      setUser('');
      setPassword('');
      setError('');
      logout();
    };
    return (
      <>
        {children}
        <button
          type="button"
          onClick={handleLogout}
          className="fixed top-3 right-4 z-50 rounded border border-line bg-white px-3 py-1.5 text-sm text-muted shadow-sm hover:border-accent hover:text-accent"
        >
          Esci
        </button>
      </>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!login(user.trim(), password)) setError('Utente o password non corretti.');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand p-4 font-sans text-ink">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-white p-6 shadow-sm"
      >
        <h1 className="font-serif text-2xl">Simulatore CCA-F</h1>
        {!isAuthConfigured && (
          <p role="alert" className="rounded bg-blush p-2 text-sm text-accent">
            Accesso non configurato: impostare VITE_LOGIN_USER e VITE_LOGIN_PASSWORD nel file .env.
          </p>
        )}
        <label className="block space-y-1 text-sm">
          <span>Utente</span>
          <input
            className={inputClass}
            autoComplete="username"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            required
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Password</span>
          <input
            className={inputClass}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-accent">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!isAuthConfigured}
          className="w-full rounded bg-accent px-3 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          Entra
        </button>
      </form>
    </main>
  );
}
