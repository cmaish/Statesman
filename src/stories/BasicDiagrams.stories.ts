/**
 * Storybook stories for basic diagrams
 */

import { Meta, StoryObj } from '@storybook/html';
import { StateMachineDiagram } from '../diagram/StateMachineDiagram';
import { StepBuilder, TransitionBuilder, StateMachineBuilder } from '../builders/StepBuilder';

const meta: Meta = {
  title: 'Diagrams/Basic',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const SimpleLinearFlow: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.background = '#f5f5f5';

    // Create a simple linear flow
    const start = StepBuilder.create('start')
      .asStart()
      .withTitle('Start')
      .withIcon('▶️')
      .build();

    const process = StepBuilder.create('process')
      .asProcess()
      .withTitle('Process Data')
      .withIcon('⚙️')
      .withDescription('Process incoming data')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const end = StepBuilder.create('end')
      .asEnd()
      .withTitle('End')
      .withIcon('⏹️')
      .build();

    const transition1 = TransitionBuilder.connect(
      start.getOutputNodes()[0].id,
      process.getInputNodes()[0].id
    ).build();

    const transition2 = TransitionBuilder.connect(
      process.getOutputNodes()[0].id,
      end.getInputNodes()[0].id
    ).build();

    const sm = StateMachineBuilder.create('simple-flow')
      .withName('Simple Linear Flow')
      .withDescription('A basic linear workflow')
      .addStep(start)
      .addStep(process)
      .addStep(end)
      .addTransition(transition1)
      .addTransition(transition2)
      .build();

    const diagram = new StateMachineDiagram(container);
    diagram.render(sm);

    return container;
  },
};

export const DecisionFlow: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.background = '#f5f5f5';

    // Create a flow with a decision
    const start = StepBuilder.create('start')
      .asStart()
      .withTitle('Start')
      .withIcon('▶️')
      .build();

    const decision = StepBuilder.create('decision')
      .asDecision()
      .withTitle('Check Value')
      .withIcon('❓')
      .withDescription('Is value > 100?')
      .withInputNodes(1)
      .withDecisionOutputs('Yes', 'No')
      .build();

    const processHigh = StepBuilder.create('high')
      .asProcess()
      .withTitle('Process High')
      .withIcon('⬆️')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const processLow = StepBuilder.create('low')
      .asProcess()
      .withTitle('Process Low')
      .withIcon('⬇️')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const end = StepBuilder.create('end')
      .asEnd()
      .withTitle('End')
      .withIcon('⏹️')
      .build();

    const sm = StateMachineBuilder.create('decision-flow')
      .withName('Decision Flow')
      .addStep(start)
      .addStep(decision)
      .addStep(processHigh)
      .addStep(processLow)
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
          processHigh.getInputNodes()[0].id
        ).withLabel('> 100').build()
      )
      .addTransition(
        TransitionBuilder.connect(
          decision.getOutputNodes()[1].id,
          processLow.getInputNodes()[0].id
        ).withLabel('≤ 100').build()
      )
      .addTransition(
        TransitionBuilder.connect(
          processHigh.getOutputNodes()[0].id,
          end.getInputNodes()[0].id
        ).build()
      )
      .addTransition(
        TransitionBuilder.connect(
          processLow.getOutputNodes()[0].id,
          end.getInputNodes()[0].id
        ).build()
      )
      .build();

    const diagram = new StateMachineDiagram(container);
    diagram.render(sm);

    return container;
  },
};

export const ComplexWorkflow: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '700px';
    container.style.background = '#f5f5f5';

    const start = StepBuilder.create('start')
      .asStart()
      .withTitle('Receive Request')
      .withIcon('📥')
      .build();

    const validate = StepBuilder.create('validate')
      .asDecision()
      .withTitle('Validate Input')
      .withIcon('✓')
      .withInputNodes(1)
      .withDecisionOutputs('Valid', 'Invalid')
      .build();

    const process = StepBuilder.create('process')
      .asProcess()
      .withTitle('Process Request')
      .withIcon('⚙️')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const checkAuth = StepBuilder.create('auth')
      .asDecision()
      .withTitle('Check Auth')
      .withIcon('🔒')
      .withInputNodes(1)
      .withDecisionOutputs('Authorized', 'Denied')
      .build();

    const execute = StepBuilder.create('execute')
      .asProcess()
      .withTitle('Execute')
      .withIcon('▶️')
      .withInputNodes(1)
      .withOutputNodes(1)
      .build();

    const error = StepBuilder.create('error')
      .asEnd()
      .withTitle('Error')
      .withIcon('❌')
      .build();

    const success = StepBuilder.create('success')
      .asEnd()
      .withTitle('Success')
      .withIcon('✅')
      .build();

    const sm = StateMachineBuilder.create('complex-workflow')
      .withName('Complex Workflow')
      .withDescription('A multi-step workflow with validation and authorization')
      .addStep(start)
      .addStep(validate)
      .addStep(process)
      .addStep(checkAuth)
      .addStep(execute)
      .addStep(error)
      .addStep(success)
      .addTransition(
        TransitionBuilder.connect(
          start.getOutputNodes()[0].id,
          validate.getInputNodes()[0].id
        ).build()
      )
      .addTransition(
        TransitionBuilder.connect(
          validate.getOutputNodes()[0].id,
          process.getInputNodes()[0].id
        ).build()
      )
      .addTransition(
        TransitionBuilder.connect(
          validate.getOutputNodes()[1].id,
          error.getInputNodes()[0].id
        ).withLabel('Invalid Input').build()
      )
      .addTransition(
        TransitionBuilder.connect(
          process.getOutputNodes()[0].id,
          checkAuth.getInputNodes()[0].id
        ).build()
      )
      .addTransition(
        TransitionBuilder.connect(
          checkAuth.getOutputNodes()[0].id,
          execute.getInputNodes()[0].id
        ).build()
      )
      .addTransition(
        TransitionBuilder.connect(
          checkAuth.getOutputNodes()[1].id,
          error.getInputNodes()[0].id
        ).withLabel('Unauthorized').build()
      )
      .addTransition(
        TransitionBuilder.connect(
          execute.getOutputNodes()[0].id,
          success.getInputNodes()[0].id
        ).build()
      )
      .build();

    const diagram = new StateMachineDiagram(container);
    diagram.render(sm);

    return container;
  },
};
