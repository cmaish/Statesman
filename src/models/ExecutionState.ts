/**
 * Execution state tracking for visualizing state machine execution
 */

import { Id } from './types';

export interface ExecutionTrace {
  stepId: Id;
  timestamp: number;
  data?: unknown;
}

/**
 * Tracks the execution state of a state machine
 */
export class ExecutionState {
  private _currentStepId: Id | null = null;
  private _trace: ExecutionTrace[] = [];
  private _visitedSteps: Set<Id> = new Set();
  private _visitedTransitions: Set<Id> = new Set();

  getCurrentStepId(): Id | null {
    return this._currentStepId;
  }

  setCurrentStep(stepId: Id, data?: unknown): void {
    this._currentStepId = stepId;
    this._visitedSteps.add(stepId);
    this._trace.push({
      stepId,
      timestamp: Date.now(),
      data
    });
  }

  addVisitedTransition(transitionId: Id): void {
    this._visitedTransitions.add(transitionId);
  }

  getTrace(): ExecutionTrace[] {
    return [...this._trace];
  }

  getVisitedSteps(): Set<Id> {
    return new Set(this._visitedSteps);
  }

  getVisitedTransitions(): Set<Id> {
    return new Set(this._visitedTransitions);
  }

  isStepVisited(stepId: Id): boolean {
    return this._visitedSteps.has(stepId);
  }

  isTransitionVisited(transitionId: Id): boolean {
    return this._visitedTransitions.has(transitionId);
  }

  isCurrentStep(stepId: Id): boolean {
    return this._currentStepId === stepId;
  }

  reset(): void {
    this._currentStepId = null;
    this._trace = [];
    this._visitedSteps.clear();
    this._visitedTransitions.clear();
  }

  getStepVisitCount(stepId: Id): number {
    return this._trace.filter(t => t.stepId === stepId).length;
  }
}
