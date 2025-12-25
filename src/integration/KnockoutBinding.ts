/**
 * Knockout.js integration for the diagram library
 */

import * as ko from 'knockout';
import { StateMachineDiagram } from '../diagram/StateMachineDiagram';
import { StateMachine, StateMachineConfig } from '../models/StateMachine';
import { Theme, DefaultTheme } from '../rendering/Theme';
import { ExecutionState } from '../models/ExecutionState';

export interface DiagramBindingOptions {
  stateMachine: ko.Observable<StateMachine> | StateMachine | StateMachineConfig;
  theme?: Theme | string;
  executionState?: ko.Observable<ExecutionState> | ExecutionState;
  onStepClick?: (step: any) => void;
  selectedStepId?: ko.Observable<string | null>;
  showNodeLabels?: boolean;
  enableAnimations?: boolean;
}

/**
 * Knockout binding handler for state machine diagrams
 *
 * Usage:
 * <div data-bind="stateDiagram: { stateMachine: myStateMachine, theme: 'dark' }"></div>
 */
export class KnockoutDiagramBinding {
  static register(): void {
    ko.bindingHandlers['stateDiagram'] = {
      init: function(
        element: HTMLElement,
        valueAccessor: () => DiagramBindingOptions
      ) {
        const options = valueAccessor();

        // Extract state machine
        let stateMachine: StateMachine;
        if (ko.isObservable(options.stateMachine)) {
          const value = ko.unwrap(options.stateMachine);
          stateMachine = value instanceof StateMachine
            ? value
            : new StateMachine(value);
        } else if (options.stateMachine instanceof StateMachine) {
          stateMachine = options.stateMachine;
        } else {
          stateMachine = new StateMachine(options.stateMachine);
        }

        // Create diagram
        const diagram = new StateMachineDiagram(element, {
          theme: typeof options.theme === 'string' ? options.theme : undefined,
          showNodeLabels: options.showNodeLabels,
          enableAnimations: options.enableAnimations
        });

        // Set execution state if provided
        if (options.executionState) {
          const execState = ko.isObservable(options.executionState)
            ? ko.unwrap(options.executionState)
            : options.executionState;
          diagram.setExecutionState(execState);
        }

        // Set up step click handler
        if (options.onStepClick || options.selectedStepId) {
          diagram.onStepClick((step) => {
            if (options.onStepClick) {
              options.onStepClick(step);
            }
            if (ko.isObservable(options.selectedStepId)) {
              options.selectedStepId(step.id);
            }
          });
        }

        // Render initial diagram
        diagram.render(stateMachine);

        // Subscribe to observable changes
        if (ko.isObservable(options.stateMachine)) {
          const subscription = options.stateMachine.subscribe((newValue: any) => {
            const newStateMachine = newValue instanceof StateMachine
              ? newValue
              : new StateMachine(newValue);
            diagram.render(newStateMachine);
          });

          // Clean up on disposal
          ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            subscription.dispose();
            diagram.destroy();
          });
        }

        // Subscribe to execution state changes
        if (ko.isObservable(options.executionState)) {
          const execSubscription = options.executionState.subscribe((newState: ExecutionState) => {
            diagram.setExecutionState(newState);
            diagram.render(stateMachine);
          });

          ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            execSubscription.dispose();
          });
        }

        return { controlsDescendantBindings: true };
      }
    };
  }
}

/**
 * Observable wrapper for StateMachine to work seamlessly with Knockout
 */
export class ObservableStateMachine {
  stateMachine: ko.Observable<StateMachine>;
  executionState: ko.Observable<ExecutionState>;

  constructor(config?: StateMachineConfig) {
    this.stateMachine = ko.observable(
      config ? new StateMachine(config) : new StateMachine({ id: 'default', name: 'Default' })
    );
    this.executionState = ko.observable(new ExecutionState());
  }

  getStateMachine(): StateMachine {
    return this.stateMachine();
  }

  setStateMachine(sm: StateMachine): void {
    this.stateMachine(sm);
  }

  getCurrentStepId(): string | null {
    return this.executionState().getCurrentStepId();
  }

  setCurrentStep(stepId: string, data?: unknown): void {
    const state = this.executionState();
    state.setCurrentStep(stepId, data);
    // Trigger change notification
    this.executionState.valueHasMutated();
  }

  addVisitedTransition(transitionId: string): void {
    const state = this.executionState();
    state.addVisitedTransition(transitionId);
    this.executionState.valueHasMutated();
  }

  resetExecution(): void {
    this.executionState().reset();
    this.executionState.valueHasMutated();
  }
}

// Auto-register the binding when this module is imported
if (typeof ko !== 'undefined') {
  KnockoutDiagramBinding.register();
}
