const PATHS = {
  plus: 'M12 5v14M5 12h14',
  send: 'M12 19V5M6 11l6-6 6 6',
  chat: 'M4 5h16v11H9l-5 4z',
  folder: 'M3 6h7l2 2h9v11H3z',
  shapes: 'M4 4h7v7H4zM17.5 13l4 7h-8z',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  retry: 'M4 4v6h6M4.5 10a8 8 0 1 1-.5 4',
  up: 'M7 11v9H4v-9zM7 11l4-7c2 0 3 1 2.500 3L13 10h6l-1.500 10H7',
  down: 'M7 13V4H4v9zM7 13l4 7c2 0 3-1 2.500-3L13 14h6L17.500 4H7',
  edit: 'M4 20l1-4L16 5l3 3L8 19z',
  chevron: 'M6 9l6 6 6-6',
};

interface IconProps {
  name: keyof typeof PATHS;
  className?: string;
}

/** Icona decorativa: il significato è sempre nel testo vicino */
export function Icon({ name, className = 'size-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
