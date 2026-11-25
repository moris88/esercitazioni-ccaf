import type { Exercise } from '../types';
import { d1Hook } from './d1Hook';
import { d1Loop } from './d1Loop';
import { d1Sessions } from './d1Sessions';
import { d1Subagents } from './d1Subagents';
import { d2Descriptions } from './d2Descriptions';
import { d2Errors } from './d2Errors';
import { d2Mcp } from './d2Mcp';
import { d3Memory } from './d3Memory';
import { d3Pipeline } from './d3Pipeline';
import { d3Skills } from './d3Skills';
import { d4Criteria } from './d4Criteria';
import { d4Invoice } from './d4Invoice';
import { d4Review } from './d4Review';
import { d5Context } from './d5Context';
import { d5Escalation } from './d5Escalation';
import { d5Sources } from './d5Sources';
import { p1Basics } from './p1Basics';
import { p2Formats } from './p2Formats';
import { p3Network } from './p3Network';
import { p4Shell } from './p4Shell';
import { p5Development } from './p5Development';
import { p6Data } from './p6Data';
import { p7Ai } from './p7Ai';
import { p8Architecture } from './p8Architecture';

/** In ordine di programma */
export const exercises: Exercise[] = [
  p1Basics,
  p2Formats,
  p3Network,
  p4Shell,
  p5Development,
  p6Data,
  p7Ai,
  p8Architecture,
  d1Loop,
  d1Subagents,
  d1Hook,
  d1Sessions,
  d2Descriptions,
  d2Errors,
  d2Mcp,
  d3Memory,
  d3Skills,
  d3Pipeline,
  d4Criteria,
  d4Invoice,
  d4Review,
  d5Context,
  d5Escalation,
  d5Sources,
];
