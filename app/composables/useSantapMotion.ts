/** Santap motion tokens — aligned with product motion direction */

export const santapEase = 'power2.out' as const

export const santapMotion = {
  ease: santapEase,
  duration: {
    micro: 0.15,
    ui: 0.28,
    section: 0.52,
    hero: 1.05,
  },
  y: {
    sm: 8,
    md: 14,
    lg: 18,
  },
  scroll: {
    enter: 'top 86%',
    section: 'top 84%',
    item: 'top 82%',
  },
  stagger: {
    tight: 0.06,
    normal: 0.09,
    loose: 0.12,
  },
} as const

export type SantapMotionMm = any
