/**
 * Utilities for generating SVG paths with different routing styles
 */

import { Point } from '../models/types';

export type PathStyle = 'curved' | 'straight' | 'orthogonal' | 'stepped';

export class PathUtil {
  /**
   * Generate SVG path between two points with specified style
   */
  static generatePath(start: Point, end: Point, style: PathStyle): string {
    switch (style) {
      case 'straight':
        return this.straightPath(start, end);
      case 'curved':
        return this.curvedPath(start, end);
      case 'orthogonal':
        return this.orthogonalPath(start, end);
      case 'stepped':
        return this.steppedPath(start, end);
      default:
        return this.curvedPath(start, end);
    }
  }

  /**
   * Straight line path
   */
  private static straightPath(start: Point, end: Point): string {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  /**
   * Curved path using cubic Bezier
   */
  private static curvedPath(start: Point, end: Point): string {
    const midX = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
  }

  /**
   * Orthogonal (right-angle) path
   * Creates path with only horizontal and vertical segments
   */
  private static orthogonalPath(start: Point, end: Point): string {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    // Simple case: same horizontal or vertical line
    if (Math.abs(dx) < 10) {
      return `M ${start.x} ${start.y} L ${start.x} ${end.y}`;
    }
    if (Math.abs(dy) < 10) {
      return `M ${start.x} ${start.y} L ${end.x} ${start.y}`;
    }

    // Calculate intermediate points for right-angle routing
    const midX = start.x + dx / 2;

    // Horizontal then vertical routing
    if (Math.abs(dx) > Math.abs(dy)) {
      return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
    }

    // Vertical then horizontal routing
    const midY = start.y + dy / 2;
    return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
  }

  /**
   * Stepped path with rounded corners
   */
  private static steppedPath(start: Point, end: Point): string {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const midX = start.x + dx / 2;
    const cornerRadius = Math.min(20, Math.abs(dx) / 4, Math.abs(dy) / 4);

    if (Math.abs(dx) < 10) {
      return `M ${start.x} ${start.y} L ${start.x} ${end.y}`;
    }
    if (Math.abs(dy) < 10) {
      return `M ${start.x} ${start.y} L ${end.x} ${start.y}`;
    }

    // Path with rounded corners
    const dySign = dy > 0 ? 1 : -1;

    return `
      M ${start.x} ${start.y}
      L ${midX - cornerRadius} ${start.y}
      Q ${midX} ${start.y} ${midX} ${start.y + cornerRadius * dySign}
      L ${midX} ${end.y - cornerRadius * dySign}
      Q ${midX} ${end.y} ${midX + cornerRadius} ${end.y}
      L ${end.x} ${end.y}
    `.replace(/\s+/g, ' ').trim();
  }

  /**
   * Calculate the angle of the path at the end point (for arrow rotation)
   */
  static getEndAngle(start: Point, end: Point, style: PathStyle): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    switch (style) {
      case 'orthogonal':
      case 'stepped':
        // For orthogonal paths, arrow should point in the direction of the last segment
        if (Math.abs(dx) > Math.abs(dy)) {
          return dx > 0 ? 0 : 180; // Horizontal
        } else {
          return dy > 0 ? 90 : -90; // Vertical
        }
      case 'straight':
      case 'curved':
      default:
        // Calculate angle based on end direction
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }
  }

  /**
   * Get a point along the path at a given percentage (0-1)
   */
  static getPointAtPercentage(start: Point, end: Point, percentage: number, style: PathStyle): Point {
    if (style === 'straight' || style === 'orthogonal' || style === 'stepped') {
      // Simple linear interpolation
      return {
        x: start.x + (end.x - start.x) * percentage,
        y: start.y + (end.y - start.y) * percentage
      };
    }

    // For curved paths, use quadratic Bezier interpolation
    const midX = (start.x + end.x) / 2;
    const t = percentage;
    const oneMinusT = 1 - t;

    // Cubic Bezier: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
    const x = oneMinusT * oneMinusT * oneMinusT * start.x +
              3 * oneMinusT * oneMinusT * t * midX +
              3 * oneMinusT * t * t * midX +
              t * t * t * end.x;

    const y = oneMinusT * oneMinusT * oneMinusT * start.y +
              3 * oneMinusT * oneMinusT * t * start.y +
              3 * oneMinusT * t * t * end.y +
              t * t * t * end.y;

    return { x, y };
  }
}
