import { ref, readonly } from 'vue'
import api from '../api'

const settings = ref({})
const loaded   = ref(false)

export function useSettings() {
  async function load() {
    if (loaded.value) return
    const { data } = await api.get('/settings')
    settings.value = data
    loaded.value   = true
    applyColors(data)
  }

  function applyColors(s) {
    const root = document.documentElement

    // ── Primary accent color (neon-blue) ──
    if (s.color_primary) {
      const c = s.color_primary
      root.style.setProperty('--neon-blue', c)
      root.style.setProperty('--accent', c)
      const rgb = hexToRgb(c)
      if (rgb) {
        root.style.setProperty('--accent-rgb', `${rgb.r},${rgb.g},${rgb.b}`)
        root.style.setProperty('--accent-glow', `rgba(${rgb.r},${rgb.g},${rgb.b},0.35)`)
        root.style.setProperty('--border-accent', `rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`)
        root.style.setProperty('--glow-blue', `0 0 40px rgba(${rgb.r},${rgb.g},${rgb.b},0.2)`)
      }
    }

    // ── Secondary accent (neon-purple) ──
    if (s.color_accent) {
      const c = s.color_accent
      root.style.setProperty('--neon-purple', c)
      const rgb = hexToRgb(c)
      if (rgb) root.style.setProperty('--purple-glow', `rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`)
    }

    // ── Background (dark) ──
    if (s.color_dark) {
      const c = s.color_dark
      root.style.setProperty('--bg', c)
      root.style.setProperty('--dark', c)
      const rgb = hexToRgb(c)
      if (rgb) {
        root.style.setProperty('--dark-rgb', `${rgb.r},${rgb.g},${rgb.b}`)
        // Derive bg2 and bg3 as slightly lighter variants
        root.style.setProperty('--bg2', lightenHex(c, 5))
        root.style.setProperty('--bg3', lightenHex(c, 9))
      }
    }

    // ── Text color ──
    if (s.color_text) {
      root.style.setProperty('--text', s.color_text)
      // Derive muted from text color
      const rgb = hexToRgb(s.color_text)
      if (rgb) {
        root.style.setProperty('--text-muted', `rgba(${rgb.r},${rgb.g},${rgb.b},0.45)`)
        root.style.setProperty('--text-dim',   `rgba(${rgb.r},${rgb.g},${rgb.b},0.2)`)
      }
    }

    // ── Font family ──
    if (s.font_family) {
      root.style.setProperty('--font', s.font_family)
      document.body.style.fontFamily = `'${s.font_family}', 'Tajawal', 'Inter', sans-serif`
    }
  }

  function get(key, fallback = '') {
    return settings.value[key] ?? fallback
  }

  async function refresh() {
    loaded.value = false
    const { data } = await api.get('/settings')
    settings.value = data
    loaded.value   = true
    applyColors(data)
  }

  // Live preview — apply without saving
  function previewColors(patch) {
    applyColors({ ...settings.value, ...patch })
  }

  return { settings: readonly(settings), load, get, refresh, applyColors, previewColors }
}

// ── Color helpers ──────────────────────────────────────

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v =>
    Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0')
  ).join('')
}

// Lighten a hex color by mixing with white (amount = 0-100)
function lightenHex(hex, amount) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return rgbToHex(
    rgb.r + (255 - rgb.r) * (amount / 100),
    rgb.g + (255 - rgb.g) * (amount / 100),
    rgb.b + (255 - rgb.b) * (amount / 100),
  )
}
