import type { Scene } from '../../types';
import { ChatPane } from './ChatPane';
import { ChatSidebar } from './ChatSidebar';

interface ChatWindowProps {
  scene: Scene;
  chatTitle: string;
  index: number;
  progress: number;
}

export function ChatWindow({ scene, chatTitle, index, progress }: ChatWindowProps) {
  // Nel confronto lo spazio serve alle due chat; le scene "kit" mostrano solo il file
  const hasSidebar = !scene.panes && scene.source !== 'kit';
  return (
    <div className="@container flex min-h-0 flex-1">
      {hasSidebar && <ChatSidebar chatTitle={chatTitle} />}
      <div className="flex min-h-0 min-w-0 flex-1 divide-x divide-line">
        <ChatPane scene={scene} pane={0} index={index} progress={progress} />
        {scene.panes && <ChatPane scene={scene} pane={1} index={index} progress={progress} />}
      </div>
    </div>
  );
}
