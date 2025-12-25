/**
 * Layout engine for automatic positioning of steps in the diagram
 */

import { Step } from '../models/Step';
import { StateMachine } from '../models/StateMachine';
import { Point, Size } from '../models/types';
import { Theme } from '../rendering/Theme';

export interface LayoutOptions {
  direction: 'horizontal' | 'vertical';
  alignment: 'start' | 'center' | 'end';
  autoSpace: boolean;
}

/**
 * Layered layout algorithm (similar to Sugiyama)
 * Places nodes in layers based on topological ordering
 */
export class LayoutEngine {
  constructor(
    private readonly theme: Theme,
    private readonly options: LayoutOptions = {
      direction: 'horizontal',
      alignment: 'center',
      autoSpace: true
    }
  ) {}

  /**
   * Calculate layout for all steps in the state machine
   */
  layout(stateMachine: StateMachine, containerSize?: Size): void {
    const steps = stateMachine.getSteps();
    if (steps.length === 0) return;

    // Build adjacency information
    const graph = this.buildGraph(stateMachine);

    // Assign layers using topological sort
    const layers = this.assignLayers(stateMachine, graph);

    // Position nodes within layers
    this.positionNodes(layers, containerSize);

    // Update node positions on steps
    this.updateNodePositions(steps);
  }

  private buildGraph(stateMachine: StateMachine): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();

    // Initialize graph
    stateMachine.getSteps().forEach(step => {
      graph.set(step.id, new Set());
    });

    // Add edges
    stateMachine.getTransitions().forEach(transition => {
      const sourceNode = transition.getSourceNode();
      const targetNode = transition.getTargetNode();

      if (sourceNode && targetNode) {
        // Find which steps these nodes belong to
        let sourceStepId: string | undefined;
        let targetStepId: string | undefined;

        stateMachine.getSteps().forEach(step => {
          if (step.getOutputNode(sourceNode.id)) {
            sourceStepId = step.id;
          }
          if (step.getInputNode(targetNode.id)) {
            targetStepId = step.id;
          }
        });

        if (sourceStepId && targetStepId) {
          graph.get(sourceStepId)?.add(targetStepId);
        }
      }
    });

    return graph;
  }

  private assignLayers(
    stateMachine: StateMachine,
    graph: Map<string, Set<string>>
  ): Step[][] {
    const layers: Step[][] = [];
    const visited = new Set<string>();
    const stepMap = new Map(stateMachine.getSteps().map(s => [s.id, s]));

    // Start with start nodes
    const startSteps = stateMachine.getStartSteps();
    if (startSteps.length > 0) {
      layers.push([...startSteps]);
      startSteps.forEach(step => visited.add(step.id));
    }

    // Process remaining layers
    let currentLayer = 0;
    while (visited.size < stateMachine.getSteps().length && currentLayer < layers.length) {
      const nextLayer: Step[] = [];

      layers[currentLayer].forEach(step => {
        const neighbors = graph.get(step.id);
        neighbors?.forEach(neighborId => {
          if (!visited.has(neighborId)) {
            const neighborStep = stepMap.get(neighborId);
            if (neighborStep && !nextLayer.includes(neighborStep)) {
              nextLayer.push(neighborStep);
              visited.add(neighborId);
            }
          }
        });
      });

      if (nextLayer.length > 0) {
        layers.push(nextLayer);
      }
      currentLayer++;
    }

    // Add any remaining unvisited nodes
    const unvisited = stateMachine.getSteps().filter(s => !visited.has(s.id));
    if (unvisited.length > 0) {
      layers.push(unvisited);
    }

    return layers;
  }

  private positionNodes(layers: Step[][], containerSize?: Size): void {
    const spacing = this.theme.spacing;
    const isHorizontal = this.options.direction === 'horizontal';

    layers.forEach((layer, layerIndex) => {
      const layerPosition = layerIndex * (isHorizontal ? spacing.horizontal : spacing.vertical);

      layer.forEach((step, stepIndex) => {
        const stepSpacing = isHorizontal ? spacing.vertical : spacing.horizontal;
        const crossPosition = this.calculateCrossPosition(
          stepIndex,
          layer.length,
          stepSpacing,
          containerSize
        );

        const position: Point = isHorizontal
          ? { x: layerPosition, y: crossPosition }
          : { x: crossPosition, y: layerPosition };

        step.setPosition(position);
      });
    });
  }

  private calculateCrossPosition(
    index: number,
    total: number,
    spacing: number,
    containerSize?: Size
  ): number {
    switch (this.options.alignment) {
      case 'start':
        return index * spacing;
      case 'end':
        return (containerSize ? (this.options.direction === 'horizontal' ? containerSize.height : containerSize.width) : total * spacing) - (total - index) * spacing;
      case 'center':
      default:
        const totalHeight = (total - 1) * spacing;
        const startOffset = containerSize
          ? ((this.options.direction === 'horizontal' ? containerSize.height : containerSize.width) - totalHeight) / 2
          : 0;
        return startOffset + index * spacing;
    }
  }

  private updateNodePositions(steps: Step[]): void {
    const nodeSpacing = this.theme.spacing.nodeSpacing;

    steps.forEach(step => {
      const pos = step.position;

      // Position input nodes on the left side
      const inputNodes = step.getInputNodes();
      const inputHeight = (inputNodes.length - 1) * nodeSpacing;
      inputNodes.forEach((node, index) => {
        node.setPosition({
          x: pos.x - 80, // Offset from step center
          y: pos.y - inputHeight / 2 + index * nodeSpacing
        });
      });

      // Position output nodes on the right side
      const outputNodes = step.getOutputNodes();
      const outputHeight = (outputNodes.length - 1) * nodeSpacing;
      outputNodes.forEach((node, index) => {
        node.setPosition({
          x: pos.x + 80, // Offset from step center
          y: pos.y - outputHeight / 2 + index * nodeSpacing
        });
      });
    });
  }
}
