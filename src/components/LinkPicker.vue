<template>
  <div class="lp-wrap">
    <!-- Input display -->
    <div class="lp-input-row">
      <input
        class="lp-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder || 'اختر رابطاً أو اكتبه...'"
        readonly
        @click="open = true"
      />
      <button type="button" class="lp-open-btn" @click="open = !open" title="اختر رابط">
        🔗
      </button>
      <button type="button" class="lp-clear-btn" v-if="modelValue" @click="$emit('update:modelValue', '')" title="مسح">✕</button>
    </div>

    <!-- Dropdown panel -->
    <div class="lp-panel" v-if="open" v-click-outside="() => open = false">
      <!-- Search -->
      <div class="lp-search-wrap">
        <input
          v-model="search"
          class="lp-search"
          placeholder="ابحث أو اكتب رابطاً مخصصاً..."
          ref="searchInput"
          @keyup.enter="selectCustom"
        />
      </div>

      <!-- Groups -->
      <div class="lp-groups">

        <!-- Sections -->
        <div class="lp-group" v-if="filteredSections.length">
          <div class="lp-group-label">📄 أقسام الصفحة الرئيسية</div>
          <button
            type="button"
            class="lp-item"
            :class="{ active: modelValue === `#section-${s.key}` }"
            v-for="s in filteredSections" :key="s.key"
            @click="select(`#section-${s.key}`)"
          >
            <span class="lp-item-icon">{{ typeIcons[s.type] || '📄' }}</span>
            <div class="lp-item-text">
              <span class="lp-item-label">{{ s.label }}</span>
              <span class="lp-item-val">#section-{{ s.key }}</span>
            </div>
            <span class="lp-check" v-if="modelValue === `#section-${s.key}`">✓</span>
          </button>
        </div>

        <!-- Pages -->
        <div class="lp-group" v-if="filteredPages.length">
          <div class="lp-group-label">🔗 صفحات الموقع</div>
          <button
            type="button"
            class="lp-item"
            :class="{ active: modelValue === p.link }"
            v-for="p in filteredPages" :key="p.link"
            @click="select(p.link)"
          >
            <span class="lp-item-icon">{{ p.icon }}</span>
            <div class="lp-item-text">
              <span class="lp-item-label">{{ p.label }}</span>
              <span class="lp-item-val">{{ p.link }}</span>
            </div>
            <span class="lp-check" v-if="modelValue === p.link">✓</span>
          </button>
        </div>

        <!-- External -->
        <div class="lp-group" v-if="filteredExternal.length">
          <div class="lp-group-label">🌐 روابط خارجية</div>
          <button
            type="button"
            class="lp-item"
            :class="{ active: modelValue === e.link }"
            v-for="e in filteredExternal" :key="e.link"
            @click="select(e.link)"
          >
            <span class="lp-item-icon">{{ e.icon }}</span>
            <div class="lp-item-text">
              <span class="lp-item-label">{{ e.label }}</span>
              <span class="lp-item-val">{{ e.link }}</span>
            </div>
            <span class="lp-check" v-if="modelValue === e.link">✓</span>
          </button>
        </div>

        <!-- Custom input -->
        <div class="lp-group" v-if="search && !isKnownLink">
          <div class="lp-group-label">✏️ رابط مخصص</div>
          <button type="button" class="lp-item lp-item--custom" @click="selectCustom">
            <span class="lp-item-icon">🔗</span>
            <div class="lp-item-text">
              <span class="lp-item-label">استخدام: {{ search }}</span>
              <span class="lp-item-val">اضغط Enter أو انقر للتأكيد</span>
            </div>
          </button>
        </div>

        <div class="lp-empty" v-if="!filteredSections.length && !filteredPages.length && !filteredExternal.length && !search">
          لا توجد نتائج
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useSections } from '../composables/useSections'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const open  = ref(false)
const search = ref('')
const searchInput = ref(null)

const { sections, load } = useSections()
onMounted(load)

const typeIcons = {
  hero: '🏠', about: 'ℹ️', services: '⚙️',
  cta: '📣', custom: '✨',
}

const pages = [
  { icon: '🏠', label: 'الصفحة الرئيسية',  link: '/' },
  { icon: '⚙️', label: 'صفحة الخدمات',     link: '/services' },
  { icon: '📞', label: 'صفحة تواصل معنا',  link: '/contact' },
]

const externalLinks = computed(() => [
  { icon: '💬', label: 'واتساب',  link: 'https://wa.me/966500000000' },
  { icon: '📧', label: 'البريد',  link: 'mailto:info@example.com' },
  { icon: '📞', label: 'الهاتف',  link: 'tel:0500000000' },
])

const q = computed(() => search.value.toLowerCase().trim())

const filteredSections = computed(() =>
  sections.value.filter(s =>
    !q.value || s.label.includes(q.value) || s.key.includes(q.value)
  )
)
const filteredPages = computed(() =>
  pages.filter(p =>
    !q.value || p.label.includes(q.value) || p.link.includes(q.value)
  )
)
const filteredExternal = computed(() =>
  externalLinks.value.filter(e =>
    !q.value || e.label.includes(q.value) || e.link.includes(q.value)
  )
)

const allKnownLinks = computed(() => [
  ...sections.value.map(s => `#section-${s.key}`),
  ...pages.map(p => p.link),
  ...externalLinks.value.map(e => e.link),
])

const isKnownLink = computed(() =>
  allKnownLinks.value.some(l => l.toLowerCase().includes(q.value))
)

function select(link) {
  emit('update:modelValue', link)
  open.value = false
  search.value = ''
}

function selectCustom() {
  if (search.value.trim()) {
    select(search.value.trim())
  }
}

watch(open, async (v) => {
  if (v) {
    search.value = ''
    await nextTick()
    searchInput.value?.focus()
  }
})

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('mousedown', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el._clickOutside)
  },
}
</script>

<style scoped>
.lp-wrap { position: relative; }
.lp-input-row { display: flex; align-items: center; gap: 4px; }
.lp-input {
  flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px;
  font-family: 'Tajawal', sans-serif; font-size: 0.9rem;
  direction: rtl; background: var(--bg2); cursor: pointer; color: var(--text);
}
.lp-input:focus { outline: none; border-color: var(--neon-blue); }
.lp-open-btn, .lp-clear-btn {
  width: 32px; height: 32px; border: 1px solid var(--border);
  border-radius: 8px; background: var(--glass); cursor: pointer;
  font-size: 0.88rem; flex-shrink: 0; transition: all 0.15s; color: var(--text-muted);
}
.lp-open-btn:hover { border-color: var(--neon-blue); color: var(--neon-blue); }
.lp-clear-btn { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.2); }
.lp-clear-btn:hover { background: rgba(248,113,113,0.18); }
.lp-panel {
  position: absolute; top: calc(100% + 4px); right: 0; left: 0;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  z-index: 300; overflow: hidden; max-height: 380px;
  display: flex; flex-direction: column;
}
.lp-search-wrap { padding: 10px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.lp-search {
  width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px;
  font-family: 'Tajawal', sans-serif; font-size: 0.88rem;
  direction: rtl; background: var(--bg); color: var(--text);
}
.lp-search:focus { outline: none; border-color: var(--neon-blue); }
.lp-groups { overflow-y: auto; flex: 1; padding: 6px; }
.lp-group { margin-bottom: 4px; }
.lp-group-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); padding: 6px 10px 4px; letter-spacing: 0.5px; text-transform: uppercase; }
.lp-item {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px;
  border: none; background: none; border-radius: 8px; cursor: pointer; text-align: right;
  transition: background 0.15s; font-family: 'Tajawal', sans-serif;
}
.lp-item:hover { background: var(--glass); }
.lp-item.active { background: rgba(var(--accent-rgb),0.1); }
.lp-item--custom { border: 1px dashed var(--border); }
.lp-item--custom:hover { border-color: var(--neon-blue); background: rgba(var(--accent-rgb),0.05); }
.lp-item-icon { font-size: 1rem; width: 28px; height: 28px; background: var(--glass); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lp-item.active .lp-item-icon { background: rgba(var(--accent-rgb),0.15); }
.lp-item-text { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.lp-item-label { font-size: 0.85rem; font-weight: 700; color: var(--text); }
.lp-item-val   { font-size: 0.72rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; direction: ltr; text-align: left; }
.lp-check { color: var(--neon-blue); font-weight: 900; font-size: 0.9rem; flex-shrink: 0; }
.lp-empty { text-align: center; color: var(--text-muted); padding: 24px; font-size: 0.85rem; }
</style>
