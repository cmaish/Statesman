/**
 * Unit tests for Builder classes
 */

import { StepBuilder, TransitionBuilder, StateMachineBuilder } from '../StepBuilder';
import { StepType } from '../../models/types';
import { MessageMatchCondition } from '../../models/Condition';

describe('StepBuilder', () => {
  test('should build basic step', () => {
    const step = StepBuilder.create('step1')
      .withType(StepType.PROCESS)
      .withTitle('My Process')
      .build();

    expect(step.id).toBe('step1');
    expect(step.type).toBe(StepType.PROCESS);
    expect(step.title).toBe('My Process');
  });

  test('should build step with convenience methods', () => {
    const step = StepBuilder.create('start1')
      .asStart()
      .withTitle('Start')
      .build();

    expect(step.type).toBe(StepType.START);
    expect(step.isStart()).toBe(true);
  });

  test('should build decision step with outputs', () => {
    const step = StepBuilder.create('decision1')
      .asDecision()
      .withTitle('Choice')
      .withDecisionOutputs('yes', 'no')
      .build();

    const outputs = step.getOutputNodes();
    expect(outputs.length).toBe(2);
    expect(outputs[0].label).toBe('yes');
    expect(outputs[1].label).toBe('no');
  });

  test('should build step with properties', () => {
    const step = StepBuilder.create('step1')
      .asProcess()
      .withTitle('Process')
      .withProperty('timeout', 5000)
      .withProperty('retry', 3)
      .build();

    expect(step.properties.timeout).toBe(5000);
    expect(step.properties.retry).toBe(3);
  });

  test('should build step with custom input/output nodes', () => {
    const step = StepBuilder.create('step1')
      .asProcess()
      .withTitle('Multi-IO')
      .withInputNodes(2, 'input')
      .withOutputNodes(3)
      .build();

    expect(step.getInputNodes().length).toBe(2);
    expect(step.getOutputNodes().length).toBe(3);
  });

  test('should throw if required fields missing', () => {
    expect(() => {
      StepBuilder.create('step1').build();
    }).toThrow('Step type is required');
  });

  test('should use id as title if not provided', () => {
    const step = StepBuilder.create('my-step')
      .asProcess()
      .build();

    expect(step.title).toBe('my-step');
  });
});

describe('TransitionBuilder', () => {
  test('should build basic transition', () => {
    const transition = TransitionBuilder.create('trans1')
      .from('node1')
      .to('node2')
      .build();

    expect(transition.id).toBe('trans1');
    expect(transition.sourceNodeId).toBe('node1');
    expect(transition.targetNodeId).toBe('node2');
  });

  test('should build transition with connect shorthand', () => {
    const transition = TransitionBuilder.connect('source', 'target').build();

    expect(transition.id).toBe('source_to_target');
    expect(transition.sourceNodeId).toBe('source');
    expect(transition.targetNodeId).toBe('target');
  });

  test('should build transition with message match condition', () => {
    const transition = TransitionBuilder.create('trans1')
      .from('out1')
      .to('in1')
      .withMessageMatch('success', 'i')
      .build();

    expect(transition.hasCondition()).toBe(true);
    expect(transition.condition).toBeInstanceOf(MessageMatchCondition);
  });

  test('should build transition with delay', () => {
    const transition = TransitionBuilder.create('trans1')
      .from('out1')
      .to('in1')
      .withDelay(1000)
      .build();

    expect(transition.hasCondition()).toBe(true);
  });

  test('should build transition with label', () => {
    const transition = TransitionBuilder.create('trans1')
      .from('out1')
      .to('in1')
      .withLabel('Success Path')
      .build();

    expect(transition.label).toBe('Success Path');
  });

  test('should throw if required fields missing', () => {
    expect(() => {
      TransitionBuilder.create('trans1').build();
    }).toThrow();
  });
});

describe('StateMachineBuilder', () => {
  test('should build state machine', () => {
    const start = StepBuilder.create('start').asStart().withTitle('Start').build();
    const end = StepBuilder.create('end').asEnd().withTitle('End').build();

    const sm = StateMachineBuilder.create('sm1')
      .withName('Test Machine')
      .withDescription('A test')
      .addStep(start)
      .addStep(end)
      .build();

    expect(sm.id).toBe('sm1');
    expect(sm.name).toBe('Test Machine');
    expect(sm.getSteps().length).toBe(2);
  });

  test('should use id as name if not provided', () => {
    const sm = StateMachineBuilder.create('my-machine').build();
    expect(sm.name).toBe('my-machine');
  });
});
