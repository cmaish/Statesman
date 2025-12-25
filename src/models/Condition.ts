/**
 * Transition condition models
 */

import { ConditionType } from './types';

/**
 * Base interface for all conditions
 */
export interface ICondition {
  readonly type: ConditionType;
  evaluate(context: unknown): boolean;
  toString(): string;
}

/**
 * Message matching condition using regex
 */
export class MessageMatchCondition implements ICondition {
  readonly type = ConditionType.MESSAGE_MATCH;

  constructor(
    private readonly pattern: string,
    private readonly flags: string = 'i'
  ) {
    // Validate regex pattern
    new RegExp(pattern, flags);
  }

  evaluate(message: unknown): boolean {
    if (typeof message !== 'string') {
      return false;
    }
    const regex = new RegExp(this.pattern, this.flags);
    return regex.test(message);
  }

  toString(): string {
    return `Match: /${this.pattern}/${this.flags}`;
  }

  getPattern(): string {
    return this.pattern;
  }

  getFlags(): string {
    return this.flags;
  }
}

/**
 * Timed delay condition
 */
export class TimedDelayCondition implements ICondition {
  readonly type = ConditionType.TIMED_DELAY;

  constructor(private readonly delayMs: number) {
    if (delayMs < 0) {
      throw new Error('Delay must be non-negative');
    }
  }

  evaluate(context: unknown): boolean {
    // In a real implementation, this would check elapsed time
    // For now, always returns true
    return true;
  }

  toString(): string {
    return `Delay: ${this.delayMs}ms`;
  }

  getDelay(): number {
    return this.delayMs;
  }
}

/**
 * No condition (always passes)
 */
export class NoCondition implements ICondition {
  readonly type = ConditionType.NONE;

  evaluate(): boolean {
    return true;
  }

  toString(): string {
    return '';
  }
}
