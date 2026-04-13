/**
 * useAnimate — Intersection Observer based scroll animations
 * Usage: v-animate or v-animate="'fade-left'" on any element
 */

const ANIMATIONS = {
  'fade-up':    'anim--fade-up',
  'fade-down':  'anim--fade-down',
  'fade-left':  'anim--fade-left',
  'fade-right': 'anim--fade-right',
  'zoom-in':    'anim--zoom-in',
  'flip-up':    'anim--flip-up',
}

let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim--visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  return observer
}

export const vAnimate = {
  mounted(el, binding) {
    const type = binding.value || 'fade-up'
    const delay = binding.arg ? parseInt(binding.arg) : 0
    const cls = ANIMATIONS[type] || ANIMATIONS['fade-up']

    el.classList.add('anim--base', cls)
    if (delay) el.style.transitionDelay = `${delay}ms`

    // Small timeout so initial render doesn't flash
    setTimeout(() => getObserver().observe(el), 50)
  },
  unmounted(el) {
    getObserver().unobserve(el)
  },
}
