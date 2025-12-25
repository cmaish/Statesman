/**
 * State machine model - the main container for the diagram
 */

import { Id } from './types';
import { Step, StepConfig } from './Step';
import { Transition, TransitionConfig } from './Transition';

export interface StateMachineConfig {
  id: Id;
  name: string;
  description?: string;
  steps?: StepConfig[];
  transitions?: TransitionConfig[];
}

/**
 * Represents the complete state machine diagram
 */
export class StateMachine {
  readonly id: Id;
  readonly name: string;
  readonly description: string;

  private readonly _steps: Map<Id, Step> = new Map();
  private readonly _transitions: Map<Id, Transition> = new Map();

  constructor(config: StateMachineConfig) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description || '';

    // Initialize steps
    if (config.steps) {
      config.steps.forEach(stepConfig => {
        this.addStep(new Step(stepConfig));
      });
    }

    // Initialize transitions
    if (config.transitions) {
      config.transitions.forEach(transConfig => {
        this.addTransition(new Transition(transConfig));
      });
    }
  }

  addStep(step: Step): void {
    if (this._steps.has(step.id)) {
      throw new Error(`Step with id ${step.id} already exists`);
    }
    this._steps.set(step.id, step);
  }

  removeStep(id: Id): void {
    // Remove all transitions connected to this step
    const step = this._steps.get(id);
    if (!step) return;

    const nodesToRemove = new Set<Id>();
    step.getInputNodes().forEach(node => nodesToRemove.add(node.id));
    step.getOutputNodes().forEach(node => nodesToRemove.add(node.id));

    this._transitions.forEach((transition, transId) => {
      if (nodesToRemove.has(transition.sourceNodeId) ||
          nodesToRemove.has(transition.targetNodeId)) {
        this._transitions.delete(transId);
      }
    });

    this._steps.delete(id);
  }

  getStep(id: Id): Step | undefined {
    return this._steps.get(id);
  }

  getSteps(): Step[] {
    return Array.from(this._steps.values());
  }

  getStartSteps(): Step[] {
    return this.getSteps().filter(step => step.isStart());
  }

  getEndSteps(): Step[] {
    return this.getSteps().filter(step => step.isEnd());
  }

  addTransition(transition: Transition): void {
    if (this._transitions.has(transition.id)) {
      throw new Error(`Transition with id ${transition.id} already exists`);
    }

    // Find and set the source and target nodes
    let sourceNode, targetNode;

    for (const step of this._steps.values()) {
      if (!sourceNode) {
        sourceNode = step.getOutputNode(transition.sourceNodeId);
        if (sourceNode) transition.setSourceNode(sourceNode);
      }
      if (!targetNode) {
        targetNode = step.getInputNode(transition.targetNodeId);
        if (targetNode) transition.setTargetNode(targetNode);
      }
      if (sourceNode && targetNode) break;
    }

    if (!sourceNode) {
      throw new Error(`Source node ${transition.sourceNodeId} not found`);
    }
    if (!targetNode) {
      throw new Error(`Target node ${transition.targetNodeId} not found`);
    }

    this._transitions.set(transition.id, transition);
  }

  removeTransition(id: Id): void {
    this._transitions.delete(id);
  }

  getTransition(id: Id): Transition | undefined {
    return this._transitions.get(id);
  }

  getTransitions(): Transition[] {
    return Array.from(this._transitions.values());
  }

  getTransitionsFromNode(nodeId: Id): Transition[] {
    return this.getTransitions().filter(t => t.sourceNodeId === nodeId);
  }

  getTransitionsToNode(nodeId: Id): Transition[] {
    return this.getTransitions().filter(t => t.targetNodeId === nodeId);
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for orphaned transitions
    this._transitions.forEach(transition => {
      if (!transition.getSourceNode()) {
        errors.push(`Transition ${transition.id} has invalid source node ${transition.sourceNodeId}`);
      }
      if (!transition.getTargetNode()) {
        errors.push(`Transition ${transition.id} has invalid target node ${transition.targetNodeId}`);
      }
    });

    // Check for at least one start step
    if (this.getStartSteps().length === 0) {
      errors.push('State machine must have at least one start step');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
