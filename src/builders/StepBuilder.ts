/**
 * Builder pattern for creating steps and transitions with a fluent API
 */

import { Step, StepConfig } from '../models/Step';
import { Transition, TransitionConfig } from '../models/Transition';
import { StateMachine } from '../models/StateMachine';
import { StepType, NodeType, Properties } from '../models/types';
import { ICondition, MessageMatchCondition, TimedDelayCondition } from '../models/Condition';

/**
 * Fluent builder for creating steps
 */
export class StepBuilder {
  private config: Partial<StepConfig> = {};

  static create(id: string): StepBuilder {
    return new StepBuilder().withId(id);
  }

  withId(id: string): this {
    this.config.id = id;
    return this;
  }

  withType(type: StepType): this {
    this.config.type = type;
    return this;
  }

  asStart(): this {
    return this.withType(StepType.START);
  }

  asEnd(): this {
    return this.withType(StepType.END);
  }

  asProcess(): this {
    return this.withType(StepType.PROCESS);
  }

  asDecision(): this {
    return this.withType(StepType.DECISION);
  }

  withTitle(title: string): this {
    this.config.title = title;
    return this;
  }

  withDescription(description: string): this {
    this.config.description = description;
    return this;
  }

  withIcon(icon: string): this {
    this.config.icon = icon;
    return this;
  }

  withProperties(properties: Properties): this {
    this.config.properties = properties;
    return this;
  }

  withProperty(key: string, value: unknown): this {
    if (!this.config.properties) {
      this.config.properties = {};
    }
    this.config.properties[key] = value;
    return this;
  }

  withInputNodes(count: number, labelPrefix = 'in'): this {
    this.config.inputNodes = [];
    for (let i = 0; i < count; i++) {
      this.config.inputNodes.push({
        id: `${this.config.id}_input_${i}`,
        type: NodeType.INPUT,
        label: `${labelPrefix}_${i}`,
        index: i
      });
    }
    return this;
  }

  withOutputNodes(count: number, labels?: string[]): this {
    this.config.outputNodes = [];
    for (let i = 0; i < count; i++) {
      const label = labels && labels[i] ? labels[i] : `out_${i}`;
      this.config.outputNodes.push({
        id: `${this.config.id}_output_${i}`,
        type: NodeType.OUTPUT,
        label,
        index: i
      });
    }
    return this;
  }

  withDecisionOutputs(trueLabel = 'true', falseLabel = 'false'): this {
    return this.withOutputNodes(2, [trueLabel, falseLabel]);
  }

  build(): Step {
    if (!this.config.id) {
      throw new Error('Step ID is required');
    }
    if (!this.config.type) {
      throw new Error('Step type is required');
    }
    if (!this.config.title) {
      this.config.title = this.config.id;
    }

    return new Step(this.config as StepConfig);
  }

  buildAndAddTo(stateMachine: StateMachine): Step {
    const step = this.build();
    stateMachine.addStep(step);
    return step;
  }
}

/**
 * Fluent builder for creating transitions
 */
export class TransitionBuilder {
  private config: Partial<TransitionConfig> = {};

  static create(id: string): TransitionBuilder {
    return new TransitionBuilder().withId(id);
  }

  static connect(sourceNodeId: string, targetNodeId: string): TransitionBuilder {
    return new TransitionBuilder()
      .withId(`${sourceNodeId}_to_${targetNodeId}`)
      .from(sourceNodeId)
      .to(targetNodeId);
  }

  withId(id: string): this {
    this.config.id = id;
    return this;
  }

  from(sourceNodeId: string): this {
    this.config.sourceNodeId = sourceNodeId;
    return this;
  }

  to(targetNodeId: string): this {
    this.config.targetNodeId = targetNodeId;
    return this;
  }

  withLabel(label: string): this {
    this.config.label = label;
    return this;
  }

  withCondition(condition: ICondition): this {
    this.config.condition = condition;
    return this;
  }

  withMessageMatch(pattern: string, flags = 'i'): this {
    this.config.condition = new MessageMatchCondition(pattern, flags);
    return this;
  }

  withDelay(delayMs: number): this {
    this.config.condition = new TimedDelayCondition(delayMs);
    return this;
  }

  build(): Transition {
    if (!this.config.id) {
      throw new Error('Transition ID is required');
    }
    if (!this.config.sourceNodeId) {
      throw new Error('Source node ID is required');
    }
    if (!this.config.targetNodeId) {
      throw new Error('Target node ID is required');
    }

    return new Transition(this.config as TransitionConfig);
  }

  buildAndAddTo(stateMachine: StateMachine): Transition {
    const transition = this.build();
    stateMachine.addTransition(transition);
    return transition;
  }
}

/**
 * Fluent builder for creating state machines
 */
export class StateMachineBuilder {
  private id: string = '';
  private name: string = '';
  private description: string = '';
  private steps: Step[] = [];
  private transitions: Transition[] = [];

  static create(id: string): StateMachineBuilder {
    return new StateMachineBuilder().withId(id);
  }

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  addStep(step: Step): this {
    this.steps.push(step);
    return this;
  }

  addTransition(transition: Transition): this {
    this.transitions.push(transition);
    return this;
  }

  build(): StateMachine {
    if (!this.id) {
      throw new Error('State machine ID is required');
    }
    if (!this.name) {
      this.name = this.id;
    }

    return new StateMachine({
      id: this.id,
      name: this.name,
      description: this.description,
      steps: this.steps.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        description: s.description,
        icon: s.icon,
        properties: s.properties,
        inputNodes: s.getInputNodes().map(n => ({
          id: n.id,
          type: n.type,
          label: n.label,
          index: n.index
        })),
        outputNodes: s.getOutputNodes().map(n => ({
          id: n.id,
          type: n.type,
          label: n.label,
          index: n.index
        }))
      })),
      transitions: this.transitions.map(t => ({
        id: t.id,
        sourceNodeId: t.sourceNodeId,
        targetNodeId: t.targetNodeId,
        condition: t.condition,
        label: t.label
      }))
    });
  }
}
