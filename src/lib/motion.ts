import { type Transition, type Variants } from 'framer-motion';

/**
 * Standard spring physics token for Liquid Glass UI.
 * Inspired by Apple VisionOS / iOS spring kinetics.
 */
export const defaultSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 0.8,
};

export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 1,
};

export const slowSpring: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 24,
};

/**
 * Common animation variants for staggered lists and reveals.
 */
export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultSpring,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.15 },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultSpring,
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: { duration: 0.2 },
  },
};

