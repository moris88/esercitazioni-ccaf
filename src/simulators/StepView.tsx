import type { Simulator, Step, Tone } from '../types';
import { ChatMessage } from './ChatMessage';
import { CommandLine } from './CommandLine';
import { ContextMeter } from './ContextMeter';
import { PermissionPrompt } from './PermissionPrompt';
import { StepTable } from './StepTable';
import { ToolCall } from './ToolCall';

interface StepViewProps {
  step: Step;
  simulator: Simulator;
  /** Parte di testo visibile, da 0 a 1 */
  progress: number;
}

const TONES: Record<Tone, string> = {
  normal: 'text-[#f3eeea]',
  muted: 'text-[#b3a8a1]',
  error: 'text-[#f0a08f]',
  info: 'text-[#9cc4dc]',
};

export function StepView({ step, simulator, progress }: StepViewProps) {
  const visible = (text: string) => text.slice(0, Math.ceil(text.length * progress));
  const typing = progress < 1;

  switch (step.kind) {
    case 'command':
      return (
        <CommandLine prompt={simulator === 'code' ? '>' : '$'} text={visible(step.text)} typing={typing} />
      );
    case 'output':
      return (
        <div className={`whitespace-pre-wrap break-words ${TONES[step.tone ?? 'normal']}`}>{step.text}</div>
      );
    case 'divider':
      return (
        <div
          className={`mt-2 border-b border-current/30 pb-1 font-bold ${simulator === 'chat' ? 'text-accent' : 'text-[#e08a7a]'}`}
        >
          {step.text}
        </div>
      );
    case 'message':
      if (simulator === 'chat')
        return <ChatMessage role={step.role} text={visible(step.text)} attachment={step.attachment} />;
      return step.role === 'user' ? (
        <CommandLine prompt=">" text={visible(step.text)} typing={typing} />
      ) : (
        <div className="whitespace-pre-wrap text-[#f3eeea]">{visible(step.text)}</div>
      );
    case 'table':
      return <StepTable table={step} dark={simulator !== 'chat'} />;
    case 'tool':
      return <ToolCall tool={step} />;
    case 'meter':
      return <ContextMeter meter={step} />;
    case 'permission':
      return <PermissionPrompt permission={step} />;
  }
}
