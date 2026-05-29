import type { ScrollTrigger } from 'gsap/ScrollTrigger'
import { santapEase, santapMotion } from '~/composables/useSantapMotion'

export const landingScroll = santapMotion.scroll

export type LandingGsapMm = any

type Gsap = any
type TweenTarget = any
type DOMTarget = any

export async function runLandingGsap(
  root: HTMLElement | null | undefined,
  setup: (api: {
    gsap: Gsap
    ScrollTrigger: typeof ScrollTrigger
    mm: LandingGsapMm
    motion: typeof santapMotion
    revealInstant: (targets: TweenTarget) => void
    /** Fade + subtle rise — primary scroll reveal */
    revealOnScroll: (
      targets: TweenTarget,
      trigger?: DOMTarget,
      opts?: { delay?: number; stagger?: number; y?: number; duration?: number; start?: string },
    ) => void
    /** Opacity-only fade for badges / labels */
    revealFade: (
      targets: TweenTarget,
      trigger?: DOMTarget,
      opts?: { delay?: number; duration?: number; start?: string },
    ) => void
    bindScrollAccordionStack: (
      rows: HTMLElement[],
      onReveal: (index: number) => void,
      opts?: { start?: string },
    ) => () => void
  }) => void,
) {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const revealInstant = (targets: TweenTarget) => {
    gsap.set(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      yPercent: 0,
      scale: 1,
      scaleX: 1,
      filter: 'none',
      clipPath: 'none',
      clearProps: 'transform,opacity,filter,clip-path',
    })
  }

  const revealOnScroll = (
    targets: TweenTarget,
    trigger?: DOMTarget,
    opts?: { delay?: number; stagger?: number; y?: number; duration?: number; start?: string },
  ) => {
    const y = opts?.y ?? santapMotion.y.md
    gsap.set(targets, { opacity: 0, y })
    gsap.to(targets, {
      scrollTrigger: {
        trigger: trigger ?? targets,
        start: opts?.start ?? santapMotion.scroll.enter,
        once: true,
      },
      opacity: 1,
      y: 0,
      duration: opts?.duration ?? santapMotion.duration.section,
      delay: opts?.delay ?? 0,
      stagger: opts?.stagger ?? santapMotion.stagger.normal,
      ease: santapEase,
    })
  }

  const revealFade = (
    targets: TweenTarget,
    trigger?: DOMTarget,
    opts?: { delay?: number; duration?: number; start?: string },
  ) => {
    gsap.set(targets, { opacity: 0 })
    gsap.to(targets, {
      scrollTrigger: {
        trigger: trigger ?? targets,
        start: opts?.start ?? santapMotion.scroll.enter,
        once: true,
      },
      opacity: 1,
      duration: opts?.duration ?? santapMotion.duration.ui,
      delay: opts?.delay ?? 0,
      ease: santapEase,
    })
  }

  const bindScrollAccordionStack = (
    rows: HTMLElement[],
    onReveal: (index: number) => void,
    opts?: { start?: string },
  ) => {
    const start = opts?.start ?? 'top 62%'
    const instances: ScrollTrigger[] = []

    rows.forEach((row, i) => {
      instances.push(
        ScrollTrigger.create({
          trigger: row,
          start,
          onEnter: () => onReveal(i),
          onEnterBack: () => onReveal(i),
        }),
      )
    })

    return () => instances.forEach((t) => t.kill())
  }

  return gsap.context(() => {
    const mm = gsap.matchMedia()
    setup({
      gsap,
      ScrollTrigger,
      mm,
      motion: santapMotion,
      revealInstant,
      revealOnScroll,
      revealFade,
      bindScrollAccordionStack,
    })
  }, root ?? undefined)
}
