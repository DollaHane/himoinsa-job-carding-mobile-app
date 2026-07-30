'use client';
import { vars } from 'nativewind';

export const config = {
  light: vars({
    '--color-primary': '51 51 51',
    '--color-primary-muted': '229, 229, 229',
    '--color-primary-foreground': '163, 163, 163',
    '--color-secondary': '68, 64, 60',
    '--color-secondary-muted': '231, 229, 228',
    '--color-secondary-foreground': '168, 162, 158',
    '--color-tertiary': '10, 151, 232',
    '--color-tertiary-muted': '150, 217, 255',
    '--color-tertiary-foreground': '0, 94, 148',
    '--color-error': '220, 38, 38',
    '--color-success': '34, 197, 94',
    '--color-warning': '249, 115, 22',
    '--color-info': '59, 130, 246',
    '--color-text': '23, 23, 23',
    '--color-text-muted': '163, 163, 163',
    '--color-text-inverse': '250, 250, 250',
    '--color-border': '212, 212, 212',
    '--color-background': '250, 250, 249',
    '--color-background-subtle': '245, 245, 244',

    /* Accent colors */
    '--color-accent-primary': '207 17 29',
    '--color-accent-muted': '252, 165, 165',
  }),
  dark: vars({
    '--color-primary': '250, 250, 250',
    '--color-primary-muted': '163, 163, 163',
    '--color-primary-foreground': '115, 115, 115',
    '--color-secondary': '245, 245, 244',
    '--color-secondary-muted': '168, 162, 158',
    '--color-secondary-foreground': '41, 37, 36',
    '--color-tertiary': '10, 151, 232',
    '--color-tertiary-muted': '150, 217, 255',
    '--color-tertiary-foreground': '0, 94, 148',
    '--color-error': '220, 38, 38',
    '--color-success': '34, 197, 94',
    '--color-warning': '249, 115, 22',
    '--color-info': '59, 130, 246',
    '--color-text': '250, 250, 250',
    '--color-text-muted': '115, 115, 115',
    '--color-text-inverse': '23, 23, 23',
    '--color-border': '41, 37, 36',
    '--color-background': '28, 25, 23',
    '--color-background-subtle': '68, 64, 60',

    /* Accent colors */
    '--color-accent-primary': '207 17 29',
    '--color-accent-muted': '252, 165, 165',
  }),
};
