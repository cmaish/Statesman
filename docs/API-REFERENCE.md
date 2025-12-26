# API Reference

Complete API documentation for the Statesman Diagram Library.

## Table of Contents

- [Core APIs](#core-apis)
  - [StateGraph (Direct Binding API)](#stategraph-direct-binding-api)
  - [StateMachineDiagram (Builder API)](#statemachinediagram-builder-api)
- [Data Structures](#data-structures)
- [Configuration Options](#configuration-options)
- [Visual Customization](#visual-customization)
- [Examples](#examples)

---

## Core APIs

### StateGraph (Direct Binding API)

The `StateGraph` class provides a simple, direct data binding API for creating state machine diagrams.

#### Initialization

```typescript
import { StateGraph } from 'statesman-diagram';

const graph = new StateGraph();
graph.initialize(containerElement, options);
```

#### Methods

##### `initialize(element: HTMLElement, options?: StateGraphOptions): void`

Initialize the graph with a container element and configuration options.

**Parameters:**
- `element`: The HTML container element
- `options`: Configuration options (see [StateGraphOptions](#stategraphoptions))

**Example:**
```typescript
graph.initialize(document.getElementById('diagram'), {
  theme: 'default',
  enableAnimations: true,
  respectManualPositions: true,
  defaultEdgeStyle: 'orthogonal',
  onNodeClick: (node) => console.log('Clicked:', node.title)
});
```

##### `graph: GraphData` (getter/setter)

Set or get the graph data directly.

**Example:**
```typescript
graph.graph = {
  nodes: [
    {
      id: 'start',
      type: 'start',
      title: 'Begin',
      position: { x: 100, y: 200 }  // Manual positioning
    },
    {
      id: 'process',
      type: 'process',
      title: 'Process Data',
      description: 'Process incoming data',
      properties: {
        timeout: 5000,
        retries: 3
      }
    }
  ],
  edges: [
    {
      from: 'start',
      to: 'process',
      label: 'Start',
      style: {
        pathStyle: 'orthogonal'  // Right-angle arrows
      }
    }
  ]
};
```

##### `setExecutionStep(stepId: string, data?: unknown): void`

Set the current execution step and optional metadata.

**Example:**
```typescript
graph.setExecutionStep('process', { timestamp: Date.now() });
```

##### `markTransitionVisited(fromNode: string, toNode: string): void`

Mark a transition as visited during execution.

**Example:**
```typescript
graph.markTransitionVisited('start', 'process');
```

##### `resetExecution(): void`

Reset the execution state.

##### `setTheme(theme: string): void`

Change the active theme.

**Example:**
```typescript
graph.setTheme('dark');
```

##### `updateNodes(nodes: GraphNodeData[]): void`

Update specific nodes without rebuilding the entire graph.

**Example:**
```typescript
graph.updateNodes([
  { id: 'process', title: 'Updated Title', icon: '🔄' }
]);
```

##### `removeNodes(nodeIds: string[]): void`

Remove nodes and their connected edges.

**Example:**
```typescript
graph.removeNodes(['process1', 'process2']);
```

##### `zoom(scale: number): void`

Set the zoom level.

**Example:**
```typescript
graph.zoom(1.5);  // 150% zoom
```

##### `pan(x: number, y: number): void`

Pan the diagram to a specific offset.

**Example:**
```typescript
graph.pan(100, 50);
```

##### `exportSVG(): string`

Export the diagram as an SVG string.

**Example:**
```typescript
const svgString = graph.exportSVG();
```

##### `destroy(): void`

Clean up and destroy the graph.

---

## Data Structures

### GraphNodeData

```typescript
interface GraphNodeData {
  id: string;                          // Unique node identifier
  type: 'start' | 'end' | 'process' | 'decision' | 'custom';
  title: string;                       // Display title
  description?: string;                // Optional description (markdown subset)
  icon?: string;                       // Optional icon (emoji or text)
  properties?: Record<string, unknown>; // Custom properties
  inputs?: Array<{                     // Input connection points
    id?: string;
    label?: string;
  }>;
  outputs?: Array<{                    // Output connection points
    id?: string;
    label?: string;
  }>;
  position?: {                         // Manual positioning
    x: number;
    y: number;
  };
  style?: {                            // Custom styling
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
  };
}
```

**Example:**
```typescript
const node: GraphNodeData = {
  id: 'decision1',
  type: 'decision',
  title: 'Check Value',
  icon: '❓',
  description: 'Validate input value',
  position: { x: 300, y: 200 },        // Manual position
  properties: {
    condition: 'value > 100',
    timeout: 5000
  },
  outputs: [
    { label: 'Yes' },
    { label: 'No' }
  ],
  style: {
    fill: '#FBBF24',
    strokeWidth: 3
  }
};
```

### GraphEdgeData

```typescript
interface GraphEdgeData {
  id?: string;                          // Optional unique identifier
  from: string;                         // Source node (format: "nodeId" or "nodeId:outputIndex")
  to: string;                           // Target node (format: "nodeId" or "nodeId:inputIndex")
  label?: string;                       // Optional label
  condition?: {                         // Optional transition condition
    type: 'message' | 'delay' | 'none';
    value?: string | number;            // Regex pattern or delay in ms
    flags?: string;                     // Regex flags
  };
  style?: {                             // Custom styling
    stroke?: string;
    strokeWidth?: number;
    pathStyle?: 'curved' | 'straight' | 'orthogonal' | 'stepped';
    className?: string;
  };
}
```

**Path Styles:**
- `curved` - Smooth bezier curves (default)
- `straight` - Direct straight lines
- `orthogonal` - Right-angle routing (Manhattan routing)
- `stepped` - Right-angle with rounded corners

**Example:**
```typescript
const edge: GraphEdgeData = {
  id: 'trans1',
  from: 'decision1:0',                  // First output of decision1
  to: 'process:0',                      // First input of process
  label: 'Valid',
  condition: {
    type: 'message',
    value: '^success',                  // Regex pattern
    flags: 'i'                          // Case insensitive
  },
  style: {
    pathStyle: 'orthogonal',            // Right-angle arrows!
    stroke: '#10B981',
    strokeWidth: 3
  }
};
```

### GraphData

```typescript
interface GraphData {
  id?: string;              // Optional unique identifier
  name?: string;            // Optional display name
  description?: string;     // Optional description
  nodes: GraphNodeData[];   // Array of nodes
  edges: GraphEdgeData[];   // Array of edges
}
```

---

## Configuration Options

### StateGraphOptions

```typescript
interface StateGraphOptions extends DiagramOptions {
  // Layout options
  autoLayout?: boolean;                 // Enable automatic layout (default: true)
  respectManualPositions?: boolean;     // Don't override manual positions (default: true)
  layoutDirection?: 'horizontal' | 'vertical';  // Layout direction
  layoutAlignment?: 'start' | 'center' | 'end'; // Alignment

  // Visual options
  theme?: string | Theme;               // Theme name or custom theme
  showGrid?: boolean;                   // Show background grid
  showNodeLabels?: boolean;             // Show labels on connection points
  enableAnimations?: boolean;           // Enable animations
  defaultEdgeStyle?: 'curved' | 'straight' | 'orthogonal' | 'stepped';

  // Event callbacks
  onNodeClick?: (node: GraphNodeData) => void;
  onEdgeClick?: (edge: GraphEdgeData) => void;
  onCanvasClick?: () => void;
}
```

**Example with all options:**
```typescript
const options: StateGraphOptions = {
  // Layout
  autoLayout: true,
  respectManualPositions: true,
  layoutDirection: 'horizontal',
  layoutAlignment: 'center',

  // Visual
  theme: 'dark',
  showGrid: true,
  showNodeLabels: true,
  enableAnimations: true,
  defaultEdgeStyle: 'orthogonal',

  // Events
  onNodeClick: (node) => {
    console.log('Node clicked:', node.title);
    showPropertiesPanel(node.properties);
  },
  onEdgeClick: (edge) => {
    console.log('Edge clicked:', edge.label);
  },
  onCanvasClick: () => {
    hidePropertiesPanel();
  }
};

graph.initialize(container, options);
```

---

## Visual Customization

### Manual Positioning

Set explicit positions for nodes to override automatic layout:

```typescript
graph.graph = {
  nodes: [
    {
      id: 'node1',
      type: 'process',
      title: 'Fixed Position',
      position: { x: 100, y: 150 }  // Manual position
    },
    {
      id: 'node2',
      type: 'process',
      title: 'Auto Layout'  // No position = auto-layout
    }
  ],
  edges: []
};
```

When `respectManualPositions: true` (default), nodes with explicit positions won't be moved by the automatic layout algorithm.

### Edge Routing Styles

Choose from four edge routing styles:

```typescript
// Curved (default) - Smooth bezier curves
{ style: { pathStyle: 'curved' } }

// Straight - Direct lines
{ style: { pathStyle: 'straight' } }

// Orthogonal - Right-angle routing (great for flowcharts!)
{ style: { pathStyle: 'orthogonal' } }

// Stepped - Right-angle with rounded corners
{ style: { pathStyle: 'stepped' } }
```

**Set default for all edges:**
```typescript
graph.initialize(container, {
  defaultEdgeStyle: 'orthogonal'  // All edges use right-angles
});
```

**Override per edge:**
```typescript
{
  from: 'a',
  to: 'b',
  style: { pathStyle: 'straight' }  // This edge is straight
}
```

### Per-Node Styling

```typescript
{
  id: 'special',
  type: 'process',
  title: 'Special Node',
  style: {
    fill: '#FF6B6B',
    stroke: '#FF5252',
    strokeWidth: 4,
    className: 'highlight'  // Add custom CSS class
  }
}
```

### Per-Edge Styling

```typescript
{
  from: 'a',
  to: 'b',
  label: 'Critical Path',
  style: {
    stroke: '#EF4444',
    strokeWidth: 4,
    pathStyle: 'straight',
    className: 'critical'
  }
}
```

---

## Examples

### Example 1: Simple Linear Flow

```typescript
const graph = new StateGraph();
graph.initialize(document.getElementById('diagram'), {
  theme: 'default',
  enableAnimations: true
});

graph.graph = {
  name: 'Simple Flow',
  nodes: [
    { id: 'start', type: 'start', title: 'Start' },
    { id: 'process', type: 'process', title: 'Process' },
    { id: 'end', type: 'end', title: 'End' }
  ],
  edges: [
    { from: 'start', to: 'process' },
    { from: 'process', to: 'end' }
  ]
};
```

### Example 2: Decision Flow with Manual Positioning

```typescript
graph.graph = {
  name: 'Decision Flow',
  nodes: [
    {
      id: 'start',
      type: 'start',
      title: 'Receive Request',
      position: { x: 100, y: 300 }
    },
    {
      id: 'validate',
      type: 'decision',
      title: 'Validate',
      position: { x: 300, y: 300 },
      outputs: [{ label: 'Valid' }, { label: 'Invalid' }]
    },
    {
      id: 'process',
      type: 'process',
      title: 'Process',
      position: { x: 500, y: 200 }
    },
    {
      id: 'error',
      type: 'end',
      title: 'Error',
      position: { x: 500, y: 400 }
    }
  ],
  edges: [
    { from: 'start', to: 'validate' },
    {
      from: 'validate:0',
      to: 'process',
      label: 'Valid',
      style: { pathStyle: 'orthogonal' }
    },
    {
      from: 'validate:1',
      to: 'error',
      label: 'Invalid',
      style: { pathStyle: 'orthogonal', stroke: '#EF4444' }
    }
  ]
};
```

### Example 3: Right-Angle Workflow with Grid

```typescript
graph.initialize(container, {
  theme: 'default',
  showGrid: true,                    // Enable grid
  defaultEdgeStyle: 'orthogonal',    // All edges right-angle
  respectManualPositions: true
});

graph.graph = {
  nodes: [
    { id: 'a', type: 'start', title: 'A', position: { x: 100, y: 200 } },
    { id: 'b', type: 'process', title: 'B', position: { x: 300, y: 200 } },
    { id: 'c', type: 'process', title: 'C', position: { x: 300, y: 350 } },
    { id: 'd', type: 'end', title: 'D', position: { x: 500, y: 350 } }
  ],
  edges: [
    { from: 'a', to: 'b' },  // Horizontal
    { from: 'b', to: 'c' },  // Vertical
    { from: 'c', to: 'd' }   // Horizontal
  ]
};
```

### Example 4: Execution Tracking

```typescript
// Initial graph
graph.graph = workflowData;

// Simulate execution
const steps = ['start', 'validate', 'process', 'end'];
let currentIndex = 0;

function nextStep() {
  if (currentIndex > 0) {
    graph.markTransitionVisited(steps[currentIndex - 1], steps[currentIndex]);
  }
  graph.setExecutionStep(steps[currentIndex], {
    timestamp: Date.now(),
    data: { step: currentIndex + 1 }
  });
  currentIndex++;
}

// Call nextStep() to advance execution
```

### Example 5: Dynamic Updates

```typescript
// Initial graph
graph.graph = initialData;

// Add a new node
const currentGraph = graph.graph!;
currentGraph.nodes.push({
  id: 'newStep',
  type: 'process',
  title: 'New Step'
});
currentGraph.edges.push({
  from: 'process',
  to: 'newStep'
});
graph.graph = currentGraph;

// Or use updateNodes for efficiency
graph.updateNodes([
  { id: 'process', title: 'Updated Process', icon: '🔄' }
]);
```

### Example 6: Conditional Transitions

```typescript
graph.graph = {
  nodes: [
    { id: 'start', type: 'start', title: 'Start' },
    {
      id: 'check',
      type: 'decision',
      title: 'Check Message',
      outputs: [{ label: 'success' }, { label: 'error' }]
    },
    { id: 'success', type: 'end', title: 'Success' },
    { id: 'retry', type: 'process', title: 'Retry' }
  ],
  edges: [
    { from: 'start', to: 'check' },
    {
      from: 'check:0',
      to: 'success',
      condition: {
        type: 'message',
        value: '^success',  // Match messages starting with "success"
        flags: 'i'          // Case insensitive
      }
    },
    {
      from: 'check:1',
      to: 'retry',
      condition: {
        type: 'delay',
        value: 2000  // 2 second delay
      }
    },
    { from: 'retry', to: 'check', label: 'Retry' }
  ]
};
```

### Example 7: Custom Styling

```typescript
graph.graph = {
  nodes: [
    {
      id: 'critical',
      type: 'process',
      title: 'Critical Step',
      style: {
        fill: '#EF4444',
        stroke: '#DC2626',
        strokeWidth: 4
      }
    },
    {
      id: 'normal',
      type: 'process',
      title: 'Normal Step'
    }
  ],
  edges: [
    {
      from: 'critical',
      to: 'normal',
      label: 'Critical Path',
      style: {
        stroke: '#EF4444',
        strokeWidth: 3,
        pathStyle: 'straight'
      }
    }
  ]
};
```

---

## See Also

- [Visual Customization Guide](./VISUAL-CUSTOMIZATION.md)
- [Builder API Reference](./BUILDER-API.md)
- [Theme System](./THEMES.md)
- [Examples Repository](../examples/)
