import type { Scene } from '../../types';
import { StepView } from '../StepView';
import { useFollowScroll } from '../useFollowScroll';
import { ChatComposer } from './ChatComposer';
import { ChatMessage } from './ChatMessage';
import { MessageActions } from './MessageActions';

interface ChatPaneProps {
  scene: Scene;
  pane: 0 | 1;
  index: number;
  progress: number;
}

export function ChatPane({ scene, pane, index, progress }: ChatPaneProps) {
  const bottomRef = useFollowScroll(index, progress);
  const isPreview = scene.source === 'kit';
  const inPane = scene.steps
    .map((step, stepIndex) => ({ step, stepIndex }))
    .filter(({ step }) => (step.pane ?? 0) === pane);

  // Il messaggio dell'utente resta nella casella finché non è stato scritto tutto
  const current = inPane.find(({ stepIndex }) => stepIndex === index)?.step;
  const draft = current?.kind === 'message' && current.role === 'user' && progress < 1 ? current : undefined;
  const visible = inPane.filter(({ step, stepIndex }) => stepIndex <= index && step !== draft);

  const last = visible.at(-1);
  const isAnswer = last && !(last.step.kind === 'message' && last.step.role === 'user');
  const isComplete = last && (last.stepIndex < index || progress === 1);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {scene.panes && (
        <div className="border-b border-line px-4 py-2 font-bold text-accent">{scene.panes[pane]}</div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {visible.map(({ step, stepIndex }) => {
            const stepProgress = stepIndex === index ? progress : 1;
            return (
              <div key={stepIndex} className="animate-enter">
                {step.kind === 'message' ? (
                  <ChatMessage message={step} progress={stepProgress} />
                ) : (
                  <StepView step={step} simulator="chat" progress={stepProgress} />
                )}
              </div>
            );
          })}
          {!isPreview && isAnswer && isComplete && <MessageActions />}
          <div ref={bottomRef} />
        </div>
      </div>
      {!isPreview && (
        <ChatComposer
          text={draft ? draft.text.slice(0, Math.ceil(draft.text.length * progress)) : ''}
          attachment={draft?.attachment}
        />
      )}
    </div>
  );
}
