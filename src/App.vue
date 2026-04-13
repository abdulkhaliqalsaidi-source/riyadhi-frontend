<template>
  <div>
    <template v-if="!isDashboard">
      <nav class="navbar" :class="{ scrolled: isScrolled }">
        <div class="container">
          <router-link to="/" class="navbar-brand">
            <div class="brand-logo">
              <img v-if="cfg('logo')" :src="cfg('logo')" alt="شعار الشركة" class="brand-logo-img" />
              <span v-else>🏗</span>
            </div>
            <div class="brand-text">
              <span class="name">{{ cfg('company_name_ar', 'الرياضي للمقاولات') }}</span>
              <span class="sub">AL-RIYADHI CONTRACTING</span>
            </div>
          </router-link>

          <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="القائمة">
            <span></span><span></span><span></span>
          </button>

          <ul class="navbar-links" :class="{ open: menuOpen }">
            <li
              v-for="sec in navItems" :key="sec.key"
              class="nav-item"
              :class="{ 'has-dropdown': sec.content?.children?.length }"
              @mouseenter="openDropdown = sec.key"
              @mouseleave="openDropdown = null"
            >
              <!-- Item with dropdown -->
              <template v-if="sec.content?.children?.length">
                <a class="nav-link nav-link--has-arrow"
                  :href="`#section-${sec.key}`"
                  @click.prevent="sec.isHome ? scrollToTop() : scrollTo(sec.key)">
                  {{ sec.label }}
                  <svg class="nav-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </a>
                <!-- Dropdown -->
                <div class="dropdown" :class="{ 'dropdown--open': openDropdown === sec.key }">
                  <div class="dropdown-inner">
                    <a
                      v-for="child in sec.content.children" :key="child.label"
                      class="dropdown-item"
                      :href="child.link || '#'"
                      @click.prevent="handleChildClick(child)"
                    >
                      <span v-if="child.icon" class="dropdown-item-icon">{{ child.icon }}</span>
                      <div class="dropdown-item-text">
                        <span class="dropdown-item-label">{{ child.label }}</span>
                        <span v-if="child.desc" class="dropdown-item-desc">{{ child.desc }}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </template>

              <!-- Simple item -->
              <template v-else>
                <a v-if="sec.isHome" href="/" class="nav-link" @click.prevent="scrollToTop">
                  {{ sec.label }}
                </a>
                <a v-else :href="`#section-${sec.key}`" class="nav-link" @click.prevent="scrollTo(sec.key)">
                  {{ sec.label }}
                </a>
              </template>
            </li>

            <li class="nav-item nav-cta">
              <router-link to="/contact" active-class="active">تواصل معنا</router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Mobile overlay -->
      <div v-if="menuOpen" class="menu-overlay" @click="menuOpen = false"></div>
    </template>

    <router-view />

    <template v-if="!isDashboard">
      <footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-brand-col">
              <div class="footer-logo">
                <div class="footer-logo-icon">
                  <img v-if="cfg('logo')" :src="cfg('logo')" alt="شعار الشركة" class="brand-logo-img" />
                  <span v-else>🏗</span>
                </div>
                <div>
                  <div class="footer-logo-name">{{ cfg('company_name_ar', 'الرياضي للمقاولات') }}</div>
                  <div class="footer-logo-sub">AL-RIYADHI CONTRACTING</div>
                </div>
              </div>
              <p class="footer-desc">{{ cfg('company_tagline_ar', 'نبني بثقة، نُسلّم بجودة') }}</p>
              <div class="footer-social">
                <a :href="`https://wa.me/${cfg('whatsapp_number','966500000000')}`" target="_blank" class="social-btn" title="واتساب">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a :href="`tel:${cfg('phone','0500000000')}`" class="social-btn" title="اتصل بنا">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </a>
              </div>
            </div>
            <div class="footer-nav-col">
              <div class="footer-nav-title">روابط سريعة</div>
              <ul class="footer-nav-list">
                <template v-for="sec in navItems" :key="sec.key">
                  <li><a v-if="sec.isHome" href="/" @click.prevent="scrollToTop">{{ sec.label }}</a>
                  <a v-else :href="`#section-${sec.key}`" @click.prevent="scrollTo(sec.key)">{{ sec.label }}</a></li>
                </template>
                <li><router-link to="/contact">تواصل معنا</router-link></li>
                <li><router-link to="/services">خدماتنا</router-link></li>
              </ul>
            </div>
            <div class="footer-contact-col">
              <div class="footer-nav-title">تواصل معنا</div>
              <ul class="footer-contact-list">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ cfg('location', 'المملكة العربية السعودية') }}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {{ cfg('phone', '0500000000') }}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ cfg('working_hours', 'السبت – الخميس: ٨ص – ٦م') }}
                </li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© {{ new Date().getFullYear() }} {{ cfg('company_name_ar', 'الرياضي للمقاولات') }} — {{ cfg('footer_text', 'جميع الحقوق محفوظة') }}</span>
            <div class="footer-bottom-badge">
              <span class="status-dot"></span>
              <span>متاح للمشاريع الجديدة</span>
            </div>
          </div>
        </div>
      </footer>

      <a :href="`https://wa.me/${cfg('whatsapp_number','966500000000')}`"
         target="_blank" rel="noopener" class="whatsapp-float" aria-label="واتساب">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettings } from './composables/useSettings'
import { useSections } from './composables/useSections'

const route      = useRoute()
const router     = useRouter()
const menuOpen   = ref(false)
const isScrolled = ref(false)
const openDropdown = ref(null)

const { load: loadSettings, get } = useSettings()
const { load: loadSections, navSections } = useSections()
const cfg = (key, fb = '') => get(key, fb)

const isDashboard = computed(() => route.path === '/dashboard')
const isHome      = computed(() => route.path === '/')
const navItems    = computed(() => navSections.value)

// Update site title from settings
watch(() => get('site_title'), (v) => { if (v) document.title = v }, { immediate: true })

// Handle child link click
function handleChildClick(child) {
  openDropdown.value = null
  menuOpen.value = false
  const link = child.link || ''
  if (link.startsWith('#section-')) {
    const key = link.replace('#section-', '')
    scrollTo(key)
  } else if (link.startsWith('/')) {
    router.push(link)
  } else if (link.startsWith('http')) {
    window.open(link, '_blank')
  }
}

function scrollToTop() {
  menuOpen.value = false
  openDropdown.value = null
  if (!isHome.value) {
    router.push('/').then(() => setTimeout(() => {
      const hero = document.getElementById('section-hero')
      if (hero) {
        window.scrollTo({ top: Math.max(0, hero.getBoundingClientRect().top + window.scrollY - 70), behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100))
    return
  }
  const hero = document.getElementById('section-hero')
  if (hero) {
    window.scrollTo({ top: Math.max(0, hero.getBoundingClientRect().top + window.scrollY - 70), behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function scrollTo(key) {
  menuOpen.value = false
  openDropdown.value = null

  function doScroll() {
    const el = document.getElementById(`section-${key}`)
    if (el) {
      window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 70), behavior: 'smooth' })
      return true
    }
    return false
  }

  if (!isHome.value) {
    router.push('/').then(() => {
      // Try multiple times after navigation
      let attempts = 0
      const interval = setInterval(() => {
        attempts++
        if (doScroll() || attempts >= 10) clearInterval(interval)
      }, 100)
    })
    return
  }
  doScroll()
}

function onScroll() { isScrolled.value = window.scrollY > 40 }
onMounted(async () => {
  window.addEventListener('scroll', onScroll)
  await Promise.all([loadSettings(), loadSections(true)])
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.menu-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 999;
  backdrop-filter: blur(2px);
}

/* Logo image */
.brand-logo-img { width: 100%; height: 100%; object-fit: contain; padding: 4px; border-radius: 8px; }

/* When logo exists, expand brand area */
.navbar-brand:has(.brand-logo-img) .brand-logo {
  width: auto;
  min-width: 120px;
  max-width: 180px;
  height: 44px;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
}
.navbar-brand:has(.brand-logo-img) .brand-logo-img {
  padding: 0;
  height: 44px;
  width: auto;
  max-width: 180px;
}
.navbar-brand:has(.brand-logo-img) .brand-text { display: none; }

/* ── Dropdown ── */
.nav-item { position: relative; display: flex; align-items: stretch; }

.nav-link {
  display: flex; align-items: center; gap: 5px;
  color: rgba(255,255,255,0.6);
  font-weight: 600; font-size: 0.92rem;
  padding: 0 18px; position: relative;
  transition: color var(--transition);
  white-space: nowrap; cursor: pointer;
  text-decoration: none;
}
.nav-link::after {
  content: '';
  position: absolute; bottom: 0; left: 18px; right: 18px;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-blue), var(--neon-cyan));
  transform: scaleX(0);
  transition: transform var(--transition);
  border-radius: 2px 2px 0 0;
}
.nav-link:hover { color: white; }
.nav-link:hover::after { transform: scaleX(1); }

.nav-arrow {
  transition: transform 0.2s;
  opacity: 0.6;
  flex-shrink: 0;
}
.has-dropdown:hover .nav-arrow { transform: rotate(180deg); opacity: 1; }

.dropdown {
  position: absolute;
  top: calc(100% + 1px);
  right: 0;
  min-width: 220px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
  z-index: 200;
  overflow: hidden;
}
.dropdown--open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.dropdown-inner { padding: 8px; }

.dropdown-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: all 0.15s;
  cursor: pointer;
}
.dropdown-item:hover {
  background: rgba(var(--accent-rgb), 0.1);
  color: white;
}
.dropdown-item-icon {
  font-size: 1.2rem;
  width: 32px; height: 32px;
  background: rgba(var(--accent-rgb), 0.1);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.dropdown-item-text { display: flex; flex-direction: column; gap: 1px; }
.dropdown-item-label { font-size: 0.88rem; font-weight: 700; }
.dropdown-item-desc  { font-size: 0.75rem; color: var(--text-muted); }

/* Mobile dropdown */
@media (max-width: 768px) {
  .dropdown {
    position: static; opacity: 1; visibility: visible; transform: none;
    box-shadow: none; border: none; border-radius: 0;
    background: rgba(255,255,255,0.04); margin: 4px 0; display: none;
  }
  .has-dropdown.mobile-open .dropdown { display: block; }
  .dropdown-item { padding: 10px 20px; }
}

/* ── Footer ── */
.footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 64px 0 0; position: relative; overflow: hidden; }
.footer::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 600px; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.4), transparent);
}
.footer-top { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 48px; padding-bottom: 48px; }
.footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.footer-logo-icon {
  width: 42px; height: 42px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; box-shadow: 0 4px 16px rgba(var(--accent-rgb),0.35);
}
.footer-logo-name { color: var(--text); font-size: 0.97rem; font-weight: 800; }
.footer-logo-sub { color: var(--neon-cyan); font-size: 0.58rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.75; }
.footer-desc { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; max-width: 280px; margin-bottom: 20px; }
.footer-social { display: flex; gap: 10px; }
.social-btn {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--glass); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); transition: all 0.2s var(--ease);
}
.social-btn:hover { background: rgba(var(--accent-rgb),0.1); border-color: var(--neon-blue); color: var(--neon-blue); transform: translateY(-2px); }
.footer-nav-title { font-size: 0.78rem; font-weight: 800; color: var(--text); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 18px; }
.footer-nav-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer-nav-list a { color: var(--text-muted); font-size: 0.9rem; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
.footer-nav-list a::before { content: ''; width: 0; height: 1px; background: var(--neon-blue); transition: width 0.2s; }
.footer-nav-list a:hover { color: var(--text); padding-right: 6px; }
.footer-nav-list a:hover::before { width: 12px; }
.footer-contact-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.footer-contact-list li { display: flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 0.88rem; }
.footer-contact-list svg { color: var(--neon-blue); flex-shrink: 0; }
.footer-bottom {
  border-top: 1px solid var(--border); padding: 20px 0;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  font-size: 0.82rem; color: var(--text-muted);
}
.footer-bottom-badge { display: flex; align-items: center; gap: 7px; font-size: 0.8rem; color: var(--text-muted); }
.status-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; animation: blink 2s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
@media (max-width: 900px) { .footer-top { grid-template-columns: 1fr 1fr; } .footer-brand-col { grid-column: 1/-1; } }
@media (max-width: 560px) { .footer-top { grid-template-columns: 1fr; } }
</style>
