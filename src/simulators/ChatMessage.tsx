interface ChatMessageProps {
  role: 'user' | 'assistant';
  text: string;
  attachment?: string;
}

export function ChatMessage({ role, text, attachment }: ChatMessageProps) {
  const isUser = role === 'user';
  return (
    <div className={isUser ? 'flex flex-col items-end' : ''}>
      <div className={isUser ? 'max-w-[85%] rounded-2xl bg-sand px-4 py-3' : 'px-1 py-2'}>
        {attachment && (
          <div className="mb-2 inline-block rounded-lg border border-line bg-white px-3 py-1 text-sm text-muted">
            📎 {attachment}
          </div>
        )}
        <div className="whitespace-pre-wrap break-words">{text}</div>
      </div>
    </div>
  );
}
