import { Icon } from './Icon';

interface RichTextProps {
  text: string;
}

const FENCE = '```';

/** Testo con blocchi di codice delimitati da tre apici inversi, anche non ancora chiusi */
export function RichText({ text }: RichTextProps) {
  return text.split(FENCE).map((part, index) => {
    const isCode = index % 2 === 1;
    const content = part.replace(/^\w*\n|\n$/g, '');
    if (!content) return null;
    if (!isCode) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: i blocchi si aggiungono solo in fondo
        <p key={index} className="my-2 whitespace-pre-wrap break-words leading-relaxed">
          {content}
        </p>
      );
    }
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: i blocchi si aggiungono solo in fondo
      <div key={index} className="my-2 overflow-hidden rounded-xl border border-line bg-sand">
        <div className="flex items-center justify-between border-b border-line px-3 py-1 text-xs text-muted">
          {part.match(/^\w+/)?.[0] ?? 'testo'}
          <Icon name="copy" className="size-3.5" />
        </div>
        <pre className="whitespace-pre-wrap break-words p-3 font-mono text-[0.85em]">{content}</pre>
      </div>
    );
  });
}
