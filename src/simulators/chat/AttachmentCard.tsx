import { Icon } from './Icon';

interface AttachmentCardProps {
  name: string;
}

export function AttachmentCard({ name }: AttachmentCardProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-line bg-white px-3 py-2 text-sm">
      <span className="rounded-lg bg-blush p-2 text-accent">
        <Icon name="file" className="size-5" />
      </span>
      <span>
        <span className="block font-bold">{name}</span>
        <span className="block text-xs text-muted">Testo</span>
      </span>
    </div>
  );
}
