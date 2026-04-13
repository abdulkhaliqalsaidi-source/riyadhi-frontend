<template>
  <div>
    <!-- Hero with real photo -->
    <div class="page-hero">
      <div class="page-hero-photo" :style="`background-image:url('${IMAGES.building}')`"></div>
      <div class="page-hero-overlay"></div>
      <div class="container" style="position:relative;z-index:1">
        <div class="sec-tag">ما نقدمه</div>
        <h1>خدماتنا <span>المتميزة</span></h1>
        <p>حلول متكاملة في البناء والتشييد بأعلى معايير الجودة</p>
        <div class="breadcrumb">
          <router-link to="/">الرئيسية</router-link>
          <span>›</span>
          <span>الخدمات</span>
        </div>
      </div>
    </div>

    <section class="services-page">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>جاري التحميل...</p>
        </div>

        <div v-else class="svc-list">
          <div class="svc-row" v-for="(sv, i) in services" :key="sv.id"
            :class="{ reverse: i % 2 !== 0 }"
            v-animate="i % 2 === 0 ? 'fade-right' : 'fade-left'"
            :style="`transition-delay:${i * 80}ms`">
            <!-- Real photo -->
            <div class="svc-row-visual">
              <div class="svc-photo-frame">
                <img :src="sv.image || IMAGES[sv.icon] || IMAGES.other" :alt="sv.name_ar" class="svc-photo" loading="lazy" />
                <div class="svc-photo-overlay"></div>
                <div class="svc-photo-num">0{{ i + 1 }}</div>
              </div>
            </div>
            <div class="svc-row-body">
              <div class="sec-tag">خدمة</div>
              <h2>{{ sv.name_ar }}</h2>
              <div class="gold-line" style="margin:14px 0;"></div>
              <p>{{ sv.description_ar }}</p>
              <ul class="svc-points" v-if="sv.points?.length">
                <li v-for="pt in sv.points" :key="pt">
                  <span class="pt-dot"></span>{{ pt }}
                </li>
              </ul>
              <a :href="`https://wa.me/${cfg('whatsapp_number', '966500000000')}`" target="_blank" class="btn btn-primary" style="margin-top:28px">
                اطلب هذه الخدمة
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA with photo -->
    <section class="svc-bottom-cta">
      <div class="container">
        <div class="cta-card">
          <div class="cta-card-photo" :style="`background-image:url('${IMAGES.cta}')`"></div>
          <div class="cta-card-overlay"></div>
          <div class="cta-card-content">
            <h2>لم تجد ما تبحث عنه؟</h2>
            <p>تواصل معنا وسنقدم لك الحل المناسب لمشروعك</p>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-top:28px">
              <router-link to="/contact" class="btn btn-primary">تواصل معنا</router-link>
              <a :href="`https://wa.me/${cfg('whatsapp_number', '966500000000')}`" target="_blank" class="btn btn-outline">واتساب</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { IMAGES } from '../assets/images.js'
import api from '../api'
import { useSettings } from '../composables/useSettings'
import { useSeo } from '../composables/useSeo'

const { load, get } = useSettings()
const cfg = (key, fb = '') => get(key, fb)
const { setPage } = useSeo()
const services = ref([])
const loading  = ref(true)

onMounted(async () => {
  await load()
  setPage({
    title: `خدماتنا | ${cfg('site_title', 'الرياضي للمقاولات')}`,
    description: 'خدمات البناء والتشييد، السواتر، مظلات السيارات، والبرجولات بأعلى معايير الجودة',
  })
  try {
    const { data } = await api.get('/services')
    services.value = data
  } catch {
    services.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.services-page { padding: 80px 0 100px; background: var(--bg); }

.page-hero { position: relative; padding: 140px 0 80px; overflow: hidden; text-align: center; background: var(--bg2); }
.page-hero-photo { position: absolute; inset: 0; background-size: cover; background-position: center; filter: brightness(0.25) saturate(0.7); }
.page-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(3,7,18,0.9), rgba(10,15,30,0.8)); }
.page-hero .container { position: relative; z-index: 1; }
.page-hero h1 { font-size: clamp(2rem,5vw,3rem); font-weight: 900; color: white; }
.page-hero h1 span {
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-cyan));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.page-hero p { color: rgba(255,255,255,0.5); margin-top: 12px; font-size: 1.05rem; }
.breadcrumb { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; font-size: 0.88rem; color: rgba(255,255,255,0.35); }
.breadcrumb a { color: var(--neon-blue); }

.loading-state { text-align: center; padding: 80px; color: var(--text-muted); }
.spinner { width: 36px; height: 36px; border: 3px solid rgba(59,130,246,0.15); border-top-color: var(--neon-blue); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }

.svc-list { display: flex; flex-direction: column; gap: 80px; }
.svc-row { display: grid; grid-template-columns: 1fr 1.3fr; gap: 60px; align-items: center; }
.svc-row.reverse { direction: ltr; }
.svc-row.reverse .svc-row-body { direction: rtl; }

.svc-row-visual { position: relative; }
.svc-photo-frame {
  position: relative; height: 380px;
  border-radius: var(--radius-xl); overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
}
.svc-photo { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s var(--ease); }
.svc-photo-frame:hover .svc-photo { transform: scale(1.05); }
.svc-photo-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(3,7,18,0.5) 0%, transparent 55%); }
.svc-photo-num {
  position: absolute; bottom: 18px; right: 18px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  color: white; font-size: 0.82rem; font-weight: 900;
  padding: 5px 14px; border-radius: 50px;
}

.svc-row-body h2 { font-size: clamp(1.5rem,3vw,2rem); font-weight: 900; color: var(--text); }
.svc-row-body p { color: var(--text-muted); line-height: 1.9; font-size: 1rem; margin-top: 12px; }
.svc-points { list-style: none; margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
.svc-points li { display: flex; align-items: center; gap: 10px; color: var(--text); font-size: 0.95rem; }
.pt-dot {
  width: 8px; height: 8px; flex-shrink: 0; border-radius: 50%;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-cyan));
  box-shadow: 0 0 8px rgba(59,130,246,0.5);
}

.svc-bottom-cta { padding: 40px 0 100px; background: var(--bg); }
.cta-card {
  position: relative; border-radius: var(--radius-xl);
  padding: 80px 40px; text-align: center; overflow: hidden;
  min-height: 300px; display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border);
}
.cta-card-photo { position: absolute; inset: 0; background-size: cover; background-position: center; filter: brightness(0.2) saturate(0.6); }
.cta-card-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(3,7,18,0.92), rgba(10,15,30,0.88)); }
.cta-card-content { position: relative; z-index: 1; }
.cta-card-content h2 { font-size: 1.8rem; font-weight: 900; color: white; }
.cta-card-content p { color: rgba(255,255,255,0.5); margin-top: 10px; }

@media (max-width: 768px) {
  .svc-row, .svc-row.reverse { grid-template-columns: 1fr; direction: rtl; }
  .svc-photo-frame { height: 260px; }
}
</style>
