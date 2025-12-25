/**
 * Transition model representing connections between nodes
 */

import { Id } from './types';
import { ICondition, NoCondition } from './Condition';
import { Node } from './Node';

export interface TransitionConfig {
  id: Id;
  sourceNodeId: Id;
  targetNodeId: Id;
  condition?: ICondition;
  label?: string;
}

/**
 * Represents a transition from an output node to an input node
 */
export class Transition {
  readonly id: Id;
  readonly sourceNodeId: Id;
  readonly targetNodeId: Id;
  readonly condition: ICondition;
  readonly label: string;

  private _sourceNode?: Node;
  private _targetNode?: Node;

  constructor(config: TransitionConfig) {
    this.id = config.id;
    this.sourceNodeId = config.sourceNodeId;
    this.targetNodeId = config.targetNodeId;
    this.condition = config.condition || new NoCondition();
    this.label = config.label || '';
  }

  setSourceNode(node: Node): void {
    if (!node.isOutput()) {
      throw new Error('Source node must be an output node');
    }
    this._sourceNode = node;
  }

  setTargetNode(node: Node): void {
    if (!node.isInput()) {
      throw new Error('Target node must be an input node');
    }
    this._targetNode = node;
  }

  getSourceNode(): Node | undefined {
    return this._sourceNode;
  }

  getTargetNode(): Node | undefined {
    return this._targetNode;
  }

  hasCondition(): boolean {
    return this.condition.type !== 'none';
  }

  toString(): string {
    const condStr = this.condition.toString();
    const labelStr = this.label || condStr;
    return labelStr || 'Transition';
  }
}
