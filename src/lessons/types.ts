/** Tipo di riquadro: cambia solo l'aspetto, non il comportamento */
export type ActorKind = 'box' | 'code' | 'note' | 'pill' | 'meter';

export interface Actor {
  id: string;
  label: string;
  /** Righe di dettaglio sotto il titolo; "\n" va a capo */
  body?: string;
  /** Posizione del centro, in percentuale della larghezza e dell'altezza della scena */
  x: number;
  y: number;
  /** Larghezza in percentuale (predefinita: 20) */
  w?: number;
  kind?: ActorKind;
  /** Riempimento da 0 a 100, solo per kind "meter" */
  value?: number;
  mark?: 'ok' | 'no';
  /** Primo e ultimo fotogramma in cui il riquadro è visibile */
  from?: number;
  until?: number;
}

/** Cambiamenti che un fotogramma applica a un riquadro; restano fino a un nuovo cambiamento */
export interface ActorPatch {
  label?: string;
  body?: string;
  value?: number;
  kind?: ActorKind;
  /** null toglie il segno */
  mark?: 'ok' | 'no' | null;
}

/** Un messaggio che viaggia da un riquadro a un altro: [da, a, etichetta] */
export type Flow = [from: string, to: string, label?: string];

export interface Frame {
  /** Frase in italiano semplice, letta da chi presenta */
  caption: string;
  /** Riquadri evidenziati in questo fotogramma */
  hot?: string[];
  flows?: Flow[];
  set?: Record<string, ActorPatch>;
}

export interface LessonScene {
  id: string;
  label: string;
  /** Spiega a chi guarda che cosa si vede a schermo */
  description: string;
  /** L'idea da portarsi a casa, evidenziata a fine animazione */
  takeaway: string;
  actors: Actor[];
  /** Frecce fisse tra i riquadri: [da, a] */
  links: [from: string, to: string][];
  frames: Frame[];
}

export type LessonGroup = 'pre' | 'd1' | 'd2' | 'd3' | 'd4' | 'd5';

export interface Lesson {
  id: string;
  group: LessonGroup;
  code: string;
  title: string;
  /** Lezione del corso a cui rimanda (come nelle presentazioni) */
  lesson: string;
  /** Una riga: che cosa si capisce dopo aver guardato */
  goal: string;
  exam: string;
  scenes: LessonScene[];
}
