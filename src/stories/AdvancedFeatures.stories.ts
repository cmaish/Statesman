/**
 * Storybook stories for advanced features: manual positioning, edge routing, etc.
 */

import { Meta, StoryObj } from '@storybook/html';
import { StateGraph, GraphData } from '../diagram/StateGraph';

const meta: Meta = {
  title: 'Features/Advanced',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const ManualPositioning: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '700px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const info = document.createElement('div');
    info.style.padding = '20px';
    info.style.background = '#EFF6FF';
    info.style.borderBottom = '1px solid #DBEAFE';
    info.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #1E40AF;">Manual Node Positioning</h3>
      <p style="margin: 0; color: #3B82F6; font-size: 14px;">
        Set explicit x,y coordinates for precise control. Nodes without positions use automatic layout.
      </p>
    `;

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#F9FAFB';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      showGrid: true,  // Grid helps visualize positioning
      respectManualPositions: true
    });

    graph.graph = {
      name: 'Manual Positioning Demo',
      nodes: [
        {
          id: 'start',
          type: 'start',
          title: 'Start',
          icon: '▶️',
          position: { x: 150, y: 250 }  // Manual position
        },
        {
          id: 'step1',
          type: 'process',
          title: 'Step 1',
          icon: '1️⃣',
          position: { x: 350, y: 150 }  // Top position
        },
        {
          id: 'step2',
          type: 'process',
          title: 'Step 2',
          icon: '2️⃣',
          position: { x: 350, y: 350 }  // Bottom position
        },
        {
          id: 'merge',
          type: 'process',
          title: 'Merge',
          icon: '🔀',
          position: { x: 550, y: 250 }  // Center position
        },
        {
          id: 'end',
          type: 'end',
          title: 'Complete',
          icon: '✅',
          position: { x: 750, y: 250 }  // End position
        }
      ],
      edges: [
        { from: 'start', to: 'step1' },
        { from: 'start', to: 'step2' },
        { from: 'step1', to: 'merge' },
        { from: 'step2', to: 'merge' },
        { from: 'merge', to: 'end' }
      ]
    };

    return wrapper;
  },
};

export const OrthogonalEdges: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '700px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const info = document.createElement('div');
    info.style.padding = '20px';
    info.style.background = '#FEF3C7';
    info.style.borderBottom = '1px solid = '#FDE68A';
    info.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #92400E;">Right-Angle (Orthogonal) Edge Routing</h3>
      <p style="margin: 0; color: '#B45309'; font-size: 14px;">
        Perfect for flowcharts and structured diagrams. Uses only horizontal and vertical segments.
      </p>
    `;

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#FFFBEB';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      showGrid: true,
      defaultEdgeStyle: 'orthogonal',  // All edges right-angle
      respectManualPositions: true
    });

    graph.graph = {
      name: 'Orthogonal Routing Demo',
      nodes: [
        { id: 'a', type: 'start', title: 'A', position: { x: 100, y: 200 } },
        { id: 'b', type: 'process', title: 'B', position: { x: 300, y: 200 } },
        { id: 'c', type: 'decision', title: 'C?', outputs: [{ label: 'Y' }, { label: 'N' }], position: { x: 500, y: 200 } },
        { id: 'd', type: 'process', title: 'D', position: { x: 700, y: 100 } },
        { id: 'e', type: 'process', title: 'E', position: { x: 700, y: 300 } },
        { id: 'f', type: 'end', title: 'F', position: { x: 900, y: 200 } }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c:0', to: 'd', label: 'Yes' },
        { from: 'c:1', to: 'e', label: 'No' },
        { from: 'd', to: 'f' },
        { from: 'e', to: 'f' }
      ]
    };

    return wrapper;
  },
};

export const EdgeStyleComparison: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '900px';
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = '1fr 1fr';
    wrapper.style.gap = '20px';
    wrapper.style.padding = '20px';
    wrapper.style.background = '#F3F4F6';

    const styles = [
      { name: 'Curved (Bezier)', style: 'curved', bg: '#EEF2FF', color: '#4338CA' },
      { name: 'Straight', style: 'straight', bg: '#FEF3C7', color: '#92400E' },
      { name: 'Orthogonal (Right-Angle)', style: 'orthogonal', bg: '#ECFDF5', color: '#065F46' },
      { name: 'Stepped (Rounded)', style: 'stepped', bg: '#FCE7F3', color: '#831843' }
    ];

    const sampleData: GraphData = {
      nodes: [
        { id: 'a', type: 'start', title: 'A', position: { x: 100, y: 150 } },
        { id: 'b', type: 'process', title: 'B', position: { x: 250, y: 100 } },
        { id: 'c', type: 'process', title: 'C', position: { x: 250, y: 200 } },
        { id: 'd', type: 'end', title: 'D', position: { x: 400, y: 150 } }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
        { from: 'b', to: 'd' },
        { from: 'c', to: 'd' }
      ]
    };

    styles.forEach(({ name, style, bg, color }) => {
      const box = document.createElement('div');
      box.style.background = '#FFFFFF';
      box.style.borderRadius = '12px';
      box.style.overflow = 'hidden';
      box.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';

      const header = document.createElement('div');
      header.style.padding = '15px';
      header.style.background = bg;
      header.style.fontWeight = '600';
      header.style.color = color;
      header.textContent = name;

      const diagramContainer = document.createElement('div');
      diagramContainer.style.height = '200px';
      diagramContainer.style.background = '#F9FAFB';

      box.appendChild(header);
      box.appendChild(diagramContainer);
      wrapper.appendChild(box);

      const graph = new StateGraph();
      graph.initialize(diagramContainer, {
        theme: 'default',
        defaultEdgeStyle: style as any,
        respectManualPositions: true
      });
      graph.graph = sampleData;
    });

    return wrapper;
  },
};

export const MixedEdgeStyles: Story = {
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
    info.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #15803D;">Mixed Edge Styles</h3>
      <p style="margin: 0; color: #16A34A; font-size: 14px;">
        Each edge can have its own routing style for maximum flexibility.
      </p>
    `;

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#F9FAFB';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      showGrid: true,
      respectManualPositions: true
    });

    graph.graph = {
      nodes: [
        { id: 'start', type: 'start', title: 'Start', position: { x: 100, y: 250 } },
        { id: 'a', type: 'process', title: 'Process A', position: { x: 300, y: 150 } },
        { id: 'b', type: 'process', title: 'Process B', position: { x: 300, y: 250 } },
        { id: 'c', type: 'process', title: 'Process C', position: { x: 300, y: 350 } },
        { id: 'end', type: 'end', title: 'End', position: { x: 500, y: 250 } }
      ],
      edges: [
        {
          from: 'start',
          to: 'a',
          label: 'Curved',
          style: { pathStyle: 'curved', stroke: '#4F46E5' }
        },
        {
          from: 'start',
          to: 'b',
          label: 'Straight',
          style: { pathStyle: 'straight', stroke: '#F59E0B' }
        },
        {
          from: 'start',
          to: 'c',
          label: 'Orthogonal',
          style: { pathStyle: 'orthogonal', stroke: '#10B981' }
        },
        {
          from: 'a',
          to: 'end',
          style: { pathStyle: 'curved' }
        },
        {
          from: 'b',
          to: 'end',
          style: { pathStyle: 'straight' }
        },
        {
          from: 'c',
          to: 'end',
          label: 'Stepped',
          style: { pathStyle: 'stepped', stroke: '#EC4899' }
        }
      ]
    };

    return wrapper;
  },
};

export const ComplexLayout: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '800px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const info = document.createElement('div');
    info.style.padding = '20px';
    info.style.background = '#F5F3FF';
    info.style.borderBottom = '1px solid #E9D5FF';
    info.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: '#6B21A8;">Complex Workflow with Manual Positioning & Orthogonal Routing</h3>
      <p style="margin: 0; color: #7C3AED; font-size: 14px;">
        Combining all features for a professional flowchart
      </p>
    `;

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = 'white';

    wrapper.appendChild(info);
    wrapper.appendChild(container);

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      showGrid: true,
      defaultEdgeStyle: 'orthogonal',
      respectManualPositions: true
    });

    graph.graph = {
      name: 'Order Fulfillment Process',
      nodes: [
        { id: 'receive', type: 'start', title: 'Receive Order', icon: '📥', position: { x: 100, y: 300 } },
        { id: 'validate', type: 'decision', title: 'Validate', icon: '✓', outputs: [{ label: 'Valid' }, { label: 'Invalid' }], position: { x: 280, y: 300 } },
        { id: 'stock', type: 'decision', title: 'Check Stock', outputs: [{ label: 'Available' }, { label: 'Out' }], position: { x: 450, y: 200 } },
        { id: 'payment', type: 'process', title: 'Process Payment', icon: '💳', position: { x: 620, y: 200 } },
        { id: 'ship', type: 'process', title: 'Ship Order', icon: '🚚', position: { x: 790, y: 200 } },
        { id: 'backorder', type: 'process', title: 'Backorder', icon: '⏰', position: { x: 620, y: 350 } },
        { id: 'reject', type: 'end', title: 'Reject', icon: '❌', position: { x: 450, y: 450 } },
        { id: 'complete', type: 'end', title: 'Complete', icon: '✅', position: { x: 960, y: 200 } }
      ],
      edges: [
        { from: 'receive', to: 'validate' },
        { from: 'validate:0', to: 'stock', label: 'Valid' },
        { from: 'validate:1', to: 'reject', label: 'Invalid' },
        { from: 'stock:0', to: 'payment', label: 'In Stock' },
        { from: 'stock:1', to: 'backorder', label: 'Out of Stock' },
        { from: 'payment', to: 'ship' },
        { from: 'ship', to: 'complete' },
        { from: 'backorder', to: 'stock', label: 'Retry', style: { stroke: '#F59E0B' } }
      ]
    };

    return wrapper;
  },
};

export const InteractivePositioning: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '800px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';

    const controls = document.createElement('div');
    controls.style.padding = '20px';
    controls.style.background = '#fff';
    controls.style.borderBottom = '1px solid #ddd';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle Auto Layout';
    toggleBtn.style.padding = '10px 20px';
    toggleBtn.style.marginRight = '10px';
    toggleBtn.style.cursor = 'pointer';

    const edgeStyleSelect = document.createElement('select');
    edgeStyleSelect.style.padding = '10px';
    edgeStyleSelect.style.marginRight = '10px';
    edgeStyleSelect.innerHTML = `
      <option value="curved">Curved Edges</option>
      <option value="straight">Straight Edges</option>
      <option value="orthogonal" selected>Orthogonal Edges</option>
      <option value="stepped">Stepped Edges</option>
    `;

    const info = document.createElement('span');
    info.style.color = '#666';
    info.style.fontSize = '14px';
    info.textContent = 'Current: Manual positioning with orthogonal edges';

    controls.appendChild(toggleBtn);
    controls.appendChild(edgeStyleSelect);
    controls.appendChild(info);

    const container = document.createElement('div');
    container.style.flex = '1';
    container.style.background = '#F9FAFB';

    wrapper.appendChild(controls);
    wrapper.appendChild(container);

    const graphData: GraphData = {
      nodes: [
        { id: 'a', type: 'start', title: 'Start', position: { x: 150, y: 250 } },
        { id: 'b', type: 'process', title: 'Process', position: { x: 350, y: 250 } },
        { id: 'c', type: 'end', title: 'End', position: { x: 550, y: 250 } }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ]
    };

    let manualMode = true;

    const graph = new StateGraph();
    graph.initialize(container, {
      theme: 'default',
      showGrid: true,
      respectManualPositions: true,
      defaultEdgeStyle: 'orthogonal'
    });

    graph.graph = graphData;

    toggleBtn.onclick = () => {
      manualMode = !manualMode;

      if (manualMode) {
        // Restore manual positions
        graphData.nodes.forEach((node, i) => {
          node.position = { x: 150 + i * 200, y: 250 };
        });
        info.textContent = 'Current: Manual positioning';
      } else {
        // Remove positions for auto-layout
        graphData.nodes.forEach(node => {
          delete node.position;
        });
        info.textContent = 'Current: Auto layout';
      }

      graph.graph = graphData;
    };

    edgeStyleSelect.onchange = (e) => {
      const style = (e.target as HTMLSelectElement).value as any;
      graph.initialize(container, {
        theme: 'default',
        showGrid: true,
        respectManualPositions: true,
        defaultEdgeStyle: style
      });
      graph.graph = graphData;
      info.textContent = `Current: ${manualMode ? 'Manual' : 'Auto'} positioning with ${style} edges`;
    };

    return wrapper;
  },
};
