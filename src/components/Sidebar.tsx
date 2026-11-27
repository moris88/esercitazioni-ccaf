import { groupLabels, lessons } from '../lessons';
import type { Exercise } from '../types';

interface SidebarProps {
  exercises: Exercise[];
  /** Esercitazione o animazione in primo piano */
  current: { section: 'exercises' | 'lessons'; id: string };
}

const TAB = 'min-w-0 flex-1 truncate rounded-lg px-2 py-2 text-center text-[0.8rem] font-bold';

export function Sidebar({ exercises, current }: SidebarProps) {
  const inLessons = current.section === 'lessons';
  const groups = [...new Set(lessons.map(({ group }) => group))];

  return (
    <nav
      aria-label={inLessons ? 'Animazioni' : 'Esercitazioni'}
      className="w-72 shrink-0 overflow-x-hidden overflow-y-auto bg-sand p-3"
    >
      <p className="px-3 py-2 font-serif text-xl font-bold">CCA-F</p>
      <a
        href={`${import.meta.env.BASE_URL}materiali-corso.zip`}
        download
        className="mb-3 block rounded-xl border border-accent px-3 py-2 text-center text-sm font-bold text-accent hover:bg-white"
      >
        Scarica materiali (.zip)
      </a>
      <div className="mb-3 flex gap-1 rounded-xl bg-white p-1">
        <a
          href={`#${exercises[0].id}`}
          aria-current={inLessons ? undefined : 'page'}
          className={`${TAB} ${inLessons ? 'hover:bg-sand' : 'bg-accent text-white'}`}
        >
          Esercitazioni
        </a>
        <a
          href={`#animazioni/${lessons[0].id}`}
          aria-current={inLessons ? 'page' : undefined}
          className={`${TAB} ${inLessons ? 'bg-accent text-white' : 'hover:bg-sand'}`}
        >
          Animazioni
        </a>
      </div>
      {inLessons
        ? groups.map((group) => (
            <section key={group} className="mb-3">
              <h2 className="px-3 py-1 text-xs font-bold text-muted uppercase">{groupLabels[group]}</h2>
              {lessons
                .filter((lesson) => lesson.group === group)
                .map(({ id, code, title }) => (
                  <a
                    key={id}
                    href={`#animazioni/${id}`}
                    aria-current={id === current.id ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-2 ${id === current.id ? 'bg-accent text-white' : 'hover:bg-white'}`}
                  >
                    <span className="block text-xs font-bold">{code}</span>
                    <span className="block text-sm">{title}</span>
                  </a>
                ))}
            </section>
          ))
        : exercises.map(({ id, code, title }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={id === current.id ? 'page' : undefined}
              className={`block rounded-lg px-3 py-2 ${id === current.id ? 'bg-accent text-white' : 'hover:bg-white'}`}
            >
              <span className="block text-xs font-bold">{code}</span>
              <span className="block text-sm">{title}</span>
            </a>
          ))}
    </nav>
  );
}
