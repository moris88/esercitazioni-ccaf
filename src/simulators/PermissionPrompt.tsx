import type { PermissionStep } from '../types';

interface PermissionPromptProps {
  permission: PermissionStep;
}

export function PermissionPrompt({ permission }: PermissionPromptProps) {
  return (
    <div className="rounded-md border border-[#e0b060] p-3 text-white">
      <div className="mb-2 font-bold">{permission.question}</div>
      {permission.options.map((option, index) => (
        <div key={option} className={index === permission.choice ? 'text-[#e0b060]' : 'text-[#cfc5be]'}>
          {index === permission.choice ? '❯' : ' '} {index + 1}. {option}
        </div>
      ))}
    </div>
  );
}
