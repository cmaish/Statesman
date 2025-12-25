/**
 * Storybook stories for visual customization and effects
 */

import { Meta, StoryObj } from '@storybook/html';
import { StateGraph } from '../diagram/StateGraph';
import { Theme, StepType, DefaultTheme, DarkTheme } from '../rendering/Theme';

const meta: Meta = {
  title: 'Customization/Visual Effects',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

const sampleGraph = {
  nodes: [
    { id: 'start', type: 'start' as const, title: 'Start', icon: '▶️' },
    { id: 'validate', type: 'decision' as const, title: 'Validate', icon: '✓', outputs: [{ label: 'Valid' }, { label: 'Invalid' }] },
    { id: 'process', type: 'process' as const, title: 'Process', icon: '⚙️' },
    { id: 'error', type: 'end' as const, title: 'Error', icon: '❌' },
    { id: 'success', type: 'end' as const, title: 'Success', icon: '✅' }
  ],
  edges: [
    { from: 'start', to: 'validate' },
    { from: 'validate:0', to: 'process', label: 'Valid' },
    { from: 'validate:1', to: 'error', label: 'Invalid' },
    { from: 'process', to: 'success' }
  ]
};

export const WithGradients: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '700px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const info = document.createElement('div');
    info.style.padding = '20px';
    info.style.background = '#EEF2FF';
    info.style.borderBottom = '1px solid #C7D2FE';
    info.innerHTML = '<h3 style="margin: 0; color: #4338CA;">Enhanced with Gradients & Shadows</h3><p style="margin: 5px 0 0 0; color: #6366F1;">All steps feature smooth vertical gradients for visual depth</p>';

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#f5f5f5';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      enableAnimations: true
    });

    graph.graph = sampleGraph;

    return wrapper;
  },
};

export const DarkThemeWithGlow: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '700px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const info = document.createElement('div');
    info.style.padding = '20px';
    info.style.background = '#1F2937';
    info.style.borderBottom = '1px solid #374151';
    info.innerHTML = '<h3 style="margin: 0; color: #818CF8;">Dark Theme with Glow Effects</h3><p style="margin: 5px 0 0 0; color: #A78BFA;">Steps feature colored glow effects for a modern look</p>';

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#1F2937';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'dark',
      enableAnimations: true
    });

    graph.graph = sampleGraph;

    return wrapper;
  },
};

export const WithGrid: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '700px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const info = document.createElement('div');
    info.style.padding = '20px';
    info.style.background = '#F0FDF4';
    info.style.borderBottom = '1px solid #BBF7D0';
    info.innerHTML = '<h3 style="margin: 0; color: #15803D;">With Background Grid</h3><p style="margin: 5px 0 0 0; color: #16A34A;">Helpful for alignment and spatial reference</p>';

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = 'white';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      showGrid: true,
      enableAnimations: true
    });

    graph.graph = sampleGraph;

    return wrapper;
  },
};

export const CustomTheme: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '700px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const info = document.createElement('div');
    info.style.padding = '20px';
    info.style.background = '#FFF7ED';
    info.style.borderBottom = '1px solid = '#FDBA74';
    info.innerHTML = '<h3 style="margin: 0; color: #C2410C;">Custom Sunset Theme</h3><p style="margin: 5px 0 0 0; color: #EA580C;">Fully customizable colors, gradients, and effects</p>';

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#FFF7ED';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    // Create custom theme
    const SunsetTheme: Theme = {
      name: 'sunset',
      colors: {
        primary: '#F97316',
        secondary: '#FB923C',
        success: '#84CC16',
        warning: '#EAB308',
        danger: '#DC2626',
        info: '#0EA5E9',
        background: '#FFF7ED',
        text: '#7C2D12',
        textSecondary: '#9A3412',
        border: '#FDBA74',
        hover: '#FFEDD5',
        selected: '#F97316'
      },
      stepStyles: new Map([
        [StepType.START, {
          fill: '#84CC16',
          fillGradient: { start: '#BEF264', end: '#84CC16', direction: 'vertical' },
          stroke: '#65A30D',
          strokeWidth: 3,
          cornerRadius: 30,
          fontSize: 14,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '700',
          padding: 16,
          minWidth: 120,
          minHeight: 50,
          iconSize: 28,
          shadow: {
            enabled: true,
            blur: 10,
            offsetX: 0,
            offsetY: 5,
            color: '#65A30D',
            opacity: 0.3
          }
        }],
        [StepType.END, {
          fill: '#DC2626',
          fillGradient: { start: '#F87171', end: '#DC2626', direction: 'vertical' },
          stroke: '#B91C1C',
          strokeWidth: 3,
          cornerRadius: 30,
          fontSize: 14,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '700',
          padding: 16,
          minWidth: 120,
          minHeight: 50,
          iconSize: 28,
          shadow: {
            enabled: true,
            blur: 10,
            offsetX: 0,
            offsetY: 5,
            color: '#B91C1C',
            opacity: 0.3
          }
        }],
        [StepType.DECISION, {
          fill: '#EAB308',
          fillGradient: { start: '#FDE047', end: '#EAB308', direction: 'vertical' },
          stroke: '#CA8A04',
          strokeWidth: 3,
          cornerRadius: 12,
          fontSize: 14,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '600',
          padding: 18,
          minWidth: 150,
          minHeight: 90,
          iconSize: 26,
          shadow: {
            enabled: true,
            blur: 8,
            offsetX: 0,
            offsetY: 4,
            color: '#CA8A04',
            opacity: 0.25
          }
        }],
        [StepType.PROCESS, {
          fill: '#F97316',
          fillGradient: { start: '#FB923C', end: '#F97316', direction: 'vertical' },
          stroke: '#EA580C',
          strokeWidth: 3,
          cornerRadius: 12,
          fontSize: 14,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '600',
          padding: 18,
          minWidth: 170,
          minHeight: 90,
          iconSize: 26,
          shadow: {
            enabled: true,
            blur: 8,
            offsetX: 0,
            offsetY: 4,
            color: '#EA580C',
            opacity: 0.25
          }
        }]
      ]),
      defaultStepStyle: {
        fill: '#A1A1AA',
        fillGradient: { start: '#D4D4D8', end: '#A1A1AA', direction: 'vertical' },
        stroke: '#71717A',
        strokeWidth: 2,
        cornerRadius: 10,
        fontSize: 14,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '500',
        padding: 16,
        minWidth: 140,
        minHeight: 80,
        iconSize: 24,
        shadow: {
          enabled: true,
          blur: 6,
          offsetX: 0,
          offsetY: 3,
          color: '#000000',
          opacity: 0.15
        }
      },
      nodeStyle: {
        radius: 7,
        fill: '#FFFFFF',
        stroke: '#EA580C',
        strokeWidth: 2,
        hoverRadius: 10
      },
      transitionStyle: {
        stroke: '#9A3412',
        strokeWidth: 2.5,
        strokeDasharray: '',
        arrowSize: 10,
        labelFontSize: 13,
        labelFontFamily: 'system-ui, -apple-system, sans-serif',
        labelBackground: '#FFF7ED',
        labelPadding: 5,
        curveStyle: 'curved',
        animationSpeed: 1,
        highlightColor: '#F97316',
        opacity: 0.95
      },
      spacing: {
        horizontal: 220,
        vertical: 130,
        nodeSpacing: 14
      },
      effects: {
        enableShadows: true,
        enableGradients: true,
        enableAnimations: true,
        enableGlow: false
      },
      grid: {
        enabled: false,
        size: 20,
        color: '#FDBA74',
        opacity: 0.2
      }
    };

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: SunsetTheme as unknown as string,
      enableAnimations: true
    });

    graph.graph = sampleGraph;

    return wrapper;
  },
};

export const ThemeComparison: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '900px';
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = '1fr 1fr';
    wrapper.style.gap = '20px';
    wrapper.style.padding = '20px';
    wrapper.style.background = '#F3F4F6';

    // Default theme
    const defaultContainer = document.createElement('div');
    defaultContainer.style.background = '#FFFFFF';
    defaultContainer.style.borderRadius = '12px';
    defaultContainer.style.overflow = 'hidden';
    defaultContainer.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';

    const defaultHeader = document.createElement('div');
    defaultHeader.style.padding = '15px';
    defaultHeader.style.background = '#EEF2FF';
    defaultHeader.style.fontWeight = '600';
    defaultHeader.style.color = '#4338CA';
    defaultHeader.textContent = 'Default Theme (Light)';

    const defaultDiagram = document.createElement('div');
    defaultDiagram.style.height = '400px';

    defaultContainer.appendChild(defaultHeader);
    defaultContainer.appendChild(defaultDiagram);

    // Dark theme
    const darkContainer = document.createElement('div');
    darkContainer.style.background = '#1F2937';
    darkContainer.style.borderRadius = '12px';
    darkContainer.style.overflow = 'hidden';
    darkContainer.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.3)';

    const darkHeader = document.createElement('div');
    darkHeader.style.padding = '15px';
    darkHeader.style.background = '#374151';
    darkHeader.style.fontWeight = '600';
    darkHeader.style.color = '#A78BFA';
    darkHeader.textContent = 'Dark Theme with Glow';

    const darkDiagram = document.createElement('div');
    darkDiagram.style.height = '400px';

    darkContainer.appendChild(darkHeader);
    darkContainer.appendChild(darkDiagram);

    wrapper.appendChild(defaultContainer);
    wrapper.appendChild(darkContainer);

    // Initialize both graphs
    const defaultGraph = new StateGraph();
    defaultGraph.initialize(defaultDiagram, { theme: 'default' });
    defaultGraph.graph = sampleGraph;

    const darkGraph = new StateGraph();
    darkGraph.initialize(darkDiagram, { theme: 'dark' });
    darkGraph.graph = sampleGraph;

    return wrapper;
  },
};
