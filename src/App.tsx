import { useState } from 'react';
import { ExerciseView } from './components/ExerciseView';
import { Sidebar } from './components/Sidebar';
import { exercises } from './exercises';
import { useHash } from './useHash';

export function App() {
  const hash = useHash();
  const [menuOpen, setMenuOpen] = useState(true);
  const current = exercises.find(({ id }) => id === hash) ?? exercises[0];

  return (
    <div className="flex h-screen">
      {menuOpen && <Sidebar exercises={exercises} currentId={current.id} />}
      <button
        type="button"
        aria-label={menuOpen ? "Nascondi l'elenco" : "Mostra l'elenco"}
        onClick={() => setMenuOpen((open) => !open)}
        className="w-6 shrink-0 border-r border-line bg-sand text-muted hover:text-accent"
      >
        {menuOpen ? '‹' : '›'}
      </button>
      <ExerciseView key={current.id} exercise={current} />
    </div>
  );
}
