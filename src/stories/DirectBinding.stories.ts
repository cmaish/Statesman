/**
 * Storybook stories for direct binding API
 */

import { Meta, StoryObj } from '@storybook/html';
import { StateGraph, GraphData } from '../diagram/StateGraph';

const meta: Meta = {
  title: 'API/Direct Binding',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const SimpleDirectBinding: Story = {
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

    info.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #4338CA;">Direct Binding API Example</h3>
      <pre style="margin: 0; background: white; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px;"><code>// Create graph instance
const graph = new StateGraph();

// Initialize with element
graph.initialize(containerElement, {
  theme: 'default',
  enableAnimations: true
});

// Set graph data directly
graph.graph = {
  nodes: [
    { id: 'start', type: 'start', title: 'Begin' },
    { id: 'process', type: 'process', title: 'Process' },
    { id: 'end', type: 'end', title: 'Complete' }
  ],
  edges: [
    { from: 'start', to: 'process' },
    { from: 'process', to: 'end' }
  ]
};</code></pre>
    `;

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#f5f5f5';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    // Initialize the state graph
    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      enableAnimations: true,
      onNodeClick: (node) => {
        console.log('Clicked node:', node);
      }
    });

    // Set graph data
    graph.graph = {
      nodes: [
        { id: 'start', type: 'start', title: 'Begin', icon: '▶️' },
        {
          id: 'process',
          type: 'process',
          title: 'Process Data',
          icon: '⚙️',
          description: 'Process incoming data',
          properties: {
            timeout: 5000,
            retries: 3
          }
        },
        { id: 'end', type: 'end', title: 'Complete', icon: '✓' }
      ],
      edges: [
        { from: 'start', to: 'process', label: 'Start' },
        { from: 'process', to: 'end', label: 'Done' }
      ]
    };

    return wrapper;
  },
};

export const DecisionFlowDirectBinding: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '700px';
    container.style.background = '#f5f5f5';

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      enableAnimations: true
    });

    // Decision flow with multiple outputs
    graph.graph = {
      name: 'Order Processing',
      nodes: [
        {
          id: 'receive',
          type: 'start',
          title: 'Receive Order',
          icon: '📥'
        },
        {
          id: 'validate',
          type: 'decision',
          title: 'Validate',
          icon: '✓',
          outputs: [
            { label: 'Valid' },
            { label: 'Invalid' }
          ]
        },
        {
          id: 'process',
          type: 'process',
          title: 'Process Order',
          icon: '⚙️'
        },
        {
          id: 'reject',
          type: 'end',
          title: 'Rejected',
          icon: '❌'
        },
        {
          id: 'complete',
          type: 'end',
          title: 'Complete',
          icon: '✅'
        }
      ],
      edges: [
        { from: 'receive', to: 'validate' },
        { from: 'validate:0', to: 'process', label: 'Valid' },
        { from: 'validate:1', to: 'reject', label: 'Invalid' },
        { from: 'process', to: 'complete' }
      ]
    };

    return container;
  },
};

export const DynamicGraphUpdate: Story = {
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
    controls.style.display = 'flex';
    controls.style.gap = '10px';

    const addNodeBtn = document.createElement('button');
    addNodeBtn.textContent = 'Add Node';
    addNodeBtn.style.padding = '10px 20px';
    addNodeBtn.style.cursor = 'pointer';

    const updateNodeBtn = document.createElement('button');
    updateNodeBtn.textContent = 'Update Node';
    updateNodeBtn.style.padding = '10px 20px';
    updateNodeBtn.style.cursor = 'pointer';

    const removeNodeBtn = document.createElement('button');
    removeNodeBtn.textContent = 'Remove Node';
    removeNodeBtn.style.padding = '10px 20px';
    removeNodeBtn.style.cursor = 'pointer';

    controls.appendChild(addNodeBtn);
    controls.appendChild(updateNodeBtn);
    controls.appendChild(removeNodeBtn);

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#f5f5f5';

    wrapper.appendChild(controls);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      enableAnimations: true
    });

    const initialData: GraphData = {
      nodes: [
        { id: 'start', type: 'start', title: 'Start' },
        { id: 'end', type: 'end', title: 'End' }
      ],
      edges: [
        { from: 'start', to: 'end' }
      ]
    };

    graph.graph = initialData;

    let nodeCounter = 1;

    addNodeBtn.onclick = () => {
      const newNodeId = `process${nodeCounter++}`;
      const currentGraph = graph.graph!;

      // Insert new node between start and end
      currentGraph.nodes.push({
        id: newNodeId,
        type: 'process',
        title: `Step ${nodeCounter}`,
        icon: '⚙️'
      });

      // Update edges
      const startToEnd = currentGraph.edges.findIndex(e => e.from === 'start' && e.to === 'end');
      if (startToEnd >= 0) {
        currentGraph.edges.splice(startToEnd, 1);
      }

      currentGraph.edges.push(
        { from: 'start', to: newNodeId },
        { from: newNodeId, to: 'end' }
      );

      graph.graph = currentGraph;
    };

    updateNodeBtn.onclick = () => {
      graph.updateNodes([
        {
          id: 'start',
          type: 'start',
          title: 'Updated Start',
          icon: '🚀'
        }
      ]);
    };

    removeNodeBtn.onclick = () => {
      const processNodes = graph.graph!.nodes.filter(n => n.type === 'process');
      if (processNodes.length > 0) {
        graph.removeNodes([processNodes[0].id]);
      }
    };

    return wrapper;
  },
};

export const ExecutionTracking: Story = {
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

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.style.padding = '10px 20px';
    startBtn.style.marginRight = '10px';
    startBtn.style.cursor = 'pointer';

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.style.padding = '10px 20px';
    nextBtn.style.marginRight = '10px';
    nextBtn.style.cursor = 'pointer';
    nextBtn.disabled = true;

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.padding = '10px 20px';
    resetBtn.style.cursor = 'pointer';

    controls.appendChild(startBtn);
    controls.appendChild(nextBtn);
    controls.appendChild(resetBtn);

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#f5f5f5';

    wrapper.appendChild(controls);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      enableAnimations: true
    });

    graph.graph = {
      nodes: [
        { id: 'start', type: 'start', title: 'Start', icon: '▶️' },
        { id: 'step1', type: 'process', title: 'Step 1', icon: '1️⃣' },
        { id: 'step2', type: 'process', title: 'Step 2', icon: '2️⃣' },
        { id: 'step3', type: 'process', title: 'Step 3', icon: '3️⃣' },
        { id: 'end', type: 'end', title: 'Complete', icon: '✅' }
      ],
      edges: [
        { id: 't1', from: 'start', to: 'step1' },
        { id: 't2', from: 'step1', to: 'step2' },
        { id: 't3', from: 'step2', to: 'step3' },
        { id: 't4', from: 'step3', to: 'end' }
      ]
    };

    const steps = ['start', 'step1', 'step2', 'step3', 'end'];
    let currentStep = -1;

    startBtn.onclick = () => {
      currentStep = 0;
      graph.setExecutionStep(steps[currentStep]);
      startBtn.disabled = true;
      nextBtn.disabled = false;
    };

    nextBtn.onclick = () => {
      if (currentStep < steps.length - 1) {
        graph.markTransitionVisited(steps[currentStep], steps[currentStep + 1]);
        currentStep++;
        graph.setExecutionStep(steps[currentStep]);

        if (currentStep === steps.length - 1) {
          nextBtn.disabled = true;
        }
      }
    };

    resetBtn.onclick = () => {
      currentStep = -1;
      graph.resetExecution();
      startBtn.disabled = false;
      nextBtn.disabled = true;
    };

    return wrapper;
  },
};

export const ConditionalTransitions: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '700px';
    container.style.background = '#f5f5f5';

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      showNodeLabels: true
    });

    graph.graph = {
      name: 'Message Processing with Conditions',
      nodes: [
        { id: 'start', type: 'start', title: 'Receive Message' },
        { id: 'check', type: 'decision', title: 'Check Type', outputs: [{ label: 'success' }, { label: 'error' }] },
        { id: 'success', type: 'process', title: 'Process Success' },
        { id: 'error', type: 'process', title: 'Handle Error' },
        { id: 'wait', type: 'process', title: 'Wait & Retry' },
        { id: 'end', type: 'end', title: 'Done' }
      ],
      edges: [
        { from: 'start', to: 'check' },
        {
          from: 'check:0',
          to: 'success',
          label: 'Success',
          condition: {
            type: 'message',
            value: '^success',
            flags: 'i'
          }
        },
        {
          from: 'check:1',
          to: 'error',
          label: 'Error',
          condition: {
            type: 'message',
            value: '^error',
            flags: 'i'
          }
        },
        { from: 'success', to: 'end' },
        {
          from: 'error',
          to: 'wait',
          condition: {
            type: 'delay',
            value: 1000
          }
        },
        { from: 'wait', to: 'check', label: 'Retry' }
      ]
    };

    return container;
  },
};
