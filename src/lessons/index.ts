import { d1Hooks } from './data/d1Hooks';
import { d1Loop } from './data/d1Loop';
import { d1Sessions } from './data/d1Sessions';
import { d1Subagents } from './data/d1Subagents';
import { d2Errors } from './data/d2Errors';
import { d2Mcp } from './data/d2Mcp';
import { d2Tools } from './data/d2Tools';
import { d3Memory } from './data/d3Memory';
import { d3Pipeline } from './data/d3Pipeline';
import { d3Skills } from './data/d3Skills';
import { d4Batch } from './data/d4Batch';
import { d4Criteria } from './data/d4Criteria';
import { d4Structured } from './data/d4Structured';
import { d5Context } from './data/d5Context';
import { d5Escalation } from './data/d5Escalation';
import { d5Review } from './data/d5Review';
import { p0Claude } from './data/p0Claude';
import { p1Json } from './data/p1Json';
import { p2Formats } from './data/p2Formats';
import { p3Network } from './data/p3Network';
import { p4Shell } from './data/p4Shell';
import { p5Dev } from './data/p5Dev';
import { p6Data } from './data/p6Data';
import { p7Ai } from './data/p7Ai';
import { p8Arch } from './data/p8Arch';
import type { Lesson, LessonGroup } from './types';

export const groupLabels: Record<LessonGroup, string> = {
  pre: 'Pre-corso',
  d1: 'Dominio 1 · Architettura agentica (27%)',
  d2: 'Dominio 2 · Strumenti e MCP (18%)',
  d3: 'Dominio 3 · Claude Code (20%)',
  d4: 'Dominio 4 · Prompt e output (20%)',
  d5: 'Dominio 5 · Contesto e affidabilità (15%)',
};

/** In ordine di programma */
export const lessons: Lesson[] = [
  p0Claude,
  p1Json,
  p2Formats,
  p3Network,
  p4Shell,
  p5Dev,
  p6Data,
  p7Ai,
  p8Arch,
  d1Loop,
  d1Subagents,
  d1Hooks,
  d1Sessions,
  d2Tools,
  d2Errors,
  d2Mcp,
  d3Memory,
  d3Skills,
  d3Pipeline,
  d4Criteria,
  d4Structured,
  d4Batch,
  d5Context,
  d5Escalation,
  d5Review,
];
