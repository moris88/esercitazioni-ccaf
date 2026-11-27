import { useState } from 'react';

const STORAGE_KEY = 'simulatore-auth';

/** Credenziali lette dalle ENV al momento della build: finiscono nel bundle, quindi non sono un segreto */
const expectedUser = import.meta.env.VITE_LOGIN_USER;
const expectedPassword = import.meta.env.VITE_LOGIN_PASSWORD;

export const isAuthConfigured = Boolean(expectedUser && expectedPassword);

function readStored() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Accesso semplice per la presentazione: vale finché la scheda del browser resta aperta */
export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(readStored);

  const login = (user: string, password: string) => {
    const ok = isAuthConfigured && user === expectedUser && password === expectedPassword;
    if (ok) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // Archivio non disponibile: l'accesso vale solo fino al ricaricamento
      }
      setLoggedIn(true);
    }
    return ok;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Archivio non disponibile: basta aggiornare lo stato
    }
    setLoggedIn(false);
  };

  return { loggedIn, login, logout };
}
