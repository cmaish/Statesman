/**
 * Interaction handler for user events (clicks, hovers, etc.)
 */

import { Step } from '../models/Step';
import { Node } from '../models/Node';
import { Transition } from '../models/Transition';
import { StateMachine } from '../models/StateMachine';

export interface InteractionCallbacks {
  onStepClick?: (step: Step) => void;
  onStepDoubleClick?: (step: Step) => void;
  onNodeClick?: (node: Node) => void;
  onTransitionClick?: (transition: Transition) => void;
  onCanvasClick?: () => void;
  onStepHover?: (step: Step | null) => void;
}

/**
 * Manages user interactions with the diagram
 */
export class InteractionHandler {
  private selectedStep: Step | null = null;
  private hoveredStep: Step | null = null;
  private isDragging = false;
  private lastClickTime = 0;
  private readonly doubleClickDelay = 300;

  constructor(
    private readonly container: HTMLElement,
    private readonly stateMachine: StateMachine,
    private readonly callbacks: InteractionCallbacks = {}
  ) {
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    // Delegate events from the container
    this.container.addEventListener('click', this.handleClick.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as Element;

    // Check for step click
    const stepElement = target.closest('[data-step-id]');
    if (stepElement) {
      const stepId = stepElement.getAttribute('data-step-id');
      if (stepId) {
        const step = this.stateMachine.getStep(stepId);
        if (step) {
          const now = Date.now();
          const isDoubleClick = now - this.lastClickTime < this.doubleClickDelay;
          this.lastClickTime = now;

          if (isDoubleClick && this.callbacks.onStepDoubleClick) {
            this.callbacks.onStepDoubleClick(step);
          } else if (this.callbacks.onStepClick) {
            this.callbacks.onStepClick(step);
          }
          this.selectedStep = step;
          return;
        }
      }
    }

    // Check for node click
    const nodeElement = target.closest('[data-node-id]');
    if (nodeElement) {
      const nodeId = nodeElement.getAttribute('data-node-id');
      if (nodeId && this.callbacks.onNodeClick) {
        // Find the node in the state machine
        for (const step of this.stateMachine.getSteps()) {
          const node = step.getNode(nodeId);
          if (node) {
            this.callbacks.onNodeClick(node);
            return;
          }
        }
      }
    }

    // Check for transition click
    const transitionElement = target.closest('[data-transition-id]');
    if (transitionElement) {
      const transitionId = transitionElement.getAttribute('data-transition-id');
      if (transitionId) {
        const transition = this.stateMachine.getTransition(transitionId);
        if (transition && this.callbacks.onTransitionClick) {
          this.callbacks.onTransitionClick(transition);
          return;
        }
      }
    }

    // Canvas click (no specific element)
    if (this.callbacks.onCanvasClick) {
      this.callbacks.onCanvasClick();
    }
    this.selectedStep = null;
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging) return;

    const target = event.target as Element;
    const stepElement = target.closest('[data-step-id]');

    if (stepElement) {
      const stepId = stepElement.getAttribute('data-step-id');
      if (stepId) {
        const step = this.stateMachine.getStep(stepId);
        if (step && step !== this.hoveredStep) {
          this.hoveredStep = step;
          if (this.callbacks.onStepHover) {
            this.callbacks.onStepHover(step);
          }
        }
      }
    } else if (this.hoveredStep) {
      this.hoveredStep = null;
      if (this.callbacks.onStepHover) {
        this.callbacks.onStepHover(null);
      }
    }
  }

  private handleMouseDown(_event: MouseEvent): void {
    this.isDragging = true;
  }

  private handleMouseUp(_event: MouseEvent): void {
    this.isDragging = false;
  }

  getSelectedStep(): Step | null {
    return this.selectedStep;
  }

  setSelectedStep(step: Step | null): void {
    this.selectedStep = step;
  }

  destroy(): void {
    // Remove event listeners
    this.container.removeEventListener('click', this.handleClick.bind(this));
    this.container.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.removeEventListener('mouseup', this.handleMouseUp.bind(this));
  }
}
