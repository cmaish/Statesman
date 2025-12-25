/**
 * Storybook stories for Knockout.js integration
 */

import { Meta, StoryObj } from '@storybook/html';
import * as ko from 'knockout';
import { ObservableStateMachine } from '../integration/KnockoutBinding';
import { StateMachineDiagram } from '../diagram/StateMachineDiagram';
import { StepBuilder, TransitionBuilder, StateMachineBuilder } from '../builders/StepBuilder';

const meta: Meta = {
  title: 'Integration/Knockout.js',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const ObservableStateMachineExample: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '700px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const controls = document.createElement('div');
    controls.style.padding = '20px';
    controls.style.background = '#fff';
    controls.style.borderBottom = '1px solid #ddd';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginBottom = '10px';

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Execution';
    startButton.style.padding = '10px 20px';
    startButton.style.marginRight = '10px';
    startButton.style.cursor = 'pointer';

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Step';
    nextButton.style.padding = '10px 20px';
    nextButton.style.marginRight = '10px';
    nextButton.style.cursor = 'pointer';
    nextButton.disabled = true;

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.padding = '10px 20px';
    resetButton.style.cursor = 'pointer';

    const statusDiv = document.createElement('div');
    statusDiv.style.marginTop = '10px';
    statusDiv.style.fontSize = '14px';
    statusDiv.style.color = '#666';

    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(nextButton);
    buttonContainer.appendChild(resetButton);
    controls.appendChild(buttonContainer);
    controls.appendChild(statusDiv);

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#f5f5f5';

    wrapper.appendChild(controls);
    wrapper.appendChild(container);

    // Create workflow
    const start = StepBuilder.create('start')
      .asStart()
      .withTitle('Receive Order')
      .withIcon('📦')
      .build();

    const validate = StepBuilder.create('validate')
      .asProcess()
      .withTitle('Validate Order')
      .withIcon('✓')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const process = StepBuilder.create('process')
      .asProcess()
      .withTitle('Process Payment')
      .withIcon('💳')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const ship = StepBuilder.create('ship')
      .asProcess()
      .withTitle('Ship Order')
      .withIcon('🚚')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const complete = StepBuilder.create('complete')
      .asEnd()
      .withTitle('Order Complete')
      .withIcon('✅')
      .build();

    const sm = StateMachineBuilder.create('order-workflow')
      .withName('Order Processing Workflow')
      .addStep(start)
      .addStep(validate)
      .addStep(process)
      .addStep(ship)
      .addStep(complete)
      .addTransition(
        TransitionBuilder.create('t1')
          .from(start.getOutputNodes()[0].id)
          .to(validate.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t2')
          .from(validate.getOutputNodes()[0].id)
          .to(process.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t3')
          .from(process.getOutputNodes()[0].id)
          .to(ship.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t4')
          .from(ship.getOutputNodes()[0].id)
          .to(complete.getInputNodes()[0].id)
          .build()
      )
      .build();

    // Create observable state machine
    const observableSM = new ObservableStateMachine();
    observableSM.setStateMachine(sm);

    const diagram = new StateMachineDiagram(container);

    const steps = ['start', 'validate', 'process', 'ship', 'complete'];
    const transitions = ['t1', 't2', 't3', 't4'];
    let currentIndex = -1;

    // Subscribe to state changes
    observableSM.executionState.subscribe(() => {
      const currentStepId = observableSM.getCurrentStepId();
      diagram.setExecutionState(observableSM.executionState());
      diagram.render(sm);

      if (currentStepId) {
        const step = sm.getStep(currentStepId);
        statusDiv.textContent = `Current Step: ${step?.title || currentStepId}`;
      } else {
        statusDiv.textContent = 'Not started';
      }

      nextButton.disabled = currentIndex >= steps.length - 1;
    });

    // Initial render
    diagram.render(sm);
    statusDiv.textContent = 'Click "Start Execution" to begin';

    startButton.onclick = () => {
      currentIndex = 0;
      observableSM.setCurrentStep(steps[currentIndex]);
      startButton.disabled = true;
      nextButton.disabled = false;
    };

    nextButton.onclick = () => {
      if (currentIndex < steps.length - 1) {
        observableSM.addVisitedTransition(transitions[currentIndex]);
        currentIndex++;
        observableSM.setCurrentStep(steps[currentIndex]);
      }
    };

    resetButton.onclick = () => {
      observableSM.resetExecution();
      currentIndex = -1;
      startButton.disabled = false;
      nextButton.disabled = true;
      statusDiv.textContent = 'Click "Start Execution" to begin';
      diagram.setExecutionState(observableSM.executionState());
      diagram.render(sm);
    };

    return wrapper;
  },
};

export const DataBindingExample: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div style="width: 100%; height: 700px; display: flex; flex-direction: column;">
        <div style="padding: 20px; background: #fff; border-bottom: 1px solid #ddd;">
          <h3 style="margin: 0 0 10px 0;">Knockout.js Data Binding</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">
            The diagram automatically updates when observable properties change
          </p>
        </div>
        <div data-bind="stateDiagram: { stateMachine: currentStateMachine, executionState: execState }"
             style="flex: 1; background: #f5f5f5;">
        </div>
      </div>
    `;

    // Create view model
    const viewModel = {
      currentStateMachine: ko.observable(null as any),
      execState: ko.observable(new (class {
        getCurrentStepId() { return null; }
        isStepVisited() { return false; }
        isTransitionVisited() { return false; }
        isCurrentStep() { return false; }
        getStepVisitCount() { return 0; }
      })())
    };

    // Apply bindings
    ko.applyBindings(viewModel, wrapper);

    // Create and set state machine
    setTimeout(() => {
      const start = StepBuilder.create('start')
        .asStart()
        .withTitle('Start')
        .build();

      const process = StepBuilder.create('process')
        .asProcess()
        .withTitle('Process')
        .withInputNodes(1)
        .withOutputNodes(1)
        .build();

      const end = StepBuilder.create('end')
        .asEnd()
        .withTitle('End')
        .build();

      const sm = StateMachineBuilder.create('binding-demo')
        .withName('Data Binding Demo')
        .addStep(start)
        .addStep(process)
        .addStep(end)
        .addTransition(
          TransitionBuilder.connect(
            start.getOutputNodes()[0].id,
            process.getInputNodes()[0].id
          ).build()
        )
        .addTransition(
          TransitionBuilder.connect(
            process.getOutputNodes()[0].id,
            end.getInputNodes()[0].id
          ).build()
        )
        .build();

      viewModel.currentStateMachine(sm);
    }, 100);

    return wrapper;
  },
};
