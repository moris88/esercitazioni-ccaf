import type { Scene } from '../types';
import { ChatWindow } from './chat/ChatWindow';
import { SimulatorPane } from './SimulatorPane';

interface SimulatorWindowProps {
  scene: Scene;
  chatTitle: string;
  index: number;
  progress: number;
}

const KIND_LABEL = { terminal: 'Terminale', chat: 'Chat', code: 'Claude Code' };
const SOURCE_LABEL = { reale: 'output reale registrato', esempio: 'output di esempio', kit: 'dati del kit' };

export function SimulatorWindow({ scene, chatTitle, index, progress }: SimulatorWindowProps) {
  const isChat = scene.simulator === 'chat';
  const kind = isChat && scene.source === 'kit' ? 'Anteprima file' : KIND_LABEL[scene.simulator];
  return (
    <section
      aria-label="Simulazione"
      className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border shadow-lg ${
        isChat
          ? 'border-line bg-white text-[17px]'
          : 'border-ink bg-ink font-mono text-[17px] leading-relaxed'
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 text-sm ${isChat ? 'bg-sand text-muted' : 'bg-[#3a3330] text-[#cfc5be]'}`}
      >
        <span>
          {kind} · {scene.title}
        </span>
        <span className="rounded-full bg-accent px-3 py-0.5 text-white">
          Simulazione · {SOURCE_LABEL[scene.source]}
        </span>
      </div>
      {isChat ? (
        <ChatWindow scene={scene} chatTitle={chatTitle} index={index} progress={progress} />
      ) : (
        <div className="flex min-h-0 flex-1 divide-x divide-line">
          <SimulatorPane scene={scene} pane={0} index={index} progress={progress} />
          {scene.panes && <SimulatorPane scene={scene} pane={1} index={index} progress={progress} />}
        </div>
      )}
    </section>
  );
}
