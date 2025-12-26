/**
 * Main entry point for the Statesman diagram library
 */

// Core models
export { StateMachine, StateMachineConfig } from './models/StateMachine';
export { Step, StepConfig } from './models/Step';
export { Node, NodeConfig } from './models/Node';
export { Transition, TransitionConfig } from './models/Transition';
export {
  ICondition,
  MessageMatchCondition,
  TimedDelayCondition,
  NoCondition
} from './models/Condition';
export { ExecutionState, ExecutionTrace } from './models/ExecutionState';
export {
  StepType,
  NodeType,
  ConditionType,
  Point,
  Size,
  BoundingBox,
  Properties
} from './models/types';

// Builders
export {
  StepBuilder,
  TransitionBuilder,
  StateMachineBuilder
} from './builders/StepBuilder';

// Diagram
export { StateMachineDiagram, DiagramOptions } from './diagram/StateMachineDiagram';
export {
  StateGraph,
  GraphData,
  GraphNodeData,
  GraphEdgeData,
  StateGraphOptions
} from './diagram/StateGraph';

// Rendering
export {
  Theme,
  ColorScheme,
  StepStyle,
  NodeStyle,
  TransitionStyle,
  DefaultTheme,
  DarkTheme,
  ThemeManager
} from './rendering/Theme';
export { SVGEffects } from './rendering/SVGEffects';
export { SVGRenderer, RenderOptions } from './rendering/SVGRenderer';
export { PathUtil, PathStyle } from './rendering/PathUtil';

// Layout
export { LayoutEngine, LayoutOptions } from './layout/LayoutEngine';

// Integration
export {
  KnockoutDiagramBinding,
  ObservableStateMachine,
  DiagramBindingOptions
} from './integration/KnockoutBinding';

// Re-export main class as default
export { StateMachineDiagram as default } from './diagram/StateMachineDiagram';
