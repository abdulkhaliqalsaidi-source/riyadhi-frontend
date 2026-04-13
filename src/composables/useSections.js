import { ref, computed } from 'vue'
import api from '../api'

// Module-level reactive state — shared across all component instances
const sections = ref([])
const loaded   = ref(false)

// Nav items: active + show_in_nav, ordered
// hero type gets a special 'home' flag so App.vue renders it as router-link
const navSections = computed(() =>
  sections.value
    .filter(s => s.is_active && s.show_in_nav)
    .map(s => ({ ...s, isHome: s.type === 'hero' }))
)
const activeSections = computed(() => sections.value.filter(s => s.is_active))

export function useSections() {

  // Always fetch fresh data — no cache
  async function load(force = false) {
    if (loaded.value && !force) return
    const { data } = await api.get('/sections')
    sections.value = data
    loaded.value   = true
  }

  // Force re-fetch and update reactive state
  async function refresh() {
    const { data } = await api.get('/sections')
    sections.value = data
    loaded.value   = true
  }

  return {
    sections,
    navSections,
    activeSections,
    load,
    refresh,
  }
}
