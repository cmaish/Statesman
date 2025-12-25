/**
 * Unit tests for Step model
 */

import { Step } from '../Step';
import { StepType, NodeType } from '../types';

describe('Step', () => {
  test('should create basic step', () => {
    const step = new Step({
      id: 'step1',
      type: StepType.PROCESS,
      title: 'Process Step'
    });

    expect(step.id).toBe('step1');
    expect(step.type).toBe(StepType.PROCESS);
    expect(step.title).toBe('Process Step');
    expect(step.description).toBe('');
    expect(step.icon).toBe('');
  });

  test('should create step with all properties', () => {
    const step = new Step({
      id: 'step2',
      type: StepType.DECISION,
      title: 'Decision',
      description: 'Make a choice',
      icon: '🔀',
      properties: { key1: 'value1' }
    });

    expect(step.description).toBe('Make a choice');
    expect(step.icon).toBe('🔀');
    expect(step.properties).toEqual({ key1: 'value1' });
  });

  test('should create start step with default output node', () => {
    const step = new Step({
      id: 'start',
      type: StepType.START,
      title: 'Start'
    });

    expect(step.isStart()).toBe(true);
    expect(step.getOutputNodes().length).toBe(1);
    expect(step.getInputNodes().length).toBe(0);
  });

  test('should create end step with default input node', () => {
    const step = new Step({
      id: 'end',
      type: StepType.END,
      title: 'End'
    });

    expect(step.isEnd()).toBe(true);
    expect(step.getInputNodes().length).toBe(1);
    expect(step.getOutputNodes().length).toBe(0);
  });

  test('should add input and output nodes', () => {
    const step = new Step({
      id: 'step3',
      type: StepType.PROCESS,
      title: 'Process'
    });

    const input = step.addInputNode({ id: 'in1', type: NodeType.INPUT });
    const output = step.addOutputNode({ id: 'out1', type: NodeType.OUTPUT });

    expect(step.getInputNodes().length).toBe(1);
    expect(step.getOutputNodes().length).toBe(1);
    expect(step.getInputNode('in1')).toBe(input);
    expect(step.getOutputNode('out1')).toBe(output);
  });

  test('should create step with predefined nodes', () => {
    const step = new Step({
      id: 'step4',
      type: StepType.DECISION,
      title: 'Decision',
      inputNodes: [
        { id: 'in1', type: NodeType.INPUT, label: 'Input' }
      ],
      outputNodes: [
        { id: 'out1', type: NodeType.OUTPUT, label: 'True' },
        { id: 'out2', type: NodeType.OUTPUT, label: 'False' }
      ]
    });

    expect(step.getInputNodes().length).toBe(1);
    expect(step.getOutputNodes().length).toBe(2);
    expect(step.getOutputNode('out1')?.label).toBe('True');
  });

  test('should set and get position', () => {
    const step = new Step({
      id: 'step5',
      type: StepType.PROCESS,
      title: 'Process'
    });

    step.setPosition({ x: 150, y: 250 });
    const pos = step.position;

    expect(pos.x).toBe(150);
    expect(pos.y).toBe(250);
  });

  test('should get node by id from both input and output', () => {
    const step = new Step({
      id: 'step6',
      type: StepType.PROCESS,
      title: 'Process',
      inputNodes: [{ id: 'in1', type: NodeType.INPUT }],
      outputNodes: [{ id: 'out1', type: NodeType.OUTPUT }]
    });

    expect(step.getNode('in1')).toBeDefined();
    expect(step.getNode('out1')).toBeDefined();
    expect(step.getNode('nonexistent')).toBeUndefined();
  });

  test('should return nodes sorted by index', () => {
    const step = new Step({
      id: 'step7',
      type: StepType.PROCESS,
      title: 'Process',
      outputNodes: [
        { id: 'out2', type: NodeType.OUTPUT, index: 2 },
        { id: 'out0', type: NodeType.OUTPUT, index: 0 },
        { id: 'out1', type: NodeType.OUTPUT, index: 1 }
      ]
    });

    const nodes = step.getOutputNodes();
    expect(nodes[0].id).toBe('out0');
    expect(nodes[1].id).toBe('out1');
    expect(nodes[2].id).toBe('out2');
  });
});
