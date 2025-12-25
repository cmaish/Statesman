/**
 * SVG rendering engine for state machine diagrams
 */

import { StateMachine } from '../models/StateMachine';
import { Step } from '../models/Step';
import { Transition } from '../models/Transition';
import { Node } from '../models/Node';
import { Point } from '../models/types';
import { Theme, StepStyle } from './Theme';
import { ExecutionState } from '../models/ExecutionState';
import { SVGEffects } from './SVGEffects';

export interface RenderOptions {
  showGrid?: boolean;
  enableAnimations?: boolean;
  showNodeLabels?: boolean;
  executionState?: ExecutionState;
}

/**
 * SVG-based renderer for state machine diagrams
 */
export class SVGRenderer {
  private svg: SVGSVGElement;
  private defsElement: SVGDefsElement;
  private mainGroup: SVGGElement;
  private transitionsGroup: SVGGElement;
  private stepsGroup: SVGGElement;
  private nodesGroup: SVGGElement;

  constructor(
    private readonly container: HTMLElement,
    private readonly theme: Theme,
    private readonly options: RenderOptions = {}
  ) {
    this.svg = this.createSVGElement('svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.style.userSelect = 'none';

    this.defsElement = this.createSVGElement('defs');
    this.svg.appendChild(this.defsElement);

    this.mainGroup = this.createSVGElement('g');
    this.svg.appendChild(this.mainGroup);

    // Create layers (order matters for z-index)
    this.transitionsGroup = this.createSVGElement('g');
    this.transitionsGroup.setAttribute('class', 'transitions-layer');
    this.mainGroup.appendChild(this.transitionsGroup);

    this.stepsGroup = this.createSVGElement('g');
    this.stepsGroup.setAttribute('class', 'steps-layer');
    this.mainGroup.appendChild(this.stepsGroup);

    this.nodesGroup = this.createSVGElement('g');
    this.nodesGroup.setAttribute('class', 'nodes-layer');
    this.mainGroup.appendChild(this.nodesGroup);

    this.container.appendChild(this.svg);
    this.initializeDefs();
  }

  private createSVGElement<K extends keyof SVGElementTagNameMap>(
    tagName: K
  ): SVGElementTagNameMap[K] {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
  }

  private initializeDefs(): void {
    // Create arrow marker
    const marker = this.createSVGElement('marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');

    const polygon = this.createSVGElement('polygon');
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.setAttribute('fill', this.theme.transitionStyle.stroke);
    marker.appendChild(polygon);

    this.defsElement.appendChild(marker);

    // Create arrow marker for visited transitions
    const visitedMarker = this.createSVGElement('marker');
    visitedMarker.setAttribute('id', 'arrowhead-visited');
    visitedMarker.setAttribute('markerWidth', '10');
    visitedMarker.setAttribute('markerHeight', '10');
    visitedMarker.setAttribute('refX', '9');
    visitedMarker.setAttribute('refY', '3');
    visitedMarker.setAttribute('orient', 'auto');

    const visitedPolygon = this.createSVGElement('polygon');
    visitedPolygon.setAttribute('points', '0 0, 10 3, 0 6');
    visitedPolygon.setAttribute('fill', this.theme.colors.primary);
    visitedMarker.appendChild(visitedPolygon);

    this.defsElement.appendChild(visitedMarker);

    // Create filter for shadows
    const filter = this.createSVGElement('filter');
    filter.setAttribute('id', 'shadow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const feGaussianBlur = this.createSVGElement('feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceAlpha');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    filter.appendChild(feGaussianBlur);

    const feOffset = this.createSVGElement('feOffset');
    feOffset.setAttribute('dx', '0');
    feOffset.setAttribute('dy', '2');
    feOffset.setAttribute('result', 'offsetblur');
    filter.appendChild(feOffset);

    const feMerge = this.createSVGElement('feMerge');
    const feMergeNode1 = this.createSVGElement('feMergeNode');
    const feMergeNode2 = this.createSVGElement('feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);

    this.defsElement.appendChild(filter);
  }

  render(stateMachine: StateMachine): void {
    // Clear existing content
    this.transitionsGroup.innerHTML = '';
    this.stepsGroup.innerHTML = '';
    this.nodesGroup.innerHTML = '';

    // Render grid if enabled
    if (this.theme.grid?.enabled || this.options.showGrid) {
      this.renderGrid();
    }

    // Render transitions first (so they appear behind steps)
    stateMachine.getTransitions().forEach(transition => {
      this.renderTransition(transition);
    });

    // Render steps
    stateMachine.getSteps().forEach(step => {
      this.renderStep(step);
    });

    // Render nodes
    stateMachine.getSteps().forEach(step => {
      step.getInputNodes().forEach(node => this.renderNode(node));
      step.getOutputNodes().forEach(node => this.renderNode(node));
    });

    // Auto-fit view
    this.fitToContent();
  }

  private renderGrid(): void {
    if (!this.theme.grid) return;

    const gridRect = this.createSVGElement('rect');
    gridRect.setAttribute('x', '-5000');
    gridRect.setAttribute('y', '-5000');
    gridRect.setAttribute('width', '10000');
    gridRect.setAttribute('height', '10000');
    const gridPattern = SVGEffects.createGrid(
      this.theme.grid.size,
      this.theme.grid.color,
      this.theme.grid.opacity,
      this.defsElement
    );
    gridRect.setAttribute('fill', gridPattern);
    gridRect.setAttribute('class', 'grid-background');

    // Insert grid at the beginning
    this.mainGroup.insertBefore(gridRect, this.transitionsGroup);
  }

  private renderStep(step: Step): void {
    const group = this.createSVGElement('g');
    group.setAttribute('class', 'step');
    group.setAttribute('data-step-id', step.id);

    const style = this.theme.stepStyles.get(step.type) || this.theme.defaultStepStyle;
    const pos = step.position;

    // Determine if step is current or visited
    const isCurrent = this.options.executionState?.isCurrentStep(step.id);
    const isVisited = this.options.executionState?.isStepVisited(step.id);

    // Create step rectangle/shape
    const rect = this.createSVGElement('rect');
    rect.setAttribute('x', String(pos.x - style.minWidth / 2));
    rect.setAttribute('y', String(pos.y - style.minHeight / 2));
    rect.setAttribute('width', String(style.minWidth));
    rect.setAttribute('height', String(style.minHeight));
    rect.setAttribute('rx', String(style.cornerRadius));
    rect.setAttribute('ry', String(style.cornerRadius));

    if (isCurrent) {
      rect.setAttribute('fill', this.theme.colors.selected);
      rect.setAttribute('stroke', this.theme.colors.selected);
      rect.setAttribute('stroke-width', '4');
      rect.setAttribute('filter', 'url(#shadow)');
    } else if (isVisited) {
      // Apply effects for visited steps
      SVGEffects.applyEffects(rect, style, step.id, this.defsElement, this.theme);
      rect.setAttribute('stroke', this.theme.colors.primary);
      rect.setAttribute('stroke-width', '3');
      rect.setAttribute('opacity', '0.9');
    } else {
      // Apply enhanced effects (gradients, shadows, glow)
      SVGEffects.applyEffects(rect, style, step.id, this.defsElement, this.theme);
      rect.setAttribute('stroke', style.stroke);
      rect.setAttribute('stroke-width', String(style.strokeWidth));
    }

    rect.style.cursor = 'pointer';
    rect.style.transition = 'all 0.2s ease';

    group.appendChild(rect);

    // Add icon if present
    if (step.icon) {
      const icon = this.createSVGElement('text');
      icon.setAttribute('x', String(pos.x));
      icon.setAttribute('y', String(pos.y - 15));
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('font-size', String(style.iconSize));
      icon.textContent = step.icon;
      group.appendChild(icon);
    }

    // Add title
    const title = this.createSVGElement('text');
    title.setAttribute('x', String(pos.x));
    title.setAttribute('y', String(pos.y + (step.icon ? 5 : 0)));
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('dominant-baseline', 'middle');
    title.setAttribute('font-size', String(style.fontSize));
    title.setAttribute('font-family', style.fontFamily);
    title.setAttribute('font-weight', style.fontWeight);
    title.setAttribute('fill', isCurrent ? '#FFFFFF' : this.theme.colors.text);
    title.textContent = this.truncateText(step.title, 20);
    group.appendChild(title);

    // Add visit count badge if visited multiple times
    if (this.options.executionState) {
      const visitCount = this.options.executionState.getStepVisitCount(step.id);
      if (visitCount > 1) {
        const badge = this.createSVGElement('circle');
        badge.setAttribute('cx', String(pos.x + style.minWidth / 2 - 10));
        badge.setAttribute('cy', String(pos.y - style.minHeight / 2 + 10));
        badge.setAttribute('r', '12');
        badge.setAttribute('fill', this.theme.colors.info);
        badge.setAttribute('stroke', '#FFFFFF');
        badge.setAttribute('stroke-width', '2');
        group.appendChild(badge);

        const badgeText = this.createSVGElement('text');
        badgeText.setAttribute('x', String(pos.x + style.minWidth / 2 - 10));
        badgeText.setAttribute('y', String(pos.y - style.minHeight / 2 + 10));
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('dominant-baseline', 'middle');
        badgeText.setAttribute('font-size', '10');
        badgeText.setAttribute('font-weight', 'bold');
        badgeText.setAttribute('fill', '#FFFFFF');
        badgeText.textContent = String(visitCount);
        group.appendChild(badgeText);
      }
    }

    // Add hover effects
    group.addEventListener('mouseenter', () => {
      rect.setAttribute('filter', 'url(#shadow)');
      rect.setAttribute('stroke-width', String(Number(style.strokeWidth) + 1));
    });

    group.addEventListener('mouseleave', () => {
      if (!isCurrent) {
        rect.removeAttribute('filter');
        rect.setAttribute('stroke-width', String(style.strokeWidth));
      }
    });

    this.stepsGroup.appendChild(group);
  }

  private renderNode(node: Node): void {
    const circle = this.createSVGElement('circle');
    const pos = node.position;
    const style = this.theme.nodeStyle;

    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', String(style.radius));
    circle.setAttribute('fill', style.fill);
    circle.setAttribute('stroke', style.stroke);
    circle.setAttribute('stroke-width', String(style.strokeWidth));
    circle.setAttribute('class', 'node');
    circle.setAttribute('data-node-id', node.id);
    circle.style.cursor = 'pointer';
    circle.style.transition = 'all 0.2s ease';

    // Add label if enabled
    if (this.options.showNodeLabels && node.label) {
      const text = this.createSVGElement('text');
      text.setAttribute('x', String(pos.x));
      text.setAttribute('y', String(pos.y - style.radius - 5));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', this.theme.colors.textSecondary);
      text.textContent = node.label;
      this.nodesGroup.appendChild(text);
    }

    // Hover effects
    circle.addEventListener('mouseenter', () => {
      circle.setAttribute('r', String(style.hoverRadius));
      circle.setAttribute('fill', this.theme.colors.hover);
    });

    circle.addEventListener('mouseleave', () => {
      circle.setAttribute('r', String(style.radius));
      circle.setAttribute('fill', style.fill);
    });

    this.nodesGroup.appendChild(circle);
  }

  private renderTransition(transition: Transition): void {
    const sourceNode = transition.getSourceNode();
    const targetNode = transition.getTargetNode();

    if (!sourceNode || !targetNode) return;

    const start = sourceNode.position;
    const end = targetNode.position;
    const style = this.theme.transitionStyle;

    const isVisited = this.options.executionState?.isTransitionVisited(transition.id);

    const group = this.createSVGElement('g');
    group.setAttribute('class', 'transition');
    group.setAttribute('data-transition-id', transition.id);

    // Calculate control points for cubic bezier curve
    const midX = (start.x + end.x) / 2;
    const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

    const pathElement = this.createSVGElement('path');
    pathElement.setAttribute('d', path);
    pathElement.setAttribute('fill', 'none');
    pathElement.setAttribute('stroke', isVisited ? this.theme.colors.primary : style.stroke);
    pathElement.setAttribute('stroke-width', isVisited ? String(style.strokeWidth + 1) : String(style.strokeWidth));
    pathElement.setAttribute('stroke-dasharray', style.strokeDasharray);
    pathElement.setAttribute('marker-end', isVisited ? 'url(#arrowhead-visited)' : 'url(#arrowhead)');

    if (this.options.enableAnimations && isVisited) {
      pathElement.style.strokeDasharray = '5,5';
      pathElement.style.animation = 'dash 1s linear infinite';
    }

    group.appendChild(pathElement);

    // Add label if there's a condition or label
    const label = transition.toString();
    if (label && transition.hasCondition()) {
      const labelPos = this.getPathMidpoint(start, end);
      const labelBg = this.createSVGElement('rect');
      const labelText = this.createSVGElement('text');

      labelText.setAttribute('x', String(labelPos.x));
      labelText.setAttribute('y', String(labelPos.y));
      labelText.setAttribute('text-anchor', 'middle');
      labelText.setAttribute('dominant-baseline', 'middle');
      labelText.setAttribute('font-size', String(style.labelFontSize));
      labelText.setAttribute('font-family', style.labelFontFamily);
      labelText.setAttribute('fill', this.theme.colors.textSecondary);
      labelText.textContent = this.truncateText(label, 15);

      // Get text dimensions and create background
      const bbox = labelText.getBBox();
      labelBg.setAttribute('x', String(bbox.x - style.labelPadding));
      labelBg.setAttribute('y', String(bbox.y - style.labelPadding));
      labelBg.setAttribute('width', String(bbox.width + style.labelPadding * 2));
      labelBg.setAttribute('height', String(bbox.height + style.labelPadding * 2));
      labelBg.setAttribute('rx', '3');
      labelBg.setAttribute('fill', style.labelBackground);
      labelBg.setAttribute('stroke', this.theme.colors.border);

      group.appendChild(labelBg);
      group.appendChild(labelText);
    }

    this.transitionsGroup.appendChild(group);
  }

  private getPathMidpoint(start: Point, end: Point): Point {
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  private fitToContent(): void {
    try {
      const bbox = this.mainGroup.getBBox();
      const padding = 50;
      this.svg.setAttribute('viewBox',
        `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`
      );
    } catch (e) {
      // If getBBox fails (e.g., no content), set a default viewBox
      this.svg.setAttribute('viewBox', '0 0 800 600');
    }
  }

  setZoom(scale: number): void {
    this.mainGroup.setAttribute('transform', `scale(${scale})`);
  }

  setPan(x: number, y: number): void {
    const currentTransform = this.mainGroup.getAttribute('transform') || '';
    const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
    const scale = scaleMatch ? scaleMatch[1] : '1';
    this.mainGroup.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`);
  }

  destroy(): void {
    this.container.removeChild(this.svg);
  }
}
