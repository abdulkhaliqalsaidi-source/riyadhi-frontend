<template>
  <section class="partners-section" :id="section ? `section-${section.key}` : 'section-partners'">
    <template v-if="partners.length">
    <div class="partners-header" v-animate="'fade-up'">
      <div class="partners-line"></div>
      <span class="partners-label">{{ sectionTitle }}</span>
      <div class="partners-line"></div>
    </div>

    <div class="marquee-wrap">
      <div class="marquee-fade marquee-fade--right"></div>
      <div class="marquee-fade marquee-fade--left"></div>
      <div class="marquee">
        <div class="marquee-track" :style="`--speed:${Math.max(20, partners.length * 4)}s`">
          <div class="partner-card" v-for="(p, i) in [...partners, ...partners, ...partners]" :key="i">
            <component :is="p.website ? 'a' : 'div'"
              :href="p.website || undefined"
              :target="p.website ? '_blank' : undefined"
              class="partner-inner"
            >
              <img v-if="p.logo" :src="p.logo" :alt="p.name" class="partner-img" />
              <span class="partner-icon" v-if="!p.logo">{{ p.icon || '🏢' }}</span>
              <span class="partner-name">{{ p.name }}</span>
            </component>
          </div>
        </div>
      </div>
    </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api'

const props = defineProps({
  section: { type: Object, default: null }
})

const apiPartners = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/partners')
    apiPartners.value = data
  } catch { apiPartners.value = [] }
})

const partners = computed(() => apiPartners.value)

const sectionTitle = computed(() =>
  props.section?.content?.title || 'شركاؤنا وعملاؤنا'
)
</script>

<style scoped>
.partners-section {
  padding: 64px 0;
  background: var(--bg2);
  position: relative; overflow: hidden;
}
.partners-section::before,
.partners-section::after {
  content: ''; position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.2), transparent);
}
.partners-section::before { top: 0; }
.partners-section::after  { bottom: 0; }

.partners-header {
  display: flex; align-items: center; justify-content: center;
  gap: 20px; margin-bottom: 40px; padding: 0 28px;
}
.partners-label { font-size: 0.72rem; font-weight: 800; color: var(--text-muted); letter-spacing: 3px; text-transform: uppercase; white-space: nowrap; }
.partners-line { flex: 1; max-width: 180px; height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent); }

.marquee-wrap { position: relative; overflow: hidden; }
.marquee-fade { position: absolute; top: 0; bottom: 0; width: 140px; z-index: 2; pointer-events: none; }
.marquee-fade--right { right: 0; background: linear-gradient(to left,  var(--bg2), transparent); }
.marquee-fade--left  { left: 0;  background: linear-gradient(to right, var(--bg2), transparent); }

.marquee { overflow: hidden; }
.marquee-track {
  display: flex; width: max-content;
  animation: marquee-scroll var(--speed, 30s) linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% / 3)); }
}

.partner-card { padding: 0 6px; flex-shrink: 0; }
.partner-inner {
  display: flex; align-items: center; gap: 10px;
  padding: 13px 24px; border-radius: 14px;
  border: 1px solid var(--border); background: var(--glass);
  transition: all 0.3s var(--ease); cursor: default;
  white-space: nowrap; backdrop-filter: blur(8px);
  text-decoration: none;
}
a.partner-inner { cursor: pointer; }
.partner-inner:hover {
  border-color: rgba(var(--accent-rgb),0.3);
  background: rgba(var(--accent-rgb),0.06);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.3), 0 0 0 1px rgba(var(--accent-rgb),0.12);
}
.partner-icon { font-size: 1.25rem; }
.partner-name { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); transition: color 0.3s; }
.partner-inner:hover .partner-name { color: var(--text); }
.partner-img { height: 28px; max-width: 90px; object-fit: contain; filter: grayscale(0.3) opacity(0.8); transition: all 0.3s; }
.partner-inner:hover .partner-img { filter: grayscale(0) opacity(1); }

@media (max-width: 600px) {
  .marquee-fade { width: 60px; }
  .partner-inner { padding: 11px 16px; }
}
</style>
