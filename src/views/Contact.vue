<template>
  <div>
    <!-- Hero -->
    <div class="page-hero">
      <div class="page-hero-grid"></div>
      <div class="container">
        <div class="sec-tag">نحن هنا</div>
        <h1>تواصل <span>معنا</span></h1>
        <p>سنرد عليك خلال ٢٤ ساعة — أو تواصل معنا مباشرة عبر واتساب</p>
        <div class="breadcrumb">
          <router-link to="/">الرئيسية</router-link>
          <span>›</span>
          <span>تواصل معنا</span>
        </div>
      </div>
    </div>

    <section class="contact-section">
      <div class="container contact-layout">

        <!-- Info Panel -->
        <div class="info-panel" v-animate="'fade-right'">
          <div class="info-panel-header">
            <h2>معلومات التواصل</h2>
            <p>يسعدنا التواصل معك في أي وقت</p>
          </div>

          <div class="info-items">
            <div class="info-item" v-for="item in info" :key="item.label">
              <div class="info-item-icon">{{ item.icon }}</div>
              <div class="info-item-text">
                <strong>{{ item.label }}</strong>
                <span>{{ item.value }}</span>
              </div>
            </div>
          </div>

          <div class="info-divider"></div>

          <a :href="waLink" target="_blank" class="wa-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            تواصل عبر واتساب الآن
          </a>

          <!-- Decorative -->
          <div class="info-deco">
            <div class="deco-circle c1"></div>
            <div class="deco-circle c2"></div>
          </div>
        </div>

        <!-- Form Panel -->
        <div class="form-panel" v-animate="'fade-left'" style="transition-delay:0.1s">
          <div class="form-panel-header">
            <h2>أرسل لنا رسالة</h2>
            <p>سنتواصل معك في أقرب وقت ممكن</p>
          </div>

          <form @submit.prevent="submit" class="contact-form" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="name">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  الاسم الكامل
                </label>
                <input id="name" v-model="form.name" type="text" placeholder="أدخل اسمك الكامل" required />
              </div>
              <div class="form-group">
                <label for="phone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  رقم الجوال
                </label>
                <input id="phone" v-model="form.phone" type="tel" placeholder="05xxxxxxxx" required />
              </div>
            </div>

            <div class="form-group">
              <label for="message">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                رسالتك
              </label>
              <textarea id="message" v-model="form.message" rows="5"
                placeholder="اكتب تفاصيل مشروعك أو استفسارك هنا..." required></textarea>
            </div>

            <transition name="fade">
              <div v-if="successMsg" class="alert alert-success">
                <span>✅</span> {{ successMsg }}
              </div>
            </transition>
            <transition name="fade">
              <div v-if="errorMsg" class="alert alert-error">
                <span>⚠️</span> {{ errorMsg }}
              </div>
            </transition>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="!loading">
                إرسال الرسالة
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </span>
              <span v-else class="sending">
                <div class="btn-spinner"></div>
                جاري الإرسال...
              </span>
            </button>
          </form>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import { useSettings } from '../composables/useSettings'
import { useSeo } from '../composables/useSeo'

const { load, get } = useSettings()
const s = (key, fb = '') => get(key, fb)
const { setPage } = useSeo()

const form = ref({ name: '', phone: '', message: '' })
const loading    = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

const info = computed(() => [
  { icon: '📍', label: 'الموقع',        value: s('location', 'المملكة العربية السعودية') },
  { icon: '📞', label: 'الهاتف',        value: s('phone', '0500000000') },
  { icon: '🕐', label: 'ساعات العمل',   value: s('working_hours', 'السبت – الخميس: ٨ص – ٦م') },
  { icon: '⚡', label: 'وقت الاستجابة', value: 'خلال ٢٤ ساعة' },
])

const waLink = computed(() => `https://wa.me/${s('whatsapp_number', '966500000000')}`)

onMounted(async () => {
  await load()
  setPage({
    title: `تواصل معنا | ${s('site_title', 'الرياضي للمقاولات')}`,
    description: `تواصل مع ${s('company_name_ar', 'الرياضي للمقاولات')} — ${s('phone', '')}`,
  })
})

async function submit() {
  loading.value    = true
  successMsg.value = ''
  errorMsg.value   = ''
  try {
    await api.post('/contact', form.value)
    successMsg.value = 'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.'
    form.value = { name: '', phone: '', message: '' }
  } catch (e) {
    const errors = e.response?.data?.errors
    errorMsg.value = errors
      ? Object.values(errors).flat().join(' | ')
      : 'حدث خطأ، يرجى المحاولة مرة أخرى.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-section { padding: 80px 0 100px; background: var(--bg); }
.contact-layout { display: grid; grid-template-columns: 1fr 1.6fr; gap: 28px; align-items: start; }

/* ── Info Panel ── */
.info-panel {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 36px 28px;
  position: relative; overflow: hidden;
}
.info-panel::before {
  content: ''; position: absolute; top: -80px; right: -80px;
  width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.info-panel-header h2 { font-size: 1.25rem; font-weight: 800; color: var(--text); }
.info-panel-header p  { color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; }

.info-items { margin-top: 28px; display: flex; flex-direction: column; gap: 18px; }
.info-item { display: flex; align-items: center; gap: 14px; }
.info-item-icon {
  width: 42px; height: 42px;
  background: rgba(59,130,246,0.08);
  border: 1px solid rgba(59,130,246,0.15);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.info-item-text strong { display: block; color: var(--text); font-size: 0.86rem; font-weight: 700; }
.info-item-text span   { color: var(--text-muted); font-size: 0.82rem; }

.info-divider { height: 1px; background: var(--border); margin: 24px 0; }

.wa-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #25d366, #128c7e);
  color: white; border-radius: var(--radius);
  font-weight: 800; font-size: 0.93rem;
  transition: all 0.3s var(--ease); position: relative; z-index: 1;
}
.wa-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,211,102,0.35); }

.deco-circle { position: absolute; border-radius: 50%; opacity: 0.04; }
.c1 { width: 180px; height: 180px; background: var(--neon-blue); bottom: -50px; left: -50px; }
.c2 { width: 100px; height: 100px; background: var(--neon-purple); top: -20px; right: -20px; }

/* ── Form Panel ── */
.form-panel {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 36px 32px;
}
.form-panel-header h2 { font-size: 1.35rem; font-weight: 900; color: var(--text); }
.form-panel-header p  { color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; }

.contact-form { margin-top: 24px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.form-group { margin-bottom: 18px; }
.form-group label {
  display: flex; align-items: center; gap: 6px;
  font-weight: 700; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 7px;
}
.form-group label svg { color: var(--neon-blue); }

.form-group input,
.form-group textarea {
  width: 100%; padding: 12px 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: 'Tajawal', sans-serif; font-size: 0.95rem;
  color: var(--text); direction: rtl;
  transition: all 0.2s var(--ease);
}
.form-group input::placeholder,
.form-group textarea::placeholder { color: var(--text-dim); }
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--neon-blue);
  background: rgba(59,130,246,0.04);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}
.form-group textarea { resize: vertical; min-height: 130px; }

.alert {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border-radius: var(--radius-sm);
  margin-bottom: 14px; font-size: 0.9rem; font-weight: 600;
}
.alert-success { background: rgba(74,222,128,0.08); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
.alert-error   { background: rgba(248,113,113,0.08); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }

.submit-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  color: white; border: none; border-radius: var(--radius);
  font-family: 'Tajawal', sans-serif; font-size: 0.97rem; font-weight: 800;
  cursor: pointer; transition: all 0.3s var(--ease);
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(59,130,246,0.4); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.sending { display: flex; align-items: center; gap: 10px; }
.btn-spinner {
  width: 17px; height: 17px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) { .contact-layout { grid-template-columns: 1fr; } }
@media (max-width: 560px) {
  .form-row { grid-template-columns: 1fr; }
  .form-panel, .info-panel { padding: 24px 18px; }
}
</style>
