import type { Exercise } from '../types';
import { d0Basics } from './d0Basics';
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
import { p1Formats } from './p1Formats';
import { p2Network } from './p2Network';
import { p3Shell } from './p3Shell';
import { p4Development } from './p4Development';
import { p5Data } from './p5Data';
import { p6Ai } from './p6Ai';
import { p7Architecture } from './p7Architecture';

/** In ordine di programma */
export const exercises: Exercise[] = [
  d0Basics,
  p1Formats,
  p2Network,
  p3Shell,
  p4Development,
  p5Data,
  p6Ai,
  p7Architecture,
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
