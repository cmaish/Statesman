/**
 * Theme system for customizable diagram appearance
 */

import { StepType } from '../models/types';

export interface ColorScheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
  selected: string;
}

export interface StepStyle {
  fill: string;
  fillGradient?: { start: string; end: string; direction: 'vertical' | 'horizontal' | 'radial' };
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  padding: number;
  minWidth: number;
  minHeight: number;
  iconSize: number;
  shadow?: {
    enabled: boolean;
    blur: number;
    offsetX: number;
    offsetY: number;
    color: string;
    opacity: number;
  };
  glow?: {
    enabled: boolean;
    color: string;
    blur: number;
  };
  opacity?: number;
  className?: string;
}

export interface NodeStyle {
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  hoverRadius: number;
}

export interface TransitionStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray: string;
  arrowSize: number;
  labelFontSize: number;
  labelFontFamily: string;
  labelBackground: string;
  labelPadding: number;
  curveStyle: 'curved' | 'straight' | 'stepped';
  animationSpeed?: number;
  highlightColor?: string;
  opacity?: number;
}

export interface Theme {
  name: string;
  colors: ColorScheme;
  stepStyles: Map<StepType, StepStyle>;
  defaultStepStyle: StepStyle;
  nodeStyle: NodeStyle;
  transitionStyle: TransitionStyle;
  spacing: {
    horizontal: number;
    vertical: number;
    nodeSpacing: number;
  };
  effects?: {
    enableShadows: boolean;
    enableGradients: boolean;
    enableAnimations: boolean;
    enableGlow: boolean;
  };
  grid?: {
    enabled: boolean;
    size: number;
    color: string;
    opacity: number;
  };
}

/**
 * Default theme with appealing modern design
 */
export const DefaultTheme: Theme = {
  name: 'default',
  colors: {
    primary: '#4F46E5',
    secondary: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    background: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#D1D5DB',
    hover: '#EEF2FF',
    selected: '#4F46E5'
  },
  stepStyles: new Map([
    [StepType.START, {
      fill: '#10B981',
      fillGradient: { start: '#34D399', end: '#10B981', direction: 'vertical' },
      stroke: '#059669',
      strokeWidth: 2,
      cornerRadius: 25,
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      padding: 16,
      minWidth: 120,
      minHeight: 50,
      iconSize: 24,
      shadow: {
        enabled: true,
        blur: 8,
        offsetX: 0,
        offsetY: 4,
        color: '#000000',
        opacity: 0.15
      }
    }],
    [StepType.END, {
      fill: '#EF4444',
      fillGradient: { start: '#F87171', end: '#EF4444', direction: 'vertical' },
      stroke: '#DC2626',
      strokeWidth: 2,
      cornerRadius: 25,
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      padding: 16,
      minWidth: 120,
      minHeight: 50,
      iconSize: 24,
      shadow: {
        enabled: true,
        blur: 8,
        offsetX: 0,
        offsetY: 4,
        color: '#000000',
        opacity: 0.15
      }
    }],
    [StepType.DECISION, {
      fill: '#F59E0B',
      fillGradient: { start: '#FBBF24', end: '#F59E0B', direction: 'vertical' },
      stroke: '#D97706',
      strokeWidth: 2,
      cornerRadius: 8,
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
        opacity: 0.12
      }
    }],
    [StepType.PROCESS, {
      fill: '#4F46E5',
      fillGradient: { start: '#6366F1', end: '#4F46E5', direction: 'vertical' },
      stroke: '#4338CA',
      strokeWidth: 2,
      cornerRadius: 8,
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '500',
      padding: 16,
      minWidth: 160,
      minHeight: 80,
      iconSize: 24,
      shadow: {
        enabled: true,
        blur: 6,
        offsetX: 0,
        offsetY: 3,
        color: '#000000',
        opacity: 0.12
      }
    }]
  ]),
  defaultStepStyle: {
    fill: '#6B7280',
    fillGradient: { start: '#9CA3AF', end: '#6B7280', direction: 'vertical' },
    stroke: '#4B5563',
    strokeWidth: 2,
    cornerRadius: 8,
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
      opacity: 0.12
    }
  },
  nodeStyle: {
    radius: 6,
    fill: '#FFFFFF',
    stroke: '#4B5563',
    strokeWidth: 2,
    hoverRadius: 8
  },
  transitionStyle: {
    stroke: '#6B7280',
    strokeWidth: 2,
    strokeDasharray: '',
    arrowSize: 8,
    labelFontSize: 12,
    labelFontFamily: 'system-ui, -apple-system, sans-serif',
    labelBackground: '#FFFFFF',
    labelPadding: 4,
    curveStyle: 'curved',
    animationSpeed: 1,
    highlightColor: '#4F46E5',
    opacity: 0.9
  },
  spacing: {
    horizontal: 200,
    vertical: 120,
    nodeSpacing: 12
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
    color: '#E5E7EB',
    opacity: 0.3
  }
};

/**
 * Dark theme variant
 */
export const DarkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#818CF8',
    secondary: '#A78BFA',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#60A5FA',
    background: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#4B5563',
    hover: '#374151',
    selected: '#818CF8'
  },
  stepStyles: new Map([
    [StepType.START, {
      fill: '#065F46',
      fillGradient: { start: '#10B981', end: '#065F46', direction: 'vertical' },
      stroke: '#34D399',
      strokeWidth: 2,
      cornerRadius: 25,
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      padding: 16,
      minWidth: 120,
      minHeight: 50,
      iconSize: 24,
      shadow: {
        enabled: true,
        blur: 12,
        offsetX: 0,
        offsetY: 4,
        color: '#000000',
        opacity: 0.3
      },
      glow: {
        enabled: true,
        color: '#34D399',
        blur: 4
      }
    }],
    [StepType.END, {
      fill: '#7F1D1D',
      fillGradient: { start: '#DC2626', end: '#7F1D1D', direction: 'vertical' },
      stroke: '#F87171',
      strokeWidth: 2,
      cornerRadius: 25,
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '600',
      padding: 16,
      minWidth: 120,
      minHeight: 50,
      iconSize: 24,
      shadow: {
        enabled: true,
        blur: 12,
        offsetX: 0,
        offsetY: 4,
        color: '#000000',
        opacity: 0.3
      },
      glow: {
        enabled: true,
        color: '#F87171',
        blur: 4
      }
    }],
    [StepType.DECISION, {
      fill: '#78350F',
      fillGradient: { start: '#F59E0B', end: '#78350F', direction: 'vertical' },
      stroke: '#FBBF24',
      strokeWidth: 2,
      cornerRadius: 8,
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '500',
      padding: 16,
      minWidth: 140,
      minHeight: 80,
      iconSize: 24,
      shadow: {
        enabled: true,
        blur: 10,
        offsetX: 0,
        offsetY: 3,
        color: '#000000',
        opacity: 0.25
      },
      glow: {
        enabled: true,
        color: '#FBBF24',
        blur: 3
      }
    }],
    [StepType.PROCESS, {
      fill: '#312E81',
      fillGradient: { start: '#4F46E5', end: '#312E81', direction: 'vertical' },
      stroke: '#818CF8',
      strokeWidth: 2,
      cornerRadius: 8,
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '500',
      padding: 16,
      minWidth: 160,
      minHeight: 80,
      iconSize: 24,
      shadow: {
        enabled: true,
        blur: 10,
        offsetX: 0,
        offsetY: 3,
        color: '#000000',
        opacity: 0.25
      },
      glow: {
        enabled: true,
        color: '#818CF8',
        blur: 3
      }
    }]
  ]),
  defaultStepStyle: {
    fill: '#374151',
    fillGradient: { start: '#4B5563', end: '#374151', direction: 'vertical' },
    stroke: '#9CA3AF',
    strokeWidth: 2,
    cornerRadius: 8,
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: '500',
    padding: 16,
    minWidth: 140,
    minHeight: 80,
    iconSize: 24,
    shadow: {
      enabled: true,
      blur: 10,
      offsetX: 0,
      offsetY: 3,
      color: '#000000',
      opacity: 0.25
    }
  },
  nodeStyle: {
    radius: 6,
    fill: '#1F2937',
    stroke: '#9CA3AF',
    strokeWidth: 2,
    hoverRadius: 8
  },
  transitionStyle: {
    stroke: '#9CA3AF',
    strokeWidth: 2,
    strokeDasharray: '',
    arrowSize: 8,
    labelFontSize: 12,
    labelFontFamily: 'system-ui, -apple-system, sans-serif',
    labelBackground: '#1F2937',
    labelPadding: 4,
    curveStyle: 'curved',
    animationSpeed: 1,
    highlightColor: '#818CF8',
    opacity: 0.85
  },
  spacing: {
    horizontal: 200,
    vertical: 120,
    nodeSpacing: 12
  },
  effects: {
    enableShadows: true,
    enableGradients: true,
    enableAnimations: true,
    enableGlow: true
  },
  grid: {
    enabled: false,
    size: 20,
    color: '#374151',
    opacity: 0.4
  }
};

export class ThemeManager {
  private themes: Map<string, Theme> = new Map();
  private currentTheme: Theme;

  constructor(initialTheme: Theme = DefaultTheme) {
    this.themes.set(DefaultTheme.name, DefaultTheme);
    this.themes.set(DarkTheme.name, DarkTheme);
    this.currentTheme = initialTheme;
  }

  registerTheme(theme: Theme): void {
    this.themes.set(theme.name, theme);
  }

  setTheme(name: string): boolean {
    const theme = this.themes.get(name);
    if (theme) {
      this.currentTheme = theme;
      return true;
    }
    return false;
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  getStepStyle(stepType: StepType): StepStyle {
    return this.currentTheme.stepStyles.get(stepType) || this.currentTheme.defaultStepStyle;
  }
}
