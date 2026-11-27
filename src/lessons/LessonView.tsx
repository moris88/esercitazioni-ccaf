import { useState } from 'react';
import { PlayerControls } from '../components/PlayerControls';
import { usePlayerKeys } from '../player/usePlayerKeys';
import { Stage } from './Stage';
import type { Lesson, LessonScene } from './types';
import { useFramePlayer } from './useFramePlayer';

interface LessonViewProps {
  lesson: Lesson;
}

function SceneAnimation({ lesson, scene }: { lesson: Lesson; scene: LessonScene }) {
  const player = useFramePlayer(scene);
  usePlayerKeys(player.dispatch);
  const { index, total } = player;
  const atEnd = index === total - 1;

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <p className="rounded-lg bg-sand px-4 py-3">
          <span className="font-bold text-accent">Cosa vediamo: </span>
          {scene.description}
        </p>
        <Stage scene={scene} index={index} />
        <p
          key={index}
          aria-live="polite"
          className="min-h-20 animate-enter rounded-lg border-l-4 border-accent bg-blush px-4 py-3 text-lg"
        >
          {scene.frames[index].caption}
        </p>
        <PlayerControls player={player} total={total} />
      </div>
      <aside className="flex w-72 shrink-0 flex-col gap-5 overflow-y-auto border-l border-line p-5 2xl:w-80">
        <section>
          <h2 className="mb-2 text-sm font-bold text-accent uppercase">Obiettivo</h2>
          <p>{lesson.goal}</p>
        </section>
        <section
          className={`rounded-lg border-l-4 px-3 py-2 transition-all duration-500 ${
            atEnd ? 'border-accent bg-blush' : 'border-line text-muted'
          }`}
        >
          <h2 className="mb-1 text-sm font-bold uppercase">L'idea da ricordare</h2>
          <p>{scene.takeaway}</p>
        </section>
        <section className="rounded-lg bg-blush p-4">
          <strong>Il collegamento con l'esame: </strong>
          {lesson.exam}
        </section>
      </aside>
    </div>
  );
}

export function LessonView({ lesson }: LessonViewProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = lesson.scenes[sceneIndex];

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="border-b border-line px-5 py-4">
        <p className="text-sm font-bold text-accent uppercase">
          Animazione {lesson.code} · {lesson.lesson}
        </p>
        <h1 className="font-serif text-3xl font-bold">{lesson.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {lesson.scenes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={index === sceneIndex}
              onClick={() => setSceneIndex(index)}
              className={`rounded-full border px-4 py-1.5 ${
                index === sceneIndex ? 'border-accent bg-accent text-white' : 'border-line hover:bg-sand'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>
      {/* La chiave azzera l'animazione quando cambia la scena */}
      <SceneAnimation key={scene.id} lesson={lesson} scene={scene} />
    </main>
  );
}
