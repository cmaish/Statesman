/**
 * Step model representing a state/node in the state machine
 */

import { Id, StepType, Point, Properties } from './types';
import { Node, NodeConfig } from './Node';
import { NodeType } from './types';

export interface StepConfig {
  id: Id;
  type: StepType;
  title: string;
  description?: string;
  icon?: string;
  properties?: Properties;
  inputNodes?: NodeConfig[];
  outputNodes?: NodeConfig[];
}

/**
 * Represents a step/state in the state machine
 */
export class Step {
  readonly id: Id;
  readonly type: StepType;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly properties: Properties;

  private readonly _inputNodes: Map<Id, Node> = new Map();
  private readonly _outputNodes: Map<Id, Node> = new Map();
  private _position: Point = { x: 0, y: 0 };

  constructor(config: StepConfig) {
    this.id = config.id;
    this.type = config.type;
    this.title = config.title;
    this.description = config.description || '';
    this.icon = config.icon || '';
    this.properties = config.properties || {};

    // Initialize nodes
    if (config.inputNodes) {
      config.inputNodes.forEach((nodeConfig, index) => {
        const node = new Node({
          ...nodeConfig,
          type: NodeType.INPUT,
          index: nodeConfig.index !== undefined ? nodeConfig.index : index
        });
        this._inputNodes.set(node.id, node);
      });
    }

    if (config.outputNodes) {
      config.outputNodes.forEach((nodeConfig, index) => {
        const node = new Node({
          ...nodeConfig,
          type: NodeType.OUTPUT,
          index: nodeConfig.index !== undefined ? nodeConfig.index : index
        });
        this._outputNodes.set(node.id, node);
      });
    }

    // Start and end steps have default nodes if not specified
    if (this.type === StepType.START && this._outputNodes.size === 0) {
      this.addOutputNode({ id: `${this.id}_out`, label: 'start' });
    }
    if (this.type === StepType.END && this._inputNodes.size === 0) {
      this.addInputNode({ id: `${this.id}_in`, label: 'end' });
    }
  }

  get position(): Point {
    return { ...this._position };
  }

  setPosition(point: Point): void {
    this._position = { ...point };
  }

  addInputNode(config: NodeConfig): Node {
    const node = new Node({
      ...config,
      type: NodeType.INPUT,
      index: config.index !== undefined ? config.index : this._inputNodes.size
    });
    this._inputNodes.set(node.id, node);
    return node;
  }

  addOutputNode(config: NodeConfig): Node {
    const node = new Node({
      ...config,
      type: NodeType.OUTPUT,
      index: config.index !== undefined ? config.index : this._outputNodes.size
    });
    this._outputNodes.set(node.id, node);
    return node;
  }

  getInputNode(id: Id): Node | undefined {
    return this._inputNodes.get(id);
  }

  getOutputNode(id: Id): Node | undefined {
    return this._outputNodes.get(id);
  }

  getInputNodes(): Node[] {
    return Array.from(this._inputNodes.values()).sort((a, b) => a.index - b.index);
  }

  getOutputNodes(): Node[] {
    return Array.from(this._outputNodes.values()).sort((a, b) => a.index - b.index);
  }

  getNode(id: Id): Node | undefined {
    return this._inputNodes.get(id) || this._outputNodes.get(id);
  }

  isStart(): boolean {
    return this.type === StepType.START;
  }

  isEnd(): boolean {
    return this.type === StepType.END;
  }

  toString(): string {
    return `${this.type}:${this.title}`;
  }
}
