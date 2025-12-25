/**
 * Storybook stories for execution state visualization
 */

import { Meta, StoryObj } from '@storybook/html';
import { StateMachineDiagram } from '../diagram/StateMachineDiagram';
import { StepBuilder, TransitionBuilder, StateMachineBuilder } from '../builders/StepBuilder';
import { ExecutionState } from '../models/ExecutionState';

const meta: Meta = {
  title: 'Features/Execution Visualization',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const CurrentState: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.background = '#f5f5f5';

    const start = StepBuilder.create('start')
      .asStart()
      .withTitle('Start')
      .build();

    const step1 = StepBuilder.create('step1')
      .asProcess()
      .withTitle('Step 1')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const step2 = StepBuilder.create('step2')
      .asProcess()
      .withTitle('Step 2 (Current)')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const step3 = StepBuilder.create('step3')
      .asProcess()
      .withTitle('Step 3')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const end = StepBuilder.create('end')
      .asEnd()
      .withTitle('End')
      .build();

    const sm = StateMachineBuilder.create('execution-demo')
      .withName('Execution Demo')
      .addStep(start)
      .addStep(step1)
      .addStep(step2)
      .addStep(step3)
      .addStep(end)
      .addTransition(
        TransitionBuilder.connect(
          start.getOutputNodes()[0].id,
          step1.getInputNodes()[0].id
        ).build()
      )
      .addTransition(
        TransitionBuilder.connect(
          step1.getOutputNodes()[0].id,
          step2.getInputNodes()[0].id
        ).build()
      )
      .addTransition(
        TransitionBuilder.connect(
          step2.getOutputNodes()[0].id,
          step3.getInputNodes()[0].id
        ).build()
      )
      .addTransition(
        TransitionBuilder.connect(
          step3.getOutputNodes()[0].id,
          end.getInputNodes()[0].id
        ).build()
      )
      .build();

    // Create execution state
    const execState = new ExecutionState();
    execState.setCurrentStep('start');
    execState.addVisitedTransition(
      TransitionBuilder.connect(
        start.getOutputNodes()[0].id,
        step1.getInputNodes()[0].id
      ).build().id
    );
    execState.setCurrentStep('step1');
    execState.addVisitedTransition(
      TransitionBuilder.connect(
        step1.getOutputNodes()[0].id,
        step2.getInputNodes()[0].id
      ).build().id
    );
    execState.setCurrentStep('step2');

    const diagram = new StateMachineDiagram(container);
    diagram.setExecutionState(execState);
    diagram.render(sm);

    return container;
  },
};

export const ExecutionTrace: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.background = '#f5f5f5';

    const start = StepBuilder.create('start')
      .asStart()
      .withTitle('Start')
      .build();

    const decision = StepBuilder.create('decision')
      .asDecision()
      .withTitle('Check')
      .withInputNodes(1)
      .withDecisionOutputs('Pass', 'Fail')
      .build();

    const retry = StepBuilder.create('retry')
      .asProcess()
      .withTitle('Retry')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const success = StepBuilder.create('success')
      .asEnd()
      .withTitle('Success')
      .build();

    const sm = StateMachineBuilder.create('trace-demo')
      .withName('Execution Trace Demo')
      .addStep(start)
      .addStep(decision)
      .addStep(retry)
      .addStep(success)
      .addTransition(
        TransitionBuilder.create('t1')
          .from(start.getOutputNodes()[0].id)
          .to(decision.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t2')
          .from(decision.getOutputNodes()[0].id)
          .to(success.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t3')
          .from(decision.getOutputNodes()[1].id)
          .to(retry.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t4')
          .from(retry.getOutputNodes()[0].id)
          .to(decision.getInputNodes()[0].id)
          .build()
      )
      .build();

    // Simulate multiple retries
    const execState = new ExecutionState();
    execState.setCurrentStep('start');
    execState.addVisitedTransition('t1');
    execState.setCurrentStep('decision');
    execState.addVisitedTransition('t3');
    execState.setCurrentStep('retry'); // First retry
    execState.addVisitedTransition('t4');
    execState.setCurrentStep('decision');
    execState.addVisitedTransition('t3');
    execState.setCurrentStep('retry'); // Second retry
    execState.addVisitedTransition('t4');
    execState.setCurrentStep('decision');
    execState.addVisitedTransition('t2');
    execState.setCurrentStep('success');

    const diagram = new StateMachineDiagram(container, {
      enableAnimations: true
    });
    diagram.setExecutionState(execState);
    diagram.render(sm);

    return container;
  },
};

export const InteractiveExecution: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '700px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '10px';

    const controls = document.createElement('div');
    controls.style.padding = '20px';
    controls.style.background = '#fff';
    controls.style.borderBottom = '1px solid #ddd';

    const stepButton = document.createElement('button');
    stepButton.textContent = 'Next Step';
    stepButton.style.padding = '10px 20px';
    stepButton.style.fontSize = '14px';
    stepButton.style.cursor = 'pointer';
    stepButton.style.marginRight = '10px';

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.padding = '10px 20px';
    resetButton.style.fontSize = '14px';
    resetButton.style.cursor = 'pointer';

    const info = document.createElement('div');
    info.style.marginLeft = '20px';
    info.style.display = 'inline-block';
    info.textContent = 'Click "Next Step" to advance execution';

    controls.appendChild(stepButton);
    controls.appendChild(resetButton);
    controls.appendChild(info);

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#f5f5f5';

    wrapper.appendChild(controls);
    wrapper.appendChild(container);

    // Create workflow
    const start = StepBuilder.create('start')
      .asStart()
      .withTitle('Start')
      .build();

    const step1 = StepBuilder.create('step1')
      .asProcess()
      .withTitle('Initialize')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const step2 = StepBuilder.create('step2')
      .asProcess()
      .withTitle('Process')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const step3 = StepBuilder.create('step3')
      .asProcess()
      .withTitle('Finalize')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const end = StepBuilder.create('end')
      .asEnd()
      .withTitle('Complete')
      .build();

    const sm = StateMachineBuilder.create('interactive')
      .withName('Interactive Execution')
      .addStep(start)
      .addStep(step1)
      .addStep(step2)
      .addStep(step3)
      .addStep(end)
      .addTransition(
        TransitionBuilder.create('t1')
          .from(start.getOutputNodes()[0].id)
          .to(step1.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t2')
          .from(step1.getOutputNodes()[0].id)
          .to(step2.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t3')
          .from(step2.getOutputNodes()[0].id)
          .to(step3.getInputNodes()[0].id)
          .build()
      )
      .addTransition(
        TransitionBuilder.create('t4')
          .from(step3.getOutputNodes()[0].id)
          .to(end.getInputNodes()[0].id)
          .build()
      )
      .build();

    const execState = new ExecutionState();
    const diagram = new StateMachineDiagram(container);

    const steps = ['start', 'step1', 'step2', 'step3', 'end'];
    const transitions = ['t1', 't2', 't3', 't4'];
    let currentIndex = 0;

    const updateDiagram = () => {
      diagram.setExecutionState(execState);
      diagram.render(sm);
      info.textContent = `Current: ${steps[currentIndex]} (${currentIndex + 1}/${steps.length})`;
    };

    execState.setCurrentStep('start');
    updateDiagram();

    stepButton.onclick = () => {
      if (currentIndex < steps.length - 1) {
        execState.addVisitedTransition(transitions[currentIndex]);
        currentIndex++;
        execState.setCurrentStep(steps[currentIndex]);
        updateDiagram();
      }
    };

    resetButton.onclick = () => {
      execState.reset();
      currentIndex = 0;
      execState.setCurrentStep('start');
      updateDiagram();
    };

    return wrapper;
  },
};
