/**
 * Storybook stories for theme customization
 */

import { Meta, StoryObj } from '@storybook/html';
import { StateMachineDiagram } from '../diagram/StateMachineDiagram';
import { StepBuilder, TransitionBuilder, StateMachineBuilder } from '../builders/StepBuilder';

const meta: Meta = {
  title: 'Customization/Themes',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

function createSampleWorkflow() {
  const start = StepBuilder.create('start')
    .asStart()
    .withTitle('Start')
    .build();

  const decision = StepBuilder.create('decision')
    .asDecision()
    .withTitle('Decision')
    .withInputNodes(1)
    .withDecisionOutputs('Yes', 'No')
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

  return StateMachineBuilder.create('sample')
    .withName('Sample Workflow')
    .addStep(start)
    .addStep(decision)
    .addStep(process)
    .addStep(end)
    .addTransition(
      TransitionBuilder.connect(
        start.getOutputNodes()[0].id,
        decision.getInputNodes()[0].id
      ).build()
    )
    .addTransition(
      TransitionBuilder.connect(
        decision.getOutputNodes()[0].id,
        process.getInputNodes()[0].id
      ).build()
    )
    .addTransition(
      TransitionBuilder.connect(
        decision.getOutputNodes()[1].id,
        end.getInputNodes()[0].id
      ).build()
    )
    .addTransition(
      TransitionBuilder.connect(
        process.getOutputNodes()[0].id,
        end.getInputNodes()[0].id
      ).build()
    )
    .build();
}

export const DefaultTheme: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.background = '#f5f5f5';

    const sm = createSampleWorkflow();
    const diagram = new StateMachineDiagram(container, {
      theme: 'default'
    });
    diagram.render(sm);

    return container;
  },
};

export const DarkTheme: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.background = '#1F2937';

    const sm = createSampleWorkflow();
    const diagram = new StateMachineDiagram(container, {
      theme: 'dark'
    });
    diagram.render(sm);

    return container;
  },
};

export const WithNodeLabels: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.background = '#f5f5f5';

    const sm = createSampleWorkflow();
    const diagram = new StateMachineDiagram(container, {
      showNodeLabels: true
    });
    diagram.render(sm);

    return container;
  },
};

export const WithAnimations: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.background = '#f5f5f5';

    const sm = createSampleWorkflow();
    const diagram = new StateMachineDiagram(container, {
      enableAnimations: true
    });
    diagram.render(sm);

    return container;
  },
};
