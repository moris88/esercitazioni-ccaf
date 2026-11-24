import type { MeterStep } from '../types';

interface ContextMeterProps {
  meter: MeterStep;
}

export function ContextMeter({ meter }: ContextMeterProps) {
  return (
    <div className="text-[#f3eeea]">
      <div className="mb-1 flex justify-between">
        <span>{meter.label}</span>
        <span>{meter.percent}%</span>
      </div>
      <div className="h-5 overflow-hidden rounded bg-[#3a3330]">
        <div className="h-full origin-left animate-grow bg-accent" style={{ width: `${meter.percent}%` }} />
      </div>
    </div>
  );
}
