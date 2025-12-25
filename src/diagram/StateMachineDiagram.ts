/**
 * Main diagram class that orchestrates all components
 */

import { StateMachine } from '../models/StateMachine';
import { Step } from '../models/Step';
import { SVGRenderer, RenderOptions } from '../rendering/SVGRenderer';
import { LayoutEngine, LayoutOptions } from '../layout/LayoutEngine';
import { ThemeManager, DefaultTheme, DarkTheme, Theme } from '../rendering/Theme';
import { InteractionHandler, InteractionCallbacks } from '../interaction/InteractionHandler';
import { ExecutionState } from '../models/ExecutionState';

export interface DiagramOptions {
  theme?: string | Theme;
  layoutDirection?: 'horizontal' | 'vertical';
  layoutAlignment?: 'start' | 'center' | 'end';
  showGrid?: boolean;
  showNodeLabels?: boolean;
  enableAnimations?: boolean;
  autoLayout?: boolean;
}

/**
 * Main diagram class that brings together all components
 */
export class StateMachineDiagram {
  private readonly themeManager: ThemeManager;
  private readonly layoutEngine: LayoutEngine;
  private renderer: SVGRenderer;
  private interactionHandler: InteractionHandler | null = null;
  private currentStateMachine: StateMachine | null = null;
  private executionState: ExecutionState | null = null;

  private callbacks: InteractionCallbacks = {};

  constructor(
    private readonly container: HTMLElement,
    private readonly options: DiagramOptions = {}
  ) {
    // Initialize theme
    this.themeManager = new ThemeManager(DefaultTheme);
    if (options.theme) {
      if (typeof options.theme === 'string') {
        this.themeManager.setTheme(options.theme);
      } else {
        this.themeManager.registerTheme(options.theme);
        this.themeManager.setTheme(options.theme.name);
      }
    }

    // Initialize layout engine
    const layoutOptions: LayoutOptions = {
      direction: options.layoutDirection || 'horizontal',
      alignment: options.layoutAlignment || 'center',
      autoSpace: options.autoLayout !== false
    };
    this.layoutEngine = new LayoutEngine(this.themeManager.getTheme(), layoutOptions);

    // Initialize renderer
    const renderOptions: RenderOptions = {
      showGrid: options.showGrid,
      showNodeLabels: options.showNodeLabels,
      enableAnimations: options.enableAnimations
    };
    this.renderer = new SVGRenderer(container, this.themeManager.getTheme(), renderOptions);
  }

  /**
   * Render a state machine diagram
   */
  render(stateMachine: StateMachine): void {
    this.currentStateMachine = stateMachine;

    // Validate state machine
    const validation = stateMachine.validate();
    if (!validation.valid) {
      console.warn('State machine validation warnings:', validation.errors);
    }

    // Apply layout
    this.layoutEngine.layout(stateMachine);

    // Update renderer with execution state
    if (this.executionState) {
      this.renderer = new SVGRenderer(
        this.container,
        this.themeManager.getTheme(),
        {
          ...this.options,
          executionState: this.executionState
        }
      );
    }

    // Render
    this.renderer.render(stateMachine);

    // Set up interactions
    if (this.interactionHandler) {
      this.interactionHandler.destroy();
    }
    this.interactionHandler = new InteractionHandler(
      this.container,
      stateMachine,
      this.callbacks
    );
  }

  /**
   * Set the execution state for visualization
   */
  setExecutionState(executionState: ExecutionState): void {
    this.executionState = executionState;
    if (this.currentStateMachine) {
      this.render(this.currentStateMachine);
    }
  }

  /**
   * Get the current execution state
   */
  getExecutionState(): ExecutionState | null {
    return this.executionState;
  }

  /**
   * Set callback for step clicks
   */
  onStepClick(callback: (step: Step) => void): void {
    this.callbacks.onStepClick = callback;
  }

  /**
   * Set callback for step double clicks
   */
  onStepDoubleClick(callback: (step: Step) => void): void {
    this.callbacks.onStepDoubleClick = callback;
  }

  /**
   * Set theme
   */
  setTheme(themeName: string): void {
    if (this.themeManager.setTheme(themeName)) {
      if (this.currentStateMachine) {
        this.render(this.currentStateMachine);
      }
    }
  }

  /**
   * Register a custom theme
   */
  registerTheme(theme: Theme): void {
    this.themeManager.registerTheme(theme);
  }

  /**
   * Zoom the diagram
   */
  setZoom(scale: number): void {
    this.renderer.setZoom(scale);
  }

  /**
   * Pan the diagram
   */
  setPan(x: number, y: number): void {
    this.renderer.setPan(x, y);
  }

  /**
   * Get the currently rendered state machine
   */
  getStateMachine(): StateMachine | null {
    return this.currentStateMachine;
  }

  /**
   * Get selected step
   */
  getSelectedStep(): Step | null {
    return this.interactionHandler?.getSelectedStep() || null;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.interactionHandler) {
      this.interactionHandler.destroy();
    }
    this.renderer.destroy();
  }
}
