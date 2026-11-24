import { Icon } from './Icon';

interface ChatSidebarProps {
  chatTitle: string;
}

const SECTIONS = [
  { icon: 'chat', label: 'Chat' },
  { icon: 'folder', label: 'Progetti' },
  { icon: 'shapes', label: 'Artefatti' },
] as const;

/** Barra laterale illustrativa: le voci non sono cliccabili */
export function ChatSidebar({ chatTitle }: ChatSidebarProps) {
  return (
    <div
      aria-hidden="true"
      className="hidden w-44 shrink-0 flex-col gap-1 border-r border-line bg-sand p-3 text-sm @3xl:flex"
    >
      <div className="mb-2 flex items-center gap-2 font-bold text-accent">
        <span className="rounded-full bg-accent p-1 text-white">
          <Icon name="plus" />
        </span>
        Nuova chat
      </div>
      {SECTIONS.map(({ icon, label }) => (
        <div key={label} className="flex items-center gap-2 px-1 py-1">
          <Icon name={icon} /> {label}
        </div>
      ))}
      <div className="mt-4 px-1 text-xs text-muted">Recenti</div>
      <div className="truncate rounded-lg bg-white px-2 py-1.5">{chatTitle}</div>
    </div>
  );
}
