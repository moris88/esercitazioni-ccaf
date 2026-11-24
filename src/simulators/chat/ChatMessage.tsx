import type { MessageStep } from '../../types';
import { AttachmentCard } from './AttachmentCard';
import { Icon } from './Icon';
import { RichText } from './RichText';
import { TypingDots } from './TypingDots';

interface ChatMessageProps {
  message: MessageStep;
  progress: number;
}

/** Parte iniziale della risposta in cui si vedono solo i puntini */
const THINKING = 0.2;

export function ChatMessage({ message, progress }: ChatMessageProps) {
  const { role, text, attachment } = message;

  if (role === 'user') {
    return (
      <div className="flex flex-col items-end gap-2">
        {attachment && <AttachmentCard name={attachment} />}
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-sand px-4 py-3">
          {text}
        </div>
        <Icon name="edit" className="size-3.5 text-muted" />
      </div>
    );
  }

  if (progress < THINKING) return <TypingDots />;
  const shown = (progress - THINKING) / (1 - THINKING);
  return <RichText text={text.slice(0, Math.ceil(text.length * shown))} />;
}
