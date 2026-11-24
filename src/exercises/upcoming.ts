import type { Exercise } from '../types';

/** Esercitazioni in elenco, con animazione ancora da realizzare */
function upcoming(id: string, code: string, title: string): Exercise {
  return { id, code, title, lesson: '', place: '', minutes: 0, goal: '', observe: [], exam: '', scenes: [] };
}

export const upcomingExercises: Exercise[] = [
  upcoming('0', '0', 'JSON, schema e regex con Claude'),
  upcoming('d1-2', 'D1·2', 'Subagenti in parallelo e contesto che non si eredita'),
  upcoming('d1-4', 'D1·4', 'Riprendere, aggiornare e ramificare una sessione'),
  upcoming('d2-1', 'D2·1', 'Descrizioni vaghe contro descrizioni chiare'),
  upcoming('d2-2', 'D2·2', 'Vuoto, errore o soppressione silenziosa'),
  upcoming('d2-3', 'D2·3', 'Aggiungere un server MCP al progetto'),
  upcoming('d3-1', 'D3·1', 'CLAUDE.md e una regola per percorso'),
  upcoming('d3-2', 'D3·2', 'Una skill, il plan mode e un subagente'),
  upcoming('d3-3', 'D3·3', 'Claude Code come in una pipeline'),
  upcoming('d4-2', 'D4·2', 'Estrarre una fattura con uno schema'),
  upcoming('d4-3', 'D4·3', 'Autorevisione contro revisione indipendente'),
  upcoming('d5-1', 'D5·1', 'Contesto, compattazione e fatti del caso'),
  upcoming('d5-2', 'D5·2', "L'agente di supporto: quando passare la mano"),
  upcoming('d5-3', 'D5·3', 'Fonti in conflitto e confidenza per campo'),
];
