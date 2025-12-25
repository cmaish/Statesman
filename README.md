# Statesman Diagram Library

A beautiful, customizable browser-based diagramming library for rendering **Extended Finite State Machines** (EFSMs) in TypeScript.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🎨 **Beautiful & Customizable** - Modern, appealing designs with full theme support (light/dark themes included)
- 🔌 **Knockout.js Integration** - Seamless integration with Knockout observables for reactive updates
- 🎯 **Type-Safe** - Written in TypeScript with comprehensive type definitions
- 🎬 **Execution Visualization** - Show current state, execution traces, and visit counts
- 🏗️ **Builder Pattern** - Fluent API for creating state machines with minimal boilerplate
- 📊 **Complex Workflows** - Support for multiple inputs/outputs, conditions, branches, and loops
- ⚡ **Performance** - Efficient SVG rendering with optimized layout algorithms
- 🧪 **Well-Tested** - Comprehensive unit test coverage (>80%)
- 📖 **Storybook** - Full suite of interactive examples and documentation

## Installation

```bash
npm install statesman-diagram
```

## Quick Start

### Basic Usage

```typescript
import {
  StateMachineDiagram,
  StepBuilder,
  TransitionBuilder,
  StateMachineBuilder
} from 'statesman-diagram';

// Create steps using the fluent builder API
const start = StepBuilder.create('start')
  .asStart()
  .withTitle('Begin Process')
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
  .withTitle('Complete')
  .withIcon('✅')
  .build();

// Build the state machine
const stateMachine = StateMachineBuilder.create('workflow')
  .withName('Simple Workflow')
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

// Render the diagram
const container = document.getElementById('diagram');
const diagram = new StateMachineDiagram(container, {
  theme: 'default',
  enableAnimations: true
});
diagram.render(stateMachine);
```

## Core Concepts

### Steps

Steps are the nodes in your state machine. They represent states or actions in your workflow.

**Step Types:**
- `START` - Initial step(s) where execution begins
- `END` - Terminal step(s) where execution completes
- `PROCESS` - General processing step
- `DECISION` - Conditional branching step (like a logic gate)
- `CUSTOM` - Custom step type

**Creating Steps:**

```typescript
// Start step
const start = StepBuilder.create('start')
  .asStart()
  .withTitle('Start')
  .withIcon('▶️')
  .build();

// Process step
const process = StepBuilder.create('process1')
  .asProcess()
  .withTitle('Validate Input')
  .withDescription('Check if input meets requirements')
  .withIcon('✓')
  .withProperty('timeout', 5000)
  .withInputNodes(1)
  .withOutputNodes(1)
  .build();

// Decision step with multiple outputs
const decision = StepBuilder.create('decision1')
  .asDecision()
  .withTitle('Check Value')
  .withIcon('❓')
  .withDecisionOutputs('Yes', 'No')
  .build();

// End step
const end = StepBuilder.create('end')
  .asEnd()
  .withTitle('Complete')
  .build();
```

### Nodes

Nodes are the connection points on steps. Each step can have multiple input and output nodes.

- **Input Nodes** - Where transitions come in
- **Output Nodes** - Where transitions go out

```typescript
// Step with multiple inputs and outputs
const gate = StepBuilder.create('gate')
  .asProcess()
  .withTitle('Logic Gate')
  .withInputNodes(2, 'input')  // 2 input nodes
  .withOutputNodes(3, ['success', 'failure', 'retry'])  // 3 output nodes
  .build();
```

### Transitions

Transitions connect output nodes to input nodes, defining the flow of execution.

**Basic Transition:**

```typescript
const transition = TransitionBuilder.connect(sourceNodeId, targetNodeId)
  .withLabel('Next')
  .build();
```

**Conditional Transitions:**

```typescript
// Message match condition (regex)
const messageTransition = TransitionBuilder.connect(source, target)
  .withMessageMatch('success', 'i')  // Case-insensitive match
  .withLabel('On Success')
  .build();

// Timed delay condition
const delayTransition = TransitionBuilder.connect(source, target)
  .withDelay(1000)  // 1 second delay
  .withLabel('After 1s')
  .build();
```

### State Machine

The state machine is the container for all steps and transitions.

```typescript
const sm = StateMachineBuilder.create('my-workflow')
  .withName('My Workflow')
  .withDescription('A sample workflow')
  .addStep(step1)
  .addStep(step2)
  .addTransition(transition1)
  .build();

// Validate the state machine
const validation = sm.validate();
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## Execution Visualization

Track and visualize the execution state of your state machine:

```typescript
import { ExecutionState } from 'statesman-diagram';

const execState = new ExecutionState();

// Set current step
execState.setCurrentStep('step1', { data: 'optional metadata' });

// Mark transitions as visited
execState.addVisitedTransition('transition1');

// Move to next step
execState.setCurrentStep('step2');

// Render with execution state
diagram.setExecutionState(execState);
diagram.render(stateMachine);

// Get execution trace
const trace = execState.getTrace();
console.log('Execution trace:', trace);

// Check visit counts
const visitCount = execState.getStepVisitCount('step1');
console.log('Step visited', visitCount, 'times');
```

## Themes and Customization

### Built-in Themes

```typescript
// Light theme (default)
const diagram = new StateMachineDiagram(container, {
  theme: 'default'
});

// Dark theme
const diagram = new StateMachineDiagram(container, {
  theme: 'dark'
});
```

### Custom Themes

```typescript
import { Theme, ThemeManager } from 'statesman-diagram';

const customTheme: Theme = {
  name: 'custom',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    success: '#95E1D3',
    warning: '#F38181',
    danger: '#AA3939',
    info: '#7FCDCD',
    background: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#95A5A6',
    border: '#BDC3C7',
    hover: '#ECF0F1',
    selected: '#FF6B6B'
  },
  stepStyles: new Map([
    [StepType.START, {
      fill: '#95E1D3',
      stroke: '#7FCDCD',
      strokeWidth: 2,
      cornerRadius: 25,
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      fontWeight: '600',
      padding: 16,
      minWidth: 120,
      minHeight: 50,
      iconSize: 24
    }],
    // ... other step styles
  ]),
  // ... other theme properties
};

// Register and use custom theme
diagram.registerTheme(customTheme);
diagram.setTheme('custom');
```

### Diagram Options

```typescript
const diagram = new StateMachineDiagram(container, {
  theme: 'default',
  layoutDirection: 'horizontal',  // or 'vertical'
  layoutAlignment: 'center',      // 'start', 'center', 'end'
  showGrid: false,
  showNodeLabels: true,
  enableAnimations: true,
  autoLayout: true
});
```

## Knockout.js Integration

### Using the Binding Handler

```html
<div data-bind="stateDiagram: {
  stateMachine: myStateMachine,
  theme: 'dark',
  executionState: currentExecution,
  selectedStepId: selectedStep,
  onStepClick: handleStepClick
}"></div>
```

### Observable State Machine

```typescript
import { ObservableStateMachine } from 'statesman-diagram';

const observableSM = new ObservableStateMachine();

// Set state machine
observableSM.setStateMachine(myStateMachine);

// Control execution
observableSM.setCurrentStep('step1');
observableSM.addVisitedTransition('trans1');

// Reset execution
observableSM.resetExecution();

// Subscribe to changes
observableSM.executionState.subscribe((newState) => {
  console.log('Execution state changed:', newState);
});
```

## Interaction Handling

Handle user interactions with the diagram:

```typescript
// Step click
diagram.onStepClick((step) => {
  console.log('Clicked step:', step.title);
  console.log('Properties:', step.properties);
});

// Step double-click
diagram.onStepDoubleClick((step) => {
  console.log('Double-clicked step:', step.title);
});

// Get selected step
const selected = diagram.getSelectedStep();
```

## Advanced Examples

### Complex Workflow with Loops

```typescript
const start = StepBuilder.create('start').asStart().withTitle('Start').build();
const validate = StepBuilder.create('validate').asDecision()
  .withTitle('Validate')
  .withDecisionOutputs('Valid', 'Invalid')
  .build();
const process = StepBuilder.create('process').asProcess()
  .withTitle('Process')
  .withInputNodes(1)
  .withOutputNodes(1)
  .build();
const retry = StepBuilder.create('retry').asProcess()
  .withTitle('Retry')
  .withInputNodes(1)
  .withOutputNodes(1)
  .build();
const success = StepBuilder.create('success').asEnd().withTitle('Success').build();
const failure = StepBuilder.create('failure').asEnd().withTitle('Failed').build();

const sm = StateMachineBuilder.create('retry-workflow')
  .withName('Workflow with Retries')
  .addStep(start)
  .addStep(validate)
  .addStep(process)
  .addStep(retry)
  .addStep(success)
  .addStep(failure)
  .addTransition(TransitionBuilder.connect(
    start.getOutputNodes()[0].id,
    validate.getInputNodes()[0].id
  ).build())
  .addTransition(TransitionBuilder.connect(
    validate.getOutputNodes()[0].id,
    process.getInputNodes()[0].id
  ).build())
  .addTransition(TransitionBuilder.connect(
    validate.getOutputNodes()[1].id,
    retry.getInputNodes()[0].id
  ).build())
  .addTransition(TransitionBuilder.connect(
    retry.getOutputNodes()[0].id,
    validate.getInputNodes()[0].id  // Loop back
  ).build())
  .addTransition(TransitionBuilder.connect(
    process.getOutputNodes()[0].id,
    success.getInputNodes()[0].id
  ).build())
  .build();
```

### Programmatically Adding Steps

```typescript
// Add a new step to an existing state machine
const newStep = StepBuilder.create('newStep')
  .asProcess()
  .withTitle('New Step')
  .withInputNodes(1)
  .withOutputNodes(1)
  .build();

stateMachine.addStep(newStep);

// Connect it to existing steps
const transition = TransitionBuilder.connect(
  existingStep.getOutputNodes()[0].id,
  newStep.getInputNodes()[0].id
).build();

stateMachine.addTransition(transition);

// Re-render
diagram.render(stateMachine);
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Storybook

View interactive examples and documentation:

```bash
npm run storybook
```

Then open http://localhost:6006

## Architecture

The library follows clean architecture principles with clear separation of concerns:

```
src/
├── models/           # Core data models (Step, Node, Transition, StateMachine)
├── builders/         # Fluent builder APIs
├── rendering/        # SVG rendering engine and themes
├── layout/           # Layout algorithms
├── interaction/      # User interaction handling
├── integration/      # Framework integrations (Knockout.js)
└── diagram/          # Main diagram orchestration class
```

### Key Design Patterns

- **Builder Pattern** - Fluent API for creating steps and transitions
- **Strategy Pattern** - Pluggable layout algorithms and themes
- **Observer Pattern** - Knockout.js integration for reactive updates
- **Facade Pattern** - StateMachineDiagram provides simple API over complex subsystems

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Please ensure:

- All tests pass (`npm test`)
- Code coverage remains above 80%
- TypeScript strict mode compliance
- Follow existing code style

## License

MIT

## Credits

Created with TypeScript, SVG, and Knockout.js.
