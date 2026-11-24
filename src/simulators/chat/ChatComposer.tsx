import { AttachmentCard } from './AttachmentCard';
import { Icon } from './Icon';

interface ChatComposerProps {
  text: string;
  attachment?: string;
}

/** Casella del messaggio: mostra il testo mentre viene "scritto" */
export function ChatComposer({ text, attachment }: ChatComposerProps) {
  return (
    <div className="px-4 pb-3">
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-3 shadow-md">
        {attachment && (
          <div className="mb-2 animate-enter">
            <AttachmentCard name={attachment} />
          </div>
        )}
        {/* In colonna inversa resta visibile la fine del testo */}
        <div className="flex max-h-32 min-h-7 flex-col-reverse overflow-hidden">
          <div className="whitespace-pre-wrap break-words">
            {text || <span className="text-muted">Scrivi un messaggio…</span>}
            {text && (
              <span className="ml-0.5 inline-block h-[1.1em] w-0.5 animate-blink bg-ink align-middle" />
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-muted" aria-hidden="true">
          <span className="rounded-lg border border-line p-1.5">
            <Icon name="plus" />
          </span>
          <span className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              Modello <Icon name="chevron" className="size-3" />
            </span>
            <span
              className={`rounded-lg p-1.5 text-white transition-colors ${text ? 'bg-accent' : 'bg-accent/40'}`}
            >
              <Icon name="send" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
