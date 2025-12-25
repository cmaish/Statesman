/**
 * Core type definitions for the state machine diagram library
 */

/**
 * Unique identifier type
 */
export type Id = string;

/**
 * Position in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Size dimensions
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Bounding box
 */
export interface BoundingBox extends Point, Size {}

/**
 * Step type enumeration
 */
export enum StepType {
  START = 'start',
  END = 'end',
  PROCESS = 'process',
  DECISION = 'decision',
  CUSTOM = 'custom'
}

/**
 * Node type enumeration (input/output)
 */
export enum NodeType {
  INPUT = 'input',
  OUTPUT = 'output'
}

/**
 * Condition type for transitions
 */
export enum ConditionType {
  MESSAGE_MATCH = 'message_match',
  TIMED_DELAY = 'timed_delay',
  NONE = 'none'
}

/**
 * Properties dictionary
 */
export type Properties = Record<string, unknown>;
