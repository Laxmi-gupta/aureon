import type { Transition, Variants } from 'framer-motion';

/**
 * Shared easing + duration vocabulary so every animation in the product
 * comes from the same physical "material" instead of ad-hoc tweens.
 */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
  fast: 0.18,
  base: 0.35,
  slow: 0.6,
  cinematic: 1,
} as const;

export const transition = {
  base: { duration: DURATION.base, ease: EASE_OUT_EXPO } satisfies Transition,
  slow: { duration: DURATION.slow, ease: EASE_OUT_EXPO } satisfies Transition,
  fast: { duration: DURATION.fast, ease: EASE_OUT_SOFT } satisfies Transition,
  spring: { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 } satisfies Transition,
  springSoft: { type: 'spring', stiffness: 180, damping: 24, mass: 1 } satisfies Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transition.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transition.base },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const viewportOnce = { once: true, margin: '-80px 0px -80px 0px' };
