export type Tone = 'normal' | 'muted' | 'error' | 'info';

interface StepBase {
  /** Riquadro in cui appare il passo, nelle scene a confronto */
  pane?: 0 | 1;
  /** Indici dei punti "Cosa far osservare" rivelati da questo passo */
  observe?: number[];
  /** Nodi accesi nello schema; due nodi consecutivi accendono anche la freccia */
  path?: string[];
  /** Didascalia per chi presenta */
  note?: string;
}

export interface CommandStep extends StepBase {
  kind: 'command';
  text: string;
}
export interface OutputStep extends StepBase {
  kind: 'output';
  text: string;
  tone?: Tone;
}
export interface DividerStep extends StepBase {
  kind: 'divider';
  text: string;
}
export interface MessageStep extends StepBase {
  kind: 'message';
  role: 'user' | 'assistant';
  text: string;
  attachment?: string;
}
export interface TableStep extends StepBase {
  kind: 'table';
  columns: string[];
  rows: string[][];
  /** Indici delle righe da evidenziare */
  highlight?: number[];
}
export interface ToolStep extends StepBase {
  kind: 'tool';
  name: string;
  input: string;
  result?: string;
  status: 'ok' | 'blocked' | 'error';
}
export interface PermissionStep extends StepBase {
  kind: 'permission';
  question: string;
  options: string[];
  choice: number;
}

/** Spazio occupato nella finestra di contesto */
export interface MeterStep extends StepBase {
  kind: 'meter';
  label: string;
  percent: number;
}

export type Step =
  | CommandStep
  | OutputStep
  | DividerStep
  | MessageStep
  | TableStep
  | ToolStep
  | PermissionStep
  | MeterStep;

export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
}
export interface DiagramEdge {
  from: string;
  to: string;
}
export interface Diagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export type Simulator = 'terminal' | 'chat' | 'code';

export interface Scene {
  id: string;
  label: string;
  /** Spiega a chi guarda che cosa si vede a schermo */
  description: string;
  simulator: Simulator;
  /** "reale": output registrato; "esempio": scritto per la lezione; "kit": dati del kit */
  source: 'reale' | 'esempio' | 'kit';
  /** Titolo della finestra simulata */
  title: string;
  /** Titoli dei due riquadri, nelle scene a confronto */
  panes?: [string, string];
  diagram?: Diagram;
  steps: Step[];
}

export interface Exercise {
  id: string;
  code: string;
  lesson: string;
  title: string;
  place: string;
  minutes: number;
  goal: string;
  observe: string[];
  exam: string;
  scenes: Scene[];
}
