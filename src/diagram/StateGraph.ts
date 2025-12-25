/**
 * Simple direct-binding API for state machine diagrams
 * Provides an easy-to-use interface: stateGraph.initialize(element, options); stateGraph.graph = data;
 */

import { StateMachineDiagram, DiagramOptions } from './StateMachineDiagram';
import { StateMachine } from '../models/StateMachine';
import { StepBuilder, TransitionBuilder, StateMachineBuilder } from '../builders/StepBuilder';
import { StepType, NodeType, ConditionType } from '../models/types';
import { MessageMatchCondition, TimedDelayCondition } from '../models/Condition';
import { ExecutionState } from '../models/ExecutionState';

export interface GraphNodeData {
  id: string;
  type: 'start' | 'end' | 'process' | 'decision' | 'custom';
  title: string;
  description?: string;
  icon?: string;
  properties?: Record<string, unknown>;
  inputs?: Array<{ id?: string; label?: string }>;
  outputs?: Array<{ id?: string; label?: string }>;
  position?: { x: number; y: number };
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
  };
}

export interface GraphEdgeData {
  id?: string;
  from: string;  // node id + optional output index (e.g. "step1" or "step1:0")
  to: string;    // node id + optional input index (e.g. "step2" or "step2:0")
  label?: string;
  condition?: {
    type: 'message' | 'delay' | 'none';
    value?: string | number;  // regex pattern for message, ms for delay
    flags?: string;  // regex flags
  };
  style?: {
    stroke?: string;
    strokeWidth?: number;
    className?: string;
  };
}

export interface GraphData {
  id?: string;
  name?: string;
  description?: string;
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
}

export interface StateGraphOptions extends DiagramOptions {
  autoLayout?: boolean;
  onNodeClick?: (node: GraphNodeData) => void;
  onEdgeClick?: (edge: GraphEdgeData) => void;
}

/**
 * Simple state graph API with direct data binding
 */
export class StateGraph {
  private diagram?: StateMachineDiagram;
  private container?: HTMLElement;
  private options: StateGraphOptions = {};
  private _graphData?: GraphData;
  private executionState?: ExecutionState;

  /**
   * Initialize the state graph with a container element and options
   */
  initialize(element: HTMLElement, options: StateGraphOptions = {}): void {
    this.container = element;
    this.options = options;

    // Create the diagram
    this.diagram = new StateMachineDiagram(element, options);

    // Set up event handlers
    if (options.onNodeClick) {
      this.diagram.onStepClick((step) => {
        const nodeData = this._graphData?.nodes.find(n => n.id === step.id);
        if (nodeData && options.onNodeClick) {
          options.onNodeClick(nodeData);
        }
      });
    }

    // Render if graph data already set
    if (this._graphData) {
      this.render();
    }
  }

  /**
   * Set or get the graph data
   */
  set graph(data: GraphData) {
    this._graphData = data;
    if (this.diagram) {
      this.render();
    }
  }

  get graph(): GraphData | undefined {
    return this._graphData;
  }

  /**
   * Set the current execution state
   */
  setExecutionStep(stepId: string, data?: unknown): void {
    if (!this.executionState) {
      this.executionState = new ExecutionState();
    }
    this.executionState.setCurrentStep(stepId, data);

    if (this.diagram) {
      this.diagram.setExecutionState(this.executionState);
      if (this._graphData) {
        this.render();
      }
    }
  }

  /**
   * Mark a transition as visited
   */
  markTransitionVisited(fromNode: string, toNode: string): void {
    if (!this.executionState) {
      this.executionState = new ExecutionState();
    }

    // Find the transition ID
    const transitionId = this.findTransitionId(fromNode, toNode);
    if (transitionId) {
      this.executionState.addVisitedTransition(transitionId);

      if (this.diagram) {
        this.diagram.setExecutionState(this.executionState);
        if (this._graphData) {
          this.render();
        }
      }
    }
  }

  /**
   * Reset execution state
   */
  resetExecution(): void {
    if (this.executionState) {
      this.executionState.reset();
    }
    if (this.diagram && this._graphData) {
      this.diagram.setExecutionState(this.executionState || new ExecutionState());
      this.render();
    }
  }

  /**
   * Update theme
   */
  setTheme(theme: string): void {
    if (this.diagram) {
      this.diagram.setTheme(theme);
    }
  }

  /**
   * Update specific nodes
   */
  updateNodes(nodes: GraphNodeData[]): void {
    if (!this._graphData) return;

    nodes.forEach(newNode => {
      const index = this._graphData!.nodes.findIndex(n => n.id === newNode.id);
      if (index >= 0) {
        this._graphData!.nodes[index] = { ...this._graphData!.nodes[index], ...newNode };
      } else {
        this._graphData!.nodes.push(newNode);
      }
    });

    if (this.diagram) {
      this.render();
    }
  }

  /**
   * Remove nodes
   */
  removeNodes(nodeIds: string[]): void {
    if (!this._graphData) return;

    this._graphData.nodes = this._graphData.nodes.filter(n => !nodeIds.includes(n.id));
    this._graphData.edges = this._graphData.edges.filter(e => {
      const fromId = e.from.split(':')[0];
      const toId = e.to.split(':')[0];
      return !nodeIds.includes(fromId) && !nodeIds.includes(toId);
    });

    if (this.diagram) {
      this.render();
    }
  }

  /**
   * Export diagram as SVG string
   */
  exportSVG(): string {
    if (!this.container) return '';
    const svg = this.container.querySelector('svg');
    return svg ? svg.outerHTML : '';
  }

  /**
   * Zoom control
   */
  zoom(scale: number): void {
    if (this.diagram) {
      this.diagram.setZoom(scale);
    }
  }

  /**
   * Pan control
   */
  pan(x: number, y: number): void {
    if (this.diagram) {
      this.diagram.setPan(x, y);
    }
  }

  /**
   * Destroy the graph
   */
  destroy(): void {
    if (this.diagram) {
      this.diagram.destroy();
    }
  }

  /**
   * Convert graph data to state machine and render
   */
  private render(): void {
    if (!this._graphData || !this.diagram) return;

    const sm = this.convertToStateMachine(this._graphData);
    this.diagram.render(sm);
  }

  /**
   * Convert simple graph data to StateMachine model
   */
  private convertToStateMachine(data: GraphData): StateMachine {
    const builder = StateMachineBuilder.create(data.id || 'graph')
      .withName(data.name || 'State Machine')
      .withDescription(data.description || '');

    // Create steps
    data.nodes.forEach(node => {
      const stepBuilder = StepBuilder.create(node.id)
        .withTitle(node.title);

      // Set type
      switch (node.type) {
        case 'start':
          stepBuilder.asStart();
          break;
        case 'end':
          stepBuilder.asEnd();
          break;
        case 'decision':
          stepBuilder.asDecision();
          break;
        case 'process':
          stepBuilder.asProcess();
          break;
        default:
          stepBuilder.withType(StepType.CUSTOM);
      }

      if (node.description) stepBuilder.withDescription(node.description);
      if (node.icon) stepBuilder.withIcon(node.icon);
      if (node.properties) stepBuilder.withProperties(node.properties);

      // Add inputs/outputs
      if (node.inputs && node.inputs.length > 0) {
        node.inputs.forEach((input, idx) => {
          stepBuilder.addInputNode({
            id: input.id || `${node.id}_in_${idx}`,
            type: NodeType.INPUT,
            label: input.label || `in_${idx}`
          });
        });
      }

      if (node.outputs && node.outputs.length > 0) {
        node.outputs.forEach((output, idx) => {
          stepBuilder.addOutputNode({
            id: output.id || `${node.id}_out_${idx}`,
            type: NodeType.OUTPUT,
            label: output.label || `out_${idx}`
          });
        });
      }

      const step = stepBuilder.build();

      // Set position if provided
      if (node.position) {
        step.setPosition(node.position);
      }

      builder.addStep(step);
    });

    // Create transitions
    data.edges.forEach(edge => {
      const [fromNodeId, fromOutput] = edge.from.split(':');
      const [toNodeId, toInput] = edge.to.split(':');

      // Find nodes
      const fromNode = data.nodes.find(n => n.id === fromNodeId);
      const toNode = data.nodes.find(n => n.id === toNodeId);

      if (!fromNode || !toNode) return;

      // Determine node IDs
      const sourceNodeId = fromNode.outputs?.[parseInt(fromOutput || '0')]?.id ||
                           `${fromNodeId}_out_${fromOutput || '0'}`;
      const targetNodeId = toNode.inputs?.[parseInt(toInput || '0')]?.id ||
                          `${toNodeId}_in_${toInput || '0'}`;

      const transBuilder = TransitionBuilder.create(edge.id || `${edge.from}_to_${edge.to}`)
        .from(sourceNodeId)
        .to(targetNodeId);

      if (edge.label) transBuilder.withLabel(edge.label);

      // Add condition
      if (edge.condition) {
        switch (edge.condition.type) {
          case 'message':
            if (typeof edge.condition.value === 'string') {
              transBuilder.withMessageMatch(edge.condition.value, edge.condition.flags);
            }
            break;
          case 'delay':
            if (typeof edge.condition.value === 'number') {
              transBuilder.withDelay(edge.condition.value);
            }
            break;
        }
      }

      builder.addTransition(transBuilder.build());
    });

    return builder.build();
  }

  /**
   * Find transition ID from node IDs
   */
  private findTransitionId(fromNode: string, toNode: string): string | undefined {
    if (!this._graphData) return undefined;

    const edge = this._graphData.edges.find(e => {
      const [fromId] = e.from.split(':');
      const [toId] = e.to.split(':');
      return fromId === fromNode && toId === toNode;
    });

    return edge ? (edge.id || `${edge.from}_to_${edge.to}`) : undefined;
  }
}
