import type { ToolStep } from '../types';

interface ToolCallProps {
  tool: ToolStep;
}

const STATUS = {
  ok: { dot: 'bg-[#8fbc8f]', text: 'text-[#cfc5be]', label: '' },
  error: { dot: 'bg-[#e0b060]', text: 'text-[#e0b060]', label: 'ERRORE' },
  blocked: { dot: 'bg-[#f0907f]', text: 'text-[#f0a08f]', label: 'BLOCCATO' },
};

export function ToolCall({ tool }: ToolCallProps) {
  const status = STATUS[tool.status];
  return (
    <div className={tool.status === 'blocked' ? 'rounded-md border border-[#f0907f] p-3' : ''}>
      <div className="flex flex-wrap items-center gap-2 text-white">
        <span className={`size-3 rounded-full ${status.dot}`} />
        <span className="font-bold">{tool.name}</span>
        <span className="min-w-0 break-words">({tool.input})</span>
        {status.label && (
          <span className="rounded bg-[#f0907f] px-2 text-sm font-bold text-ink">{status.label}</span>
        )}
      </div>
      {tool.result && <div className={`mt-1 whitespace-pre-wrap pl-5 ${status.text}`}>└ {tool.result}</div>}
    </div>
  );
}
