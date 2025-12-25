/**
 * Unit tests for StateMachine model
 */

import { StateMachine } from '../StateMachine';
import { Step } from '../Step';
import { Transition } from '../Transition';
import { StepType, NodeType } from '../types';

describe('StateMachine', () => {
  test('should create empty state machine', () => {
    const sm = new StateMachine({
      id: 'sm1',
      name: 'Test Machine'
    });

    expect(sm.id).toBe('sm1');
    expect(sm.name).toBe('Test Machine');
    expect(sm.getSteps().length).toBe(0);
    expect(sm.getTransitions().length).toBe(0);
  });

  test('should add and get steps', () => {
    const sm = new StateMachine({
      id: 'sm2',
      name: 'Test'
    });

    const step = new Step({
      id: 'step1',
      type: StepType.PROCESS,
      title: 'Process'
    });

    sm.addStep(step);

    expect(sm.getSteps().length).toBe(1);
    expect(sm.getStep('step1')).toBe(step);
  });

  test('should throw on duplicate step id', () => {
    const sm = new StateMachine({
      id: 'sm3',
      name: 'Test'
    });

    const step1 = new Step({
      id: 'step1',
      type: StepType.PROCESS,
      title: 'Process 1'
    });

    const step2 = new Step({
      id: 'step1',
      type: StepType.PROCESS,
      title: 'Process 2'
    });

    sm.addStep(step1);
    expect(() => sm.addStep(step2)).toThrow('Step with id step1 already exists');
  });

  test('should remove step', () => {
    const sm = new StateMachine({
      id: 'sm4',
      name: 'Test'
    });

    const step = new Step({
      id: 'step1',
      type: StepType.PROCESS,
      title: 'Process'
    });

    sm.addStep(step);
    expect(sm.getSteps().length).toBe(1);

    sm.removeStep('step1');
    expect(sm.getSteps().length).toBe(0);
  });

  test('should add transition', () => {
    const sm = new StateMachine({
      id: 'sm5',
      name: 'Test'
    });

    const step1 = new Step({
      id: 'step1',
      type: StepType.START,
      title: 'Start'
    });

    const step2 = new Step({
      id: 'step2',
      type: StepType.END,
      title: 'End'
    });

    sm.addStep(step1);
    sm.addStep(step2);

    const transition = new Transition({
      id: 'trans1',
      sourceNodeId: step1.getOutputNodes()[0].id,
      targetNodeId: step2.getInputNodes()[0].id
    });

    sm.addTransition(transition);

    expect(sm.getTransitions().length).toBe(1);
    expect(sm.getTransition('trans1')).toBe(transition);
  });

  test('should throw on invalid transition nodes', () => {
    const sm = new StateMachine({
      id: 'sm6',
      name: 'Test'
    });

    const transition = new Transition({
      id: 'trans1',
      sourceNodeId: 'nonexistent_out',
      targetNodeId: 'nonexistent_in'
    });

    expect(() => sm.addTransition(transition)).toThrow('Source node nonexistent_out not found');
  });

  test('should get start and end steps', () => {
    const sm = new StateMachine({
      id: 'sm7',
      name: 'Test'
    });

    const start = new Step({
      id: 'start',
      type: StepType.START,
      title: 'Start'
    });

    const end = new Step({
      id: 'end',
      type: StepType.END,
      title: 'End'
    });

    const process = new Step({
      id: 'process',
      type: StepType.PROCESS,
      title: 'Process'
    });

    sm.addStep(start);
    sm.addStep(end);
    sm.addStep(process);

    expect(sm.getStartSteps().length).toBe(1);
    expect(sm.getEndSteps().length).toBe(1);
    expect(sm.getStartSteps()[0]).toBe(start);
    expect(sm.getEndSteps()[0]).toBe(end);
  });

  test('should validate state machine', () => {
    const sm = new StateMachine({
      id: 'sm8',
      name: 'Test'
    });

    // No start step
    let validation = sm.validate();
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);

    // Add start step
    const start = new Step({
      id: 'start',
      type: StepType.START,
      title: 'Start'
    });
    sm.addStep(start);

    validation = sm.validate();
    expect(validation.valid).toBe(true);
  });

  test('should remove transitions when step is removed', () => {
    const sm = new StateMachine({
      id: 'sm9',
      name: 'Test'
    });

    const step1 = new Step({
      id: 'step1',
      type: StepType.START,
      title: 'Start'
    });

    const step2 = new Step({
      id: 'step2',
      type: StepType.END,
      title: 'End'
    });

    sm.addStep(step1);
    sm.addStep(step2);

    const transition = new Transition({
      id: 'trans1',
      sourceNodeId: step1.getOutputNodes()[0].id,
      targetNodeId: step2.getInputNodes()[0].id
    });

    sm.addTransition(transition);
    expect(sm.getTransitions().length).toBe(1);

    sm.removeStep('step1');
    expect(sm.getTransitions().length).toBe(0);
  });

  test('should get transitions from and to nodes', () => {
    const sm = new StateMachine({
      id: 'sm10',
      name: 'Test'
    });

    const step1 = new Step({
      id: 'step1',
      type: StepType.START,
      title: 'Start'
    });

    const step2 = new Step({
      id: 'step2',
      type: StepType.PROCESS,
      title: 'Process',
      inputNodes: [{ id: 'in1', type: NodeType.INPUT }],
      outputNodes: [{ id: 'out1', type: NodeType.OUTPUT }]
    });

    const step3 = new Step({
      id: 'step3',
      type: StepType.END,
      title: 'End'
    });

    sm.addStep(step1);
    sm.addStep(step2);
    sm.addStep(step3);

    const trans1 = new Transition({
      id: 'trans1',
      sourceNodeId: step1.getOutputNodes()[0].id,
      targetNodeId: 'in1'
    });

    const trans2 = new Transition({
      id: 'trans2',
      sourceNodeId: 'out1',
      targetNodeId: step3.getInputNodes()[0].id
    });

    sm.addTransition(trans1);
    sm.addTransition(trans2);

    expect(sm.getTransitionsToNode('in1').length).toBe(1);
    expect(sm.getTransitionsFromNode('out1').length).toBe(1);
  });
});
