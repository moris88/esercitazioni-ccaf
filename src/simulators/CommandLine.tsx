interface CommandLineProps {
  prompt: string;
  text: string;
  typing: boolean;
}

export function CommandLine({ prompt, text, typing }: CommandLineProps) {
  return (
    <div className="whitespace-pre-wrap break-words text-white">
      <span className="text-[#e08a7a]">{prompt} </span>
      {text}
      {typing && <span className="ml-0.5 inline-block h-[1.1em] w-2 animate-blink bg-white align-middle" />}
    </div>
  );
}
