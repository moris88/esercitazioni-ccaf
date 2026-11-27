import { useState } from 'react';
import { ExerciseView } from './components/ExerciseView';
import { Sidebar } from './components/Sidebar';
import { exercises } from './exercises';
import { lessons } from './lessons';
import { LessonView } from './lessons/LessonView';
import { useHash } from './useHash';

const LESSON_PREFIX = 'animazioni/';

export function App() {
  const hash = useHash();
  const [menuOpen, setMenuOpen] = useState(true);
  const inLessons = hash === 'animazioni' || hash.startsWith(LESSON_PREFIX);
  const lesson = lessons.find(({ id }) => `${LESSON_PREFIX}${id}` === hash) ?? lessons[0];
  const exercise = exercises.find(({ id }) => id === hash) ?? exercises[0];
  const current = inLessons
    ? { section: 'lessons' as const, id: lesson.id }
    : { section: 'exercises' as const, id: exercise.id };

  return (
    <div className="flex h-screen">
      {menuOpen && <Sidebar exercises={exercises} current={current} />}
      <button
        type="button"
        aria-label={menuOpen ? "Nascondi l'elenco" : "Mostra l'elenco"}
        onClick={() => setMenuOpen((open) => !open)}
        className="w-6 shrink-0 border-r border-line bg-sand text-muted hover:text-accent"
      >
        {menuOpen ? '‹' : '›'}
      </button>
      {inLessons ? (
        <LessonView key={lesson.id} lesson={lesson} />
      ) : (
        <ExerciseView key={exercise.id} exercise={exercise} />
      )}
    </div>
  );
}
