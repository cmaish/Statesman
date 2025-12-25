/**
 * Unit tests for Condition models
 */

import {
  MessageMatchCondition,
  TimedDelayCondition,
  NoCondition
} from '../Condition';
import { ConditionType } from '../types';

describe('MessageMatchCondition', () => {
  test('should create with valid pattern', () => {
    const condition = new MessageMatchCondition('hello', 'i');
    expect(condition.type).toBe(ConditionType.MESSAGE_MATCH);
    expect(condition.getPattern()).toBe('hello');
    expect(condition.getFlags()).toBe('i');
  });

  test('should throw on invalid regex pattern', () => {
    expect(() => new MessageMatchCondition('[')).toThrow();
  });

  test('should evaluate matching messages', () => {
    const condition = new MessageMatchCondition('hello', 'i');
    expect(condition.evaluate('Hello World')).toBe(true);
    expect(condition.evaluate('HELLO')).toBe(true);
  });

  test('should evaluate non-matching messages', () => {
    const condition = new MessageMatchCondition('hello', 'i');
    expect(condition.evaluate('Goodbye')).toBe(false);
    expect(condition.evaluate(123)).toBe(false);
  });

  test('should respect case sensitivity', () => {
    const condition = new MessageMatchCondition('hello', '');
    expect(condition.evaluate('hello')).toBe(true);
    expect(condition.evaluate('Hello')).toBe(false);
  });

  test('should return correct string representation', () => {
    const condition = new MessageMatchCondition('test', 'gi');
    expect(condition.toString()).toBe('Match: /test/gi');
  });
});

describe('TimedDelayCondition', () => {
  test('should create with valid delay', () => {
    const condition = new TimedDelayCondition(1000);
    expect(condition.type).toBe(ConditionType.TIMED_DELAY);
    expect(condition.getDelay()).toBe(1000);
  });

  test('should throw on negative delay', () => {
    expect(() => new TimedDelayCondition(-100)).toThrow('Delay must be non-negative');
  });

  test('should always evaluate to true', () => {
    const condition = new TimedDelayCondition(1000);
    expect(condition.evaluate({})).toBe(true);
  });

  test('should return correct string representation', () => {
    const condition = new TimedDelayCondition(500);
    expect(condition.toString()).toBe('Delay: 500ms');
  });
});

describe('NoCondition', () => {
  test('should have correct type', () => {
    const condition = new NoCondition();
    expect(condition.type).toBe(ConditionType.NONE);
  });

  test('should always evaluate to true', () => {
    const condition = new NoCondition();
    expect(condition.evaluate(null)).toBe(true);
    expect(condition.evaluate({})).toBe(true);
  });

  test('should return empty string', () => {
    const condition = new NoCondition();
    expect(condition.toString()).toBe('');
  });
});
