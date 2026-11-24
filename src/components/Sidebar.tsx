import type { Exercise } from '../types';

interface SidebarProps {
  exercises: Exercise[];
  currentId: string;
}

export function Sidebar({ exercises, currentId }: SidebarProps) {
  return (
    <nav aria-label="Esercitazioni" className="w-64 shrink-0 overflow-y-auto bg-sand p-3">
      <p className="px-3 py-2 font-serif text-xl font-bold">Esercitazioni CCA-F</p>
      {exercises.map(({ id, code, title }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={id === currentId ? 'page' : undefined}
          className={`block rounded-lg px-3 py-2 ${id === currentId ? 'bg-accent text-white' : 'hover:bg-white'}`}
        >
          <span className="block text-xs font-bold">{code}</span>
          <span className="block text-sm">{title}</span>
        </a>
      ))}
    </nav>
  );
}
