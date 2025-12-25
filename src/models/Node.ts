/**
 * Node model representing input/output connection points on steps
 */

import { Id, NodeType, Point } from './types';

export interface NodeConfig {
  id: Id;
  type: NodeType;
  label?: string;
  index?: number;
}

/**
 * Represents an input or output node on a step
 */
export class Node {
  readonly id: Id;
  readonly type: NodeType;
  readonly label: string;
  readonly index: number;

  private _position: Point = { x: 0, y: 0 };

  constructor(config: NodeConfig) {
    this.id = config.id;
    this.type = config.type;
    this.label = config.label || '';
    this.index = config.index || 0;
  }

  get position(): Point {
    return { ...this._position };
  }

  setPosition(point: Point): void {
    this._position = { ...point };
  }

  isInput(): boolean {
    return this.type === NodeType.INPUT;
  }

  isOutput(): boolean {
    return this.type === NodeType.OUTPUT;
  }

  toString(): string {
    return `${this.type}:${this.label || this.id}`;
  }
}
