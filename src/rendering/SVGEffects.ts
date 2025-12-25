/**
 * Enhanced SVG rendering utilities for visual effects
 */

import { StepStyle } from '../rendering/Theme';

export class SVGEffects {
  /**
   * Create gradient definition for a step
   */
  static createGradient(
    id: string,
    gradient: { start: string; end: string; direction: 'vertical' | 'horizontal' | 'radial' },
    defs: SVGDefsElement
  ): string {
    const gradientId = `gradient-${id}`;

    if (gradient.direction === 'radial') {
      const radialGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      radialGradient.setAttribute('id', gradientId);

      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', gradient.start);

      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', gradient.end);

      radialGradient.appendChild(stop1);
      radialGradient.appendChild(stop2);
      defs.appendChild(radialGradient);
    } else {
      const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      linearGradient.setAttribute('id', gradientId);

      if (gradient.direction === 'vertical') {
        linearGradient.setAttribute('x1', '0%');
        linearGradient.setAttribute('y1', '0%');
        linearGradient.setAttribute('x2', '0%');
        linearGradient.setAttribute('y2', '100%');
      } else {
        linearGradient.setAttribute('x1', '0%');
        linearGradient.setAttribute('y1', '0%');
        linearGradient.setAttribute('x2', '100%');
        linearGradient.setAttribute('y2', '0%');
      }

      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', gradient.start);

      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', gradient.end);

      linearGradient.appendChild(stop1);
      linearGradient.appendChild(stop2);
      defs.appendChild(linearGradient);
    }

    return `url(#${gradientId})`;
  }

  /**
   * Create shadow filter
   */
  static createShadow(
    id: string,
    shadow: { blur: number; offsetX: number; offsetY: number; color: string; opacity: number },
    defs: SVGDefsElement
  ): string {
    const filterId = `shadow-${id}`;

    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceAlpha');
    feGaussianBlur.setAttribute('stdDeviation', String(shadow.blur));
    feGaussianBlur.setAttribute('result', 'blur');
    filter.appendChild(feGaussianBlur);

    const feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('dx', String(shadow.offsetX));
    feOffset.setAttribute('dy', String(shadow.offsetY));
    feOffset.setAttribute('result', 'offsetBlur');
    filter.appendChild(feOffset);

    const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    feFlood.setAttribute('flood-color', shadow.color);
    feFlood.setAttribute('flood-opacity', String(shadow.opacity));
    feFlood.setAttribute('result', 'color');
    filter.appendChild(feFlood);

    const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    feComposite.setAttribute('in', 'color');
    feComposite.setAttribute('in2', 'offsetBlur');
    feComposite.setAttribute('operator', 'in');
    feComposite.setAttribute('result', 'shadow');
    filter.appendChild(feComposite);

    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'shadow');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);

    defs.appendChild(filter);
    return `url(#${filterId})`;
  }

  /**
   * Create glow filter
   */
  static createGlow(
    id: string,
    glow: { color: string; blur: number },
    defs: SVGDefsElement
  ): string {
    const filterId = `glow-${id}`;

    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('stdDeviation', String(glow.blur));
    feGaussianBlur.setAttribute('result', 'blur');
    filter.appendChild(feGaussianBlur);

    const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    feFlood.setAttribute('flood-color', glow.color);
    feFlood.setAttribute('flood-opacity', '0.7');
    feFlood.setAttribute('result', 'color');
    filter.appendChild(feFlood);

    const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    feComposite.setAttribute('in', 'color');
    feComposite.setAttribute('in2', 'blur');
    feComposite.setAttribute('operator', 'in');
    feComposite.setAttribute('result', 'glow');
    filter.appendChild(feComposite);

    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'glow');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'glow');
    const feMergeNode3 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode3.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    feMerge.appendChild(feMergeNode3);
    filter.appendChild(feMerge);

    defs.appendChild(filter);
    return `url(#${filterId})`;
  }

  /**
   * Create grid pattern
   */
  static createGrid(
    gridSize: number,
    color: string,
    opacity: number,
    defs: SVGDefsElement
  ): string {
    const patternId = 'grid-pattern';

    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', patternId);
    pattern.setAttribute('width', String(gridSize));
    pattern.setAttribute('height', String(gridSize));
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${gridSize} 0 L 0 0 0 ${gridSize}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1');
    path.setAttribute('opacity', String(opacity));

    pattern.appendChild(path);
    defs.appendChild(pattern);

    return `url(#${patternId})`;
  }

  /**
   * Apply effects to an SVG element
   */
  static applyEffects(
    element: SVGElement,
    style: StepStyle,
    stepId: string,
    defs: SVGDefsElement,
    theme: { effects?: { enableShadows: boolean; enableGradients: boolean; enableGlow: boolean } }
  ): void {
    const filters: string[] = [];

    // Apply gradient
    if (theme.effects?.enableGradients && style.fillGradient) {
      const gradientUrl = this.createGradient(stepId, style.fillGradient, defs);
      element.setAttribute('fill', gradientUrl);
    } else {
      element.setAttribute('fill', style.fill);
    }

    // Apply shadow
    if (theme.effects?.enableShadows && style.shadow?.enabled) {
      const shadowUrl = this.createShadow(stepId, style.shadow, defs);
      filters.push(shadowUrl);
    }

    // Apply glow
    if (theme.effects?.enableGlow && style.glow?.enabled) {
      const glowUrl = this.createGlow(stepId, style.glow, defs);
      filters.push(glowUrl);
    }

    // Combine filters
    if (filters.length > 0) {
      element.setAttribute('filter', filters.join(' '));
    }

    // Apply opacity
    if (style.opacity !== undefined) {
      element.setAttribute('opacity', String(style.opacity));
    }

    // Apply custom class
    if (style.className) {
      element.setAttribute('class', style.className);
    }
  }
}
