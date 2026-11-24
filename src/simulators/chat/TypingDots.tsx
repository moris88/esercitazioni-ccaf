const DELAYS = [0, 150, 300];

export function TypingDots() {
  return (
    <div className="flex gap-1.5 py-3" role="status" aria-label="Claude sta scrivendo">
      {DELAYS.map((delay) => (
        <span
          key={delay}
          className="size-2.5 animate-bounce rounded-full bg-accent"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}
