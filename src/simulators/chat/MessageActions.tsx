import { Icon } from './Icon';

const ACTIONS = ['copy', 'up', 'down', 'retry'] as const;

/** Azioni illustrative sotto la risposta: copia, valutazione, rigenera */
export function MessageActions() {
  return (
    <div className="mt-2 flex animate-enter gap-3 text-muted" aria-hidden="true">
      {ACTIONS.map((name) => (
        <Icon key={name} name={name} />
      ))}
    </div>
  );
}
