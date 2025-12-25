/**
 * Unit tests for Node model
 */

import { Node } from '../Node';
import { NodeType } from '../types';

describe('Node', () => {
  test('should create input node', () => {
    const node = new Node({
      id: 'node1',
      type: NodeType.INPUT,
      label: 'Input 1'
    });

    expect(node.id).toBe('node1');
    expect(node.type).toBe(NodeType.INPUT);
    expect(node.label).toBe('Input 1');
    expect(node.isInput()).toBe(true);
    expect(node.isOutput()).toBe(false);
  });

  test('should create output node', () => {
    const node = new Node({
      id: 'node2',
      type: NodeType.OUTPUT,
      label: 'Output 1'
    });

    expect(node.id).toBe('node2');
    expect(node.type).toBe(NodeType.OUTPUT);
    expect(node.isInput()).toBe(false);
    expect(node.isOutput()).toBe(true);
  });

  test('should default to empty label', () => {
    const node = new Node({
      id: 'node3',
      type: NodeType.INPUT
    });

    expect(node.label).toBe('');
  });

  test('should default to index 0', () => {
    const node = new Node({
      id: 'node4',
      type: NodeType.OUTPUT
    });

    expect(node.index).toBe(0);
  });

  test('should set and get position', () => {
    const node = new Node({
      id: 'node5',
      type: NodeType.INPUT
    });

    node.setPosition({ x: 100, y: 200 });
    const pos = node.position;

    expect(pos.x).toBe(100);
    expect(pos.y).toBe(200);
  });

  test('should return immutable position', () => {
    const node = new Node({
      id: 'node6',
      type: NodeType.INPUT
    });

    node.setPosition({ x: 100, y: 200 });
    const pos = node.position;
    pos.x = 300; // Should not affect internal position

    expect(node.position.x).toBe(100);
  });

  test('should have correct string representation', () => {
    const node = new Node({
      id: 'node7',
      type: NodeType.INPUT,
      label: 'Test'
    });

    expect(node.toString()).toBe('input:Test');
  });
});
