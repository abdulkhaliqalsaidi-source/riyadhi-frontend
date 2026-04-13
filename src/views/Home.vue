<template>
  <div class="home-wrap">
    <!-- Hidden anchors for inactive sections that are in nav -->
    <div v-for="sec in sections.filter(s => !s.is_active && s.show_in_nav)" :key="`anchor-${sec.key}`"
      :id="`section-${sec.key}`" style="position:absolute;height:0;overflow:hidden;pointer-events:none">
    </div>

    <template v-for="sec in activeSections" :key="sec.key">

      <!-- ══ HERO ══ -->
      <section v-if="sec.type === 'hero'" :id="`section-${sec.key}`" class="hero">
        <!-- Background layers -->
        <div class="hero-bg" :style="`background-image:url('${img(sec.content?.image || 'hero')}')`"></div>
        <div class="hero-overlay"></div>
        <!-- Animated orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <!-- Grid lines -->
        <div class="hero-grid"></div>

        <div class="container hero-inner">
          <div class="hero-content">
            <div class="hero-badge" v-animate="'fade-down'">
              <span class="badge-dot"></span>
              <span>{{ cfg('hero_badge', sec.content?.badge || 'شركة مقاولات معتمدة') }}</span>
            </div>
            <h1 class="hero-title" v-animate="'fade-up'" style="transition-delay:0.1s">
              {{ sec.content?.title || cfg('hero_title', 'الرياضي للمقاولات') }}
            </h1>
            <p class="hero-sub" v-animate="'fade-up'" style="transition-delay:0.2s">{{ sec.content?.subtitle || cfg('hero_subtitle') }}</p>
            <div class="hero-actions" v-animate="'fade-up'" style="transition-delay:0.3s">
              <a href="#section-services" @click.prevent="scrollTo('services')" class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                {{ sec.content?.btn1 || cfg('hero_btn1', 'خدماتنا') }}
              </a>
              <a :href="`https://wa.me/${cfg('whatsapp_number','966500000000')}`" target="_blank" class="btn btn-glass">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {{ sec.content?.btn2 || cfg('hero_btn2', 'واتساب') }}
              </a>
            </div>
          </div>
          <!-- Stats -->
          <div class="hero-stats" v-animate="'fade-left'" style="transition-delay:0.4s">
            <div class="stat-card" v-for="stat in heroStats" :key="stat.label">
              <div class="stat-num">{{ stat.num }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        <div class="scroll-hint">
          <div class="scroll-mouse"><div class="scroll-wheel"></div></div>
        </div>
      </section>

      <!-- ══ PARTNERS STRIP ══ -->
      <PartnersStrip v-if="sec.type === 'partners'" :key="`partners-${sec.key}`" :section="sec" />

      <!-- ══ ABOUT ══ -->
      <section v-if="sec.type === 'about'" :id="`section-${sec.key}`" class="about-section">
        <div class="container about-grid">
          <div class="about-visual" v-animate="'fade-right'">
            <div class="about-img-frame">
              <img :src="img(sec.content?.image || 'about')" :alt="sec.label" class="about-img" loading="lazy" />
              <div class="about-img-overlay"></div>
            </div>
            <div class="about-float-card glass-card">
              <div class="float-icon">🏆</div>
              <div>
                <strong>{{ sec.content?.since || cfg('about_since') }}</strong>
                <span>خبرة موثوقة</span>
              </div>
            </div>
            <div class="about-stats-strip">
              <div class="strip-stat" v-for="stat in heroStats" :key="stat.label">
                <strong>{{ stat.num }}</strong>
                <span>{{ stat.label }}</span>
              </div>
            </div>
          </div>
          <div class="about-text" v-animate="'fade-left'">
            <div class="sec-tag">{{ sec.label }}</div>
            <h2>{{ sec.content?.title || cfg('about_title') }}</h2>
            <div class="accent-line"></div>
            <p>{{ sec.content?.text || cfg('about_text') }}</p>
            <ul class="about-features">
              <li v-for="f in (sec.content?.features || [])" :key="f">
                <span class="check-icon">
                  <svg width="10" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
                {{ f }}
              </li>
            </ul>
            <router-link to="/contact" class="btn btn-primary" style="margin-top:32px">
              احصل على عرض سعر
            </router-link>
          </div>
        </div>
      </section>

      <!-- ══ SERVICES ══ -->
      <section v-if="sec.type === 'services'" :id="`section-${sec.key}`" class="services-section">
        <div class="container">
          <div class="sec-header" v-animate="'fade-up'">
            <div class="sec-tag">{{ sec.label }}</div>
            <h2>{{ sec.content?.title || 'ماذا نقدم لك' }}</h2>
            <p>{{ sec.content?.subtitle || '' }}</p>
            <div class="gold-line"></div>
          </div>
          <div class="services-grid">
            <div class="svc-card" v-for="(sv, i) in (sec.content?.services?.length ? sec.content.services : services)" :key="sv.id || i"
              v-animate="'zoom-in'" :style="`transition-delay:${i * 100}ms`">
              <div class="svc-img-wrap">
                <img :src="img(sv.image || sv.icon)" :alt="sv.name_ar" class="svc-img" loading="lazy" />
                <div class="svc-img-overlay"></div>
                <div class="svc-num-badge">0{{ i + 1 }}</div>
              </div>
              <div class="svc-body">
                <h3>{{ sv.name_ar }}</h3>
                <p>{{ sv.description_ar }}</p>
                <a :href="`https://wa.me/${cfg('whatsapp_number','966500000000')}`" target="_blank" class="svc-link">
                  اطلب الخدمة
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div class="services-cta">
            <router-link to="/services" class="btn btn-dark">عرض جميع الخدمات</router-link>
          </div>
        </div>
      </section>

      <!-- ══ CTA ══ -->
      <section v-if="sec.type === 'cta'" :id="`section-${sec.key}`" class="cta-banner">
        <div class="cta-bg" :style="`background-image:url('${img(sec.content?.image || 'cta')}')`"></div>
        <div class="cta-overlay"></div>
        <div class="orb orb-cta-1"></div>
        <div class="orb orb-cta-2"></div>
        <div class="container cta-inner">
          <div class="cta-text" v-animate="'fade-right'">
            <h2>{{ sec.content?.title || cfg('cta_title') }}</h2>
            <p>{{ sec.content?.subtitle || cfg('cta_subtitle') }}</p>
          </div>
          <div class="cta-actions" v-animate="'fade-left'">
            <router-link to="/contact" class="btn btn-primary">{{ sec.content?.btn1 || 'تواصل معنا' }}</router-link>
            <a :href="`https://wa.me/${cfg('whatsapp_number','966500000000')}`" target="_blank" class="btn btn-glass">{{ sec.content?.btn2 || 'واتساب مباشر' }}</a>
          </div>
        </div>
      </section>

      <!-- ══ CUSTOM ══ -->
      <section v-if="sec.type === 'custom'"
        :id="`section-${sec.key}`" class="custom-section">
        <div class="container">
          <div v-if="sec.content?.title" class="sec-header">
            <div class="sec-tag">{{ sec.label }}</div>
            <h2>{{ sec.content.title }}</h2>
            <div class="gold-line"></div>
          </div>

          <!-- Render blocks -->
          <!-- Render blocks -->
          <template v-for="(row, ri) in groupedBlocks(sec.content?.blocks)" :key="ri">
            <div :class="row.length > 1 ? 'blocks-row' : 'blocks-single'">
              <template v-for="block in row" :key="block.id">
                <div :class="['block-wrap', `block-wrap--${block.layout?.width||'full'}`, row.length > 1 ? `block-col--${block.layout?.inline||'1/2'}` : '']"
                  :style="blockWrapStyle(block)">

            <!-- TEXT -->
            <div v-if="block.type === 'text'" class="block-text"
              v-animate="'fade-up'">
              <div v-if="block.data.title || block.data.text" :style="`text-align:${block.data.align || 'right'}`">
                <h2 v-if="block.data.title" class="block-title">{{ block.data.title }}</h2>
                <div v-if="block.data.title && block.data.align === 'center'" class="gold-line" style="margin:14px auto"></div>
                <div v-else-if="block.data.title" class="gold-line" style="margin:14px 0"></div>
                <p v-if="block.data.text" class="block-body" :style="block.data.align === 'center' ? 'margin:0 auto' : ''">{{ block.data.text }}</p>
              </div>
            </div>

            <!-- IMAGE_TEXT -->
            <div v-else-if="block.type === 'image_text'" class="block-image-text"
              :class="{ 'block-image-text--reverse': block.data.image_side === 'left' }"
              v-animate="block.data.image_side === 'left' ? 'fade-right' : 'fade-left'">
              <div class="bit-img-wrap">
                <img :src="img(block.data.image || 'about')" :alt="block.data.title" loading="lazy" />
              </div>
              <div class="bit-body">
                <h2 v-if="block.data.title" class="block-title">{{ block.data.title }}</h2>
                <div class="gold-line" style="margin:12px 0"></div>
                <p v-if="block.data.text" class="block-body">{{ block.data.text }}</p>
                <a v-if="block.data.btn_text" :href="block.data.btn_link || '#'" class="btn btn-primary" style="margin-top:20px">
                  {{ block.data.btn_text }}
                </a>
              </div>
            </div>

            <!-- CARDS -->
            <div v-else-if="block.type === 'cards'" class="block-cards">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:32px">{{ block.data.title }}</h2>
              <div class="block-cards-grid"
                :style="`grid-template-columns: repeat(${block.data.cols || 3}, 1fr)`">
                <div class="block-card" v-for="(card, ci) in (block.data.cards || [])" :key="ci"
                  v-animate="'zoom-in'" :style="`transition-delay:${ci * 100}ms`">
                  <div class="block-card-icon">{{ card.icon }}</div>
                  <h3>{{ card.title }}</h3>
                  <p>{{ card.text }}</p>
                </div>
              </div>
            </div>

            <!-- STATS -->
            <div v-else-if="block.type === 'stats'" class="block-stats">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:28px">{{ block.data.title }}</h2>
              <div class="block-stats-grid"
                :style="`grid-template-columns: repeat(${block.data.cols || 4}, 1fr)`">
                <div class="block-stat" v-for="(stat, si) in (block.data.stats || [])" :key="si"
                  v-animate="'fade-up'" :style="`transition-delay:${si * 80}ms`">
                  <div class="block-stat-icon">{{ stat.icon }}</div>
                  <div class="block-stat-num">{{ stat.num }}</div>
                  <div class="block-stat-label">{{ stat.label }}</div>
                </div>
              </div>
            </div>

            <!-- CTA_BUTTON -->
            <div v-else-if="block.type === 'cta_button'" class="block-cta"
              :class="`block-cta--${block.data.bg || 'dark'}`"
              v-animate="'zoom-in'">
              <h2 v-if="block.data.title">{{ block.data.title }}</h2>
              <p v-if="block.data.text">{{ block.data.text }}</p>
              <div class="block-cta-btns">
                <a v-if="block.data.btn1_text" :href="block.data.btn1_link || '#'" class="btn btn-primary">
                  {{ block.data.btn1_text }}
                </a>
                <a v-if="block.data.btn2_text" :href="block.data.btn2_link || '#'" class="btn btn-outline">
                  {{ block.data.btn2_text }}
                </a>
              </div>
            </div>

            <!-- GALLERY — marquee متحرك -->
            <div v-else-if="block.type === 'gallery'" class="block-gallery" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:32px">{{ block.data.title }}</h2>
              <div class="gallery-marquee-wrap" v-if="block.data.images?.length">
                <div class="gallery-fade gallery-fade--right"></div>
                <div class="gallery-fade gallery-fade--left"></div>
                <div class="gallery-marquee">
                  <div class="gallery-track" :style="`--count:${block.data.images.length}`">
                    <div class="gallery-item"
                      v-for="(img, gi) in [...block.data.images, ...block.data.images, ...block.data.images]"
                      :key="gi"
                    >
                      <img :src="img.image" :alt="img.caption || ''" loading="lazy" />
                      <div v-if="img.caption" class="gallery-caption">{{ img.caption }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- DIVIDER -->
            <div v-else-if="block.type === 'divider'" class="block-divider"
              :class="`block-divider--${block.data.style || 'line'}`"></div>

            <!-- VIDEO -->
            <div v-else-if="block.type === 'video'" class="block-video" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:24px">{{ block.data.title }}</h2>
              <div class="video-wrap" :class="`video-wrap--${block.data.height||'md'}`">
                <iframe v-if="block.data.url" :src="getVideoEmbed(block.data.url)" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                <div v-else class="video-placeholder">🎬 أضف رابط الفيديو من الداشبورد</div>
              </div>
            </div>

            <!-- MAP -->
            <div v-else-if="block.type === 'map'" class="block-map" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:24px">{{ block.data.title }}</h2>
              <div class="map-wrap" :class="`map-wrap--${block.data.height||'md'}`">
                <iframe v-if="block.data.url" :src="block.data.url" frameborder="0" allowfullscreen loading="lazy"></iframe>
                <div v-else class="video-placeholder">🗺️ أضف رابط الخريطة من الداشبورد</div>
              </div>
            </div>

            <!-- FAQ -->
            <div v-else-if="block.type === 'faq'" class="block-faq" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:32px">{{ block.data.title }}</h2>
              <div class="faq-list">
                <div class="faq-item" v-for="(item, fi) in block.data.items" :key="fi" :class="{ open: faqOpen[`${block.id}-${fi}`] }">
                  <button class="faq-q" @click="toggleFaq(block.id, fi)">
                    <span>{{ item.q }}</span>
                    <span class="faq-arrow">{{ faqOpen[`${block.id}-${fi}`] ? '−' : '+' }}</span>
                  </button>
                  <div class="faq-a" v-show="faqOpen[`${block.id}-${fi}`]">{{ item.a }}</div>
                </div>
              </div>
            </div>

            <!-- TIMELINE -->
            <div v-else-if="block.type === 'timeline'" class="block-timeline" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:40px">{{ block.data.title }}</h2>
              <div class="timeline-list">
                <div class="timeline-item" v-for="(step, ti) in block.data.steps" :key="ti" v-animate="'fade-right'" :style="`transition-delay:${ti*100}ms`">
                  <div class="timeline-icon">{{ step.icon || '🎯' }}</div>
                  <div class="timeline-line" v-if="ti < block.data.steps.length - 1"></div>
                  <div class="timeline-body">
                    <strong>{{ step.title }}</strong>
                    <p>{{ step.text }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- TEAM -->
            <div v-else-if="block.type === 'team'" class="block-team" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:36px">{{ block.data.title }}</h2>
              <div class="team-grid">
                <div class="team-card" v-for="(m, mi) in block.data.members" :key="mi" v-animate="'zoom-in'" :style="`transition-delay:${mi*100}ms`">
                  <div class="team-img-wrap">
                    <img v-if="m.image" :src="m.image" :alt="m.name" />
                    <div v-else class="team-img-placeholder">👤</div>
                  </div>
                  <div class="team-info">
                    <strong>{{ m.name }}</strong>
                    <span class="team-role">{{ m.role }}</span>
                    <p v-if="m.bio">{{ m.bio }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- TESTIMONIALS -->
            <div v-else-if="block.type === 'testimonials'" class="block-testimonials" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:36px">{{ block.data.title }}</h2>
              <div class="testimonials-grid">
                <div class="testimonial-card" v-for="(t, ti) in block.data.items" :key="ti" v-animate="'zoom-in'" :style="`transition-delay:${ti*100}ms`">
                  <div class="testimonial-stars">{{ '⭐'.repeat(t.stars || 5) }}</div>
                  <p class="testimonial-text">"{{ t.text }}"</p>
                  <div class="testimonial-author">
                    <img v-if="t.image" :src="t.image" :alt="t.name" class="testimonial-avatar" />
                    <div v-else class="testimonial-avatar-placeholder">{{ t.name?.charAt(0) || '?' }}</div>
                    <div>
                      <strong>{{ t.name }}</strong>
                      <span>{{ t.role }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- COUNTER -->
            <div v-else-if="block.type === 'counter'" class="block-counter" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:36px">{{ block.data.title }}</h2>
              <div class="counter-grid">
                <div class="counter-item" v-for="(c, ci) in block.data.counters" :key="ci">
                  <div class="counter-icon">{{ c.icon }}</div>
                  <div class="counter-num">{{ c.prefix }}{{ c.target }}{{ c.suffix }}</div>
                  <div class="counter-label">{{ c.label }}</div>
                </div>
              </div>
            </div>

            <!-- PRICE LIST -->
            <div v-else-if="block.type === 'price_list'" class="block-price" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:36px">{{ block.data.title }}</h2>
              <div class="price-grid">
                <div class="price-card" v-for="(pkg, pi) in block.data.packages" :key="pi" :class="{ 'price-card--featured': pkg.featured }" v-animate="'zoom-in'" :style="`transition-delay:${pi*100}ms`">
                  <div v-if="pkg.featured" class="price-badge">الأكثر طلباً</div>
                  <div class="price-name">{{ pkg.name }}</div>
                  <div class="price-amount">{{ pkg.price }}</div>
                  <div class="price-desc">{{ pkg.desc }}</div>
                  <ul class="price-features">
                    <li v-for="f in (pkg.features||'').split('\n').filter(Boolean)" :key="f">✅ {{ f }}</li>
                  </ul>
                  <a v-if="pkg.btn" :href="pkg.link || '/contact'" class="btn btn-primary" style="width:100%;text-align:center;margin-top:auto">{{ pkg.btn }}</a>
                </div>
              </div>
            </div>

            <!-- SLIDER -->
            <div v-else-if="block.type === 'slider'" class="block-slider" v-animate="'fade-up'">
              <h2 v-if="block.data.title" class="block-title" style="text-align:center;margin-bottom:28px">{{ block.data.title }}</h2>
              <div class="slider-wrap" :class="`slider-wrap--${block.data.height || 'md'}`"
                @mouseenter="pauseSlider(block.id)"
                @mouseleave="resumeSlider(block.id, (block.data.slides || []).length, block.data.autoplay)"
              >
                <div class="slider-track"
                  :style="`transform: translateX(${currentSlide(block.id) * 100}%)`"
                >
                  <div class="slide" v-for="(slide, si) in (block.data.slides || [])" :key="si">
                    <img v-if="slide.image" :src="slide.image" :alt="slide.title || ''" loading="lazy" />
                    <div v-if="slide.title || slide.text" class="slide-caption">
                      <strong v-if="slide.title">{{ slide.title }}</strong>
                      <span v-if="slide.text">{{ slide.text }}</span>
                    </div>
                  </div>
                </div>
                <!-- Controls -->
                <button class="slider-btn slider-btn--prev" @click="prevSlide(block.id, (block.data.slides || []).length)" aria-label="السابق">‹</button>
                <button class="slider-btn slider-btn--next" @click="nextSlide(block.id, (block.data.slides || []).length)" aria-label="التالي">›</button>
                <!-- Dots -->
                <div class="slider-dots">
                  <button
                    v-for="(_, di) in (block.data.slides || [])" :key="di"
                    class="slider-dot" :class="{ active: sliderIndex(block.id) === di }"
                    @click="setSlide(block.id, di)"
                    :aria-label="`شريحة ${di+1}`"
                  ></button>
                </div>
                <!-- Progress bar -->
                <div class="slider-progress" v-if="block.data.autoplay !== false">
                  <div class="slider-progress-bar" :class="{ paused: sliderPaused[block.id] }"
                    :key="`${block.id}-${sliderIndex(block.id)}`"></div>
                </div>
              </div>
            </div>

                </div><!-- /block-wrap -->
              </template>
            </div><!-- /blocks-row or blocks-single -->
          </template>
        </div>
      </section>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../api'
import PartnersStrip from '../components/PartnersStrip.vue'
import { useSettings } from '../composables/useSettings'
import { useSections } from '../composables/useSections'
import { IMAGES } from '../assets/images.js'

const { load: loadSettings, get } = useSettings()
const { load: loadSections, activeSections, sections } = useSections()
const cfg = (key, fb = '') => get(key, fb)
const img = (key) => {
  if (!key) return IMAGES.other
  if (key.startsWith('http') || key.startsWith('/')) return key
  return IMAGES[key] || IMAGES.other
}

const faqOpen = ref({})
function toggleFaq(blockId, idx) {
  const key = `${blockId}-${idx}`
  faqOpen.value[key] = !faqOpen.value[key]
}
function getVideoEmbed(url) {
  if (!url) return ''
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return url
}

const widthMap = { narrow: '640px', full: '100%', wide: '1400px' }
const sizeMap  = { sm: '0.85', md: '1', lg: '1.18' }

function blockWrapClass(block) {
  return ['block-wrap', `block-wrap--${block.layout?.width || 'full'}`]
}
function blockWrapStyle(block) {
  const scale = sizeMap[block.layout?.size || 'md']
  return scale !== '1' ? `font-size:${scale}em` : ''
}

// Group consecutive inline blocks into rows
function groupedBlocks(blocks) {
  if (!blocks?.length) return []
  const rows = []
  let currentRow = []
  for (const block of blocks.filter(b => b && b.data)) {
    if (block.layout?.inline && block.layout.inline !== false) {
      currentRow.push(block)
    } else {
      if (currentRow.length) { rows.push(currentRow); currentRow = [] }
      rows.push([block])
    }
  }
  if (currentRow.length) rows.push(currentRow)
  return rows
}
const services = ref([])
const sliderStates = ref({})
const sliderPaused = ref({})
const sliderTimers = ref({})

function currentSlide(id) {
  return -(sliderStates.value[id] ?? 0)
}
function sliderIndex(id) {
  return sliderStates.value[id] ?? 0
}
function nextSlide(id, total) {
  if (!total) return
  const cur = sliderStates.value[id] ?? 0
  sliderStates.value[id] = (cur + 1) % total
}
function prevSlide(id, total) {
  if (!total) return
  const cur = sliderStates.value[id] ?? 0
  sliderStates.value[id] = (cur - 1 + total) % total
}
function setSlide(id, idx) {
  sliderStates.value[id] = idx
}
function pauseSlider(id) {
  sliderPaused.value[id] = true
  if (sliderTimers.value[id]) {
    clearInterval(sliderTimers.value[id])
    sliderTimers.value[id] = null
  }
}
function resumeSlider(id, total, autoplay) {
  sliderPaused.value[id] = false
  if (autoplay !== false && total > 1) {
    sliderTimers.value[id] = setInterval(() => nextSlide(id, total), 4000)
  }
}
function startAutoplay(id, total) {
  if (total > 1) {
    sliderTimers.value[id] = setInterval(() => nextSlide(id, total), 4000)
  }
}
onUnmounted(() => {
  Object.values(sliderTimers.value).forEach(t => t && clearInterval(t))
})
const heroStats = computed(() => [
  { num: cfg('stat1_num', '+200'), label: cfg('stat1_label', 'مشروع منجز') },
  { num: cfg('stat2_num', '+500'), label: cfg('stat2_label', 'عميل راضٍ') },
  { num: cfg('stat3_num', '+10'),  label: cfg('stat3_label', 'سنوات خبرة') },
])

function scrollTo(key) {
  const el = document.getElementById(`section-${key}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  await Promise.all([loadSettings(), loadSections(true)])
  try { const { data } = await api.get('/services'); services.value = data }
  catch { services.value = [] }

  // Start autoplay for any slider blocks in custom sections
  activeSections.value.forEach(sec => {
    if (sec.type === 'custom') {
      (sec.content?.blocks || []).forEach(block => {
        if (block.type === 'slider' && block.data.autoplay !== false) {
          startAutoplay(block.id, (block.data.slides || []).length)
        }
      })
    }
  })
})
</script>


<style scoped>
.home-wrap { background: var(--bg); }

/* ══ HERO ══ */
.hero {
  position: relative; min-height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  overflow: hidden; padding-top: 70px;
}
.hero-bg {
  position: absolute; inset: 0; background-size: cover; background-position: center;
  transform: scale(1.06); transition: transform 12s ease;
  filter: brightness(0.3) saturate(0.7);
}
.hero:hover .hero-bg { transform: scale(1); }
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, rgba(3,7,18,0.92) 0%, rgba(10,15,30,0.75) 50%, rgba(3,7,18,0.95) 100%);
}
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(59,130,246,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.035) 1px, transparent 1px);
  background-size: 72px 72px;
}
.orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
.orb-1 { width: 600px; height: 600px; background: rgba(59,130,246,0.1); top: -150px; right: -150px; animation: orb-float 9s ease-in-out infinite; }
.orb-2 { width: 500px; height: 500px; background: rgba(139,92,246,0.08); bottom: -100px; left: -100px; animation: orb-float 11s ease-in-out infinite reverse; }
.orb-3 { width: 350px; height: 350px; background: rgba(6,182,212,0.07); top: 35%; left: 35%; animation: orb-float 14s ease-in-out infinite 3s; }

.hero-inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr 280px; gap: 64px; align-items: center; width: 100%;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2);
  color: #93c5fd; padding: 6px 16px; border-radius: 50px;
  font-size: 0.8rem; font-weight: 700; margin-bottom: 22px; letter-spacing: 0.5px;
}
.badge-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 10px #4ade80; animation: blink 1.8s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

.hero-title {
  padding-top: 20px;
  height: 120px;
  font-size: clamp(2.6rem, 5.5vw, 4.4rem); font-weight: 900; line-height: 1.1;
  background: linear-gradient(160deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  letter-spacing: -0.02em;
}
.hero-sub {
  color: rgba(255,255,255,0.5); font-size: 1.08rem; line-height: 1.85;
  margin-top: 20px; max-width: 520px;
}
.hero-actions { display: flex; gap: 14px; margin-top: 36px; flex-wrap: wrap; }

.btn-glass {
  display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 50px;
  font-family: 'Tajawal', sans-serif; font-size: 0.97rem; font-weight: 700;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: white; backdrop-filter: blur(16px); transition: all 0.3s var(--ease); cursor: pointer;
}
.btn-glass:hover { background: rgba(255,255,255,0.1); border-color: rgba(59,130,246,0.4); box-shadow: 0 0 28px rgba(59,130,246,0.15); }

/* Stats sidebar */
.hero-stats { display: flex; flex-direction: column; gap: 12px; }
.stat-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  border-radius: var(--radius); padding: 18px 22px; text-align: center;
  backdrop-filter: blur(20px); position: relative; overflow: hidden;
  transition: all 0.35s var(--ease);
}
.stat-card::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.07));
  opacity: 0; transition: opacity 0.3s;
}
.stat-card:hover { border-color: rgba(59,130,246,0.25); transform: translateX(-5px); }
.stat-card:hover::before { opacity: 1; }
.stat-num {
  font-size: 1.9rem; font-weight: 900;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-cyan));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.stat-label { font-size: 0.76rem; color: rgba(255,255,255,0.38); margin-top: 4px; letter-spacing: 0.5px; }

.scroll-hint { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); opacity: 0.4; }
.scroll-mouse { width: 22px; height: 36px; border: 2px solid rgba(59,130,246,0.35); border-radius: 11px; display: flex; justify-content: center; padding-top: 5px; }
.scroll-wheel { width: 3px; height: 7px; background: var(--neon-blue); border-radius: 2px; animation: scroll-down 2s ease-in-out infinite; }
@keyframes scroll-down { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(12px);opacity:0} }

/* ══ ABOUT ══ */
.about-section {
  padding: 110px 0; background: var(--bg2); position: relative; overflow: hidden;
}
.about-section::before {
  content: ''; position: absolute; top: -300px; right: -200px;
  width: 700px; height: 700px; border-radius: 50%;
  background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 65%);
  pointer-events: none;
}
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 88px; align-items: center; }
.about-visual { position: relative; }
.about-img-frame {
  position: relative; border-radius: var(--radius-xl); overflow: hidden; height: 500px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px var(--border);
}
.about-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s var(--ease); }
.about-img-frame:hover .about-img { transform: scale(1.04); }
.about-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(3,7,18,0.55) 0%, transparent 55%); }

/* Floating badge */
.about-float-card {
  position: absolute; top: 28px; left: -24px;
  background: rgba(10,15,30,0.9); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 14px 18px;
  display: flex; align-items: center; gap: 12px;
  backdrop-filter: blur(20px); box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}
.float-icon { font-size: 1.6rem; }
.about-float-card strong { display: block; font-size: 0.9rem; font-weight: 800; color: var(--text); }
.about-float-card span { font-size: 0.74rem; color: var(--text-muted); }

/* Stats strip */
.about-stats-strip {
  position: absolute; bottom: -22px; left: 16px; right: 16px;
  background: rgba(5,10,25,0.95); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px 20px;
  display: flex; justify-content: space-around;
  backdrop-filter: blur(24px); box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}
.strip-stat { text-align: center; }
.strip-stat strong {
  display: block; font-size: 1.25rem; font-weight: 900;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-cyan));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.strip-stat span { font-size: 0.7rem; color: var(--text-muted); }

.about-text { padding-bottom: 24px; }
.about-text h2 { font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 900; color: var(--text); line-height: 1.25; margin-top: 14px; letter-spacing: -0.01em; }
.about-text p { color: var(--text-muted); line-height: 1.9; font-size: 1rem; margin-top: 18px; }
.accent-line { width: 52px; height: 3px; background: linear-gradient(90deg, var(--neon-blue), var(--neon-cyan)); border-radius: 3px; margin-top: 18px; }
.about-features { list-style: none; margin-top: 22px; display: flex; flex-direction: column; gap: 12px; }
.about-features li { display: flex; align-items: center; gap: 12px; color: var(--text); font-size: 0.97rem; }
.check-icon {
  width: 22px; height: 22px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(59,130,246,0.35);
}

/* ══ SERVICES ══ */
.services-section { padding: 110px 0; background: var(--bg); }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.svc-card {
  background: var(--glass); border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg); overflow: hidden;
  transition: all 0.4s var(--ease); position: relative;
}
.svc-card::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(59,130,246,0.04), rgba(139,92,246,0.04));
  opacity: 0; transition: opacity 0.3s;
}
.svc-card:hover { transform: translateY(-10px); border-color: rgba(59,130,246,0.28); box-shadow: 0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(59,130,246,0.1); }
.svc-card:hover::after { opacity: 1; }
.svc-img-wrap { position: relative; height: 210px; overflow: hidden; }
.svc-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s var(--ease); }
.svc-card:hover .svc-img { transform: scale(1.1); }
.svc-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(3,7,18,0.75) 0%, transparent 55%); }
.svc-num-badge {
  position: absolute; top: 14px; right: 14px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  color: white; font-size: 0.72rem; font-weight: 900;
  padding: 4px 12px; border-radius: 50px; letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(59,130,246,0.4);
}
.svc-body { padding: 24px; position: relative; z-index: 1; }
.svc-body h3 { font-size: 1.08rem; font-weight: 800; color: var(--text); margin-bottom: 10px; }
.svc-body p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.75; }
.svc-link {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 16px;
  color: var(--neon-blue); font-weight: 700; font-size: 0.88rem; transition: gap 0.25s;
}
.svc-link:hover { gap: 12px; }
.services-cta { text-align: center; margin-top: 52px; }

/* ══ CTA ══ */
.cta-banner { position: relative; padding: 110px 0; overflow: hidden; }
.cta-bg { position: absolute; inset: 0; background-size: cover; background-position: center; filter: brightness(0.22) saturate(0.5); }
.cta-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(3,7,18,0.92), rgba(10,15,30,0.88)); }
.orb-cta-1 { width: 500px; height: 500px; background: rgba(59,130,246,0.12); top: -120px; right: -120px; animation: orb-float 9s ease-in-out infinite; }
.orb-cta-2 { width: 400px; height: 400px; background: rgba(139,92,246,0.1); bottom: -100px; left: -100px; animation: orb-float 11s ease-in-out infinite reverse; }
.cta-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 48px; flex-wrap: wrap; }
.cta-text h2 { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 900; color: white; letter-spacing: -0.01em; }
.cta-text p { color: rgba(255,255,255,0.48); margin-top: 12px; font-size: 1.02rem; max-width: 500px; line-height: 1.75; }
.cta-actions { display: flex; gap: 14px; flex-wrap: wrap; }

/* ══ CUSTOM ══ */
.custom-section { padding: 88px 0; background: var(--bg); }
.block-text { margin-bottom: 40px; }
.block-title { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 900; color: var(--text); margin-bottom: 0; letter-spacing: -0.01em; }
.block-body  { color: var(--text-muted); line-height: 1.9; font-size: 1rem; max-width: 720px; margin-top: 16px; }
.block-image-text { display: grid; grid-template-columns: 1fr 1.2fr; gap: 64px; align-items: center; margin-bottom: 64px; }
.block-image-text--reverse { direction: ltr; }
.block-image-text--reverse .bit-body { direction: rtl; }
.bit-img-wrap { border-radius: var(--radius-lg); overflow: hidden; height: 380px; box-shadow: var(--shadow-lg); }
.bit-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s; }
.bit-img-wrap:hover img { transform: scale(1.04); }
.block-cards { margin-bottom: 64px; }
.block-cards-grid { display: grid; gap: 20px; }
.block-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 30px 24px; text-align: center; border-bottom: 3px solid var(--neon-blue); transition: all 0.35s var(--ease); }
.block-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.35), var(--glow-blue); border-color: rgba(59,130,246,0.3); }
.block-card-icon { font-size: 2.2rem; margin-bottom: 16px; }
.block-card h3 { font-size: 1rem; font-weight: 800; color: var(--text); margin-bottom: 8px; }
.block-card p  { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; }
.block-stats { margin-bottom: 64px; }
.block-stats-grid { display: grid; gap: 16px; }
.block-stat { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px 20px; text-align: center; transition: all 0.3s var(--ease); }
.block-stat:hover { border-color: rgba(59,130,246,0.25); transform: translateY(-4px); }
.block-stat-icon { font-size: 1.8rem; margin-bottom: 12px; }
.block-stat-num { font-size: 2.2rem; font-weight: 900; background: linear-gradient(135deg, var(--neon-blue), var(--neon-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.block-stat-label { font-size: 0.82rem; color: var(--text-muted); margin-top: 6px; }
.block-cta { border-radius: var(--radius-xl); padding: 64px 40px; text-align: center; margin-bottom: 52px; border: 1px solid var(--border); }
.block-cta--dark  { background: var(--bg2); }
.block-cta--dark h2, .block-cta--dark p { color: var(--text); }
.block-cta--gold  { background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); }
.block-cta--gold h2, .block-cta--gold p { color: white; }
.block-cta--light { background: var(--bg); }
.block-cta--light h2 { color: var(--text); }
.block-cta--light p  { color: var(--text-muted); }
.block-cta h2 { font-size: clamp(1.4rem,3vw,2rem); font-weight: 900; margin-bottom: 12px; letter-spacing: -0.01em; }
.block-cta p  { font-size: 1rem; line-height: 1.75; margin-bottom: 28px; max-width: 500px; margin-inline: auto; }
.block-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.block-divider { margin: 36px 0; }
.block-divider--line  { border-top: 1px solid var(--border); }
.block-divider--gold  { border-top: 3px solid var(--neon-blue); width: 80px; margin-inline: auto; border-radius: 2px; }
.block-divider--space { height: 48px; }

/* ══ BLOCK WRAPPER — size & width & direction ══ */
.blocks-row    { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
.blocks-single { display: block; }
.block-wrap { width: 100%; min-width: 0; }
.block-wrap--narrow  { max-width: 640px;  margin-inline: auto; }
.block-wrap--full    { max-width: 100%; }
.block-wrap--wide    { max-width: 1400px; margin-inline: auto; }
/* Column widths inside a row */
.block-col--1\/2 { flex: 1 1 calc(50% - 12px); }
.block-col--1\/3 { flex: 1 1 calc(33.33% - 16px); }
.block-col--2\/3 { flex: 2 1 calc(66.66% - 8px); }
@media (max-width: 768px) {
  .blocks-row { flex-direction: column; }
  .block-col--1\/2, .block-col--1\/3, .block-col--2\/3 { flex: 1 1 100%; }
}

/* ══ VIDEO & MAP ══ */
.block-video, .block-map { margin-bottom: 52px; }
.video-wrap, .map-wrap { border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border); background: var(--bg2); }
.video-wrap--sm, .map-wrap--sm { height: 300px; }
.video-wrap--md, .map-wrap--md { height: 480px; }
.video-wrap--lg, .map-wrap--lg { height: 600px; }
.video-wrap iframe, .map-wrap iframe { width: 100%; height: 100%; display: block; }
.video-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 1.5rem; }

/* ══ FAQ ══ */
.block-faq { margin-bottom: 52px; }
.faq-list { display: flex; flex-direction: column; gap: 8px; max-width: 800px; margin: 0 auto; }
.faq-item { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: border-color 0.2s; }
.faq-item.open { border-color: rgba(var(--accent-rgb),0.4); }
.faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: var(--bg2); border: none; color: var(--text); font-family: 'Tajawal',sans-serif; font-size: 0.97rem; font-weight: 700; cursor: pointer; text-align: right; gap: 12px; transition: background 0.2s; }
.faq-q:hover { background: var(--glass); }
.faq-arrow { font-size: 1.3rem; font-weight: 400; color: var(--neon-blue); flex-shrink: 0; }
.faq-a { padding: 14px 20px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.8; background: var(--bg); border-top: 1px solid var(--border); }

/* ══ TIMELINE ══ */
.block-timeline { margin-bottom: 52px; }
.timeline-list { display: flex; flex-direction: column; gap: 0; max-width: 700px; margin: 0 auto; position: relative; }
.timeline-item { display: flex; gap: 20px; align-items: flex-start; position: relative; padding-bottom: 32px; }
.timeline-icon { width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 4px 16px rgba(var(--accent-rgb),0.35); z-index: 1; }
.timeline-line { position: absolute; right: 23px; top: 48px; bottom: 0; width: 2px; background: linear-gradient(to bottom, rgba(var(--accent-rgb),0.4), transparent); }
.timeline-body { flex: 1; padding-top: 8px; }
.timeline-body strong { display: block; font-size: 1rem; font-weight: 800; color: var(--text); margin-bottom: 6px; }
.timeline-body p { color: var(--text-muted); font-size: 0.92rem; line-height: 1.75; }

/* ══ TEAM ══ */
.block-team { margin-bottom: 52px; }
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.team-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.35s var(--ease); text-align: center; }
.team-card:hover { transform: translateY(-6px); border-color: rgba(var(--accent-rgb),0.3); box-shadow: 0 20px 48px rgba(0,0,0,0.35); }
.team-img-wrap { height: 220px; overflow: hidden; }
.team-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.team-card:hover .team-img-wrap img { transform: scale(1.06); }
.team-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; background: var(--bg); }
.team-info { padding: 18px; }
.team-info strong { display: block; font-size: 1rem; font-weight: 800; color: var(--text); }
.team-role { font-size: 0.8rem; color: var(--neon-blue); font-weight: 700; display: block; margin: 4px 0 8px; }
.team-info p { color: var(--text-muted); font-size: 0.85rem; line-height: 1.6; }

/* ══ TESTIMONIALS ══ */
.block-testimonials { margin-bottom: 52px; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.testimonial-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; gap: 14px; transition: all 0.3s var(--ease); }
.testimonial-card:hover { border-color: rgba(var(--accent-rgb),0.3); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
.testimonial-stars { font-size: 1rem; letter-spacing: 2px; }
.testimonial-text { color: var(--text-muted); font-size: 0.95rem; line-height: 1.8; flex: 1; font-style: italic; }
.testimonial-author { display: flex; align-items: center; gap: 12px; }
.testimonial-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); }
.testimonial-avatar-placeholder { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.1rem; flex-shrink: 0; }
.testimonial-author strong { display: block; font-size: 0.9rem; font-weight: 800; color: var(--text); }
.testimonial-author span { font-size: 0.78rem; color: var(--text-muted); }

/* ══ COUNTER ══ */
.block-counter { margin-bottom: 52px; }
.counter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
.counter-item { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px 20px; text-align: center; transition: all 0.3s var(--ease); }
.counter-item:hover { border-color: rgba(var(--accent-rgb),0.3); transform: translateY(-4px); }
.counter-icon { font-size: 2rem; margin-bottom: 12px; }
.counter-num { font-size: 2.4rem; font-weight: 900; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.counter-label { font-size: 0.82rem; color: var(--text-muted); margin-top: 6px; font-weight: 700; }

/* ══ PRICE LIST ══ */
.block-price { margin-bottom: 52px; }
.price-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; align-items: start; }
.price-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px 24px; display: flex; flex-direction: column; gap: 14px; position: relative; transition: all 0.3s var(--ease); }
.price-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.35); }
.price-card--featured { border-color: var(--neon-blue); background: linear-gradient(135deg, rgba(var(--accent-rgb),0.08), var(--bg2)); box-shadow: 0 0 0 1px rgba(var(--accent-rgb),0.2), 0 20px 48px rgba(0,0,0,0.3); }
.price-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; font-size: 0.75rem; font-weight: 800; padding: 4px 16px; border-radius: 50px; white-space: nowrap; }
.price-name { font-size: 1.1rem; font-weight: 800; color: var(--text); text-align: center; }
.price-amount { font-size: 2rem; font-weight: 900; color: var(--neon-blue); text-align: center; }
.price-desc { font-size: 0.88rem; color: var(--text-muted); text-align: center; }
.price-features { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.price-features li { font-size: 0.9rem; color: var(--text-muted); }

/* ══ GALLERY MARQUEE ══ */
.block-gallery { margin-bottom: 52px; }
.gallery-marquee-wrap { position: relative; overflow: hidden; }
.gallery-fade {
  position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2; pointer-events: none;
}
.gallery-fade--right { right: 0; background: linear-gradient(to left, var(--bg), transparent); }
.gallery-fade--left  { left: 0;  background: linear-gradient(to right, var(--bg), transparent); }
.gallery-marquee { overflow: hidden; }
.gallery-track {
  display: flex; gap: 12px; width: max-content;
  animation: gallery-scroll calc(var(--count, 4) * 3s) linear infinite;
}
.gallery-track:hover { animation-play-state: paused; }
@keyframes gallery-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% / 3)); }
}
.gallery-item {
  position: relative; flex-shrink: 0;
  width: 280px; height: 200px;
  border-radius: var(--radius-lg); overflow: hidden;
  border: 1px solid var(--border);
  cursor: pointer;
}
.gallery-item img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.5s var(--ease);
  filter: brightness(0.85);
}
.gallery-item:hover img { transform: scale(1.07); filter: brightness(1); }
.gallery-caption {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 10px 14px;
  background: linear-gradient(to top, rgba(3,7,18,0.85), transparent);
  color: white; font-size: 0.82rem; font-weight: 700;
  transform: translateY(100%); transition: transform 0.3s var(--ease);
}
.gallery-item:hover .gallery-caption { transform: translateY(0); }

/* ══ SLIDER ══ */
.block-slider { margin-bottom: 52px; }
.slider-wrap {
  position: relative; overflow: hidden; border-radius: var(--radius-lg);
  border: 1px solid var(--border); background: var(--bg2);
  direction: ltr;
}
.slider-wrap--sm { height: 260px; }
.slider-wrap--md { height: 420px; }
.slider-wrap--lg { height: 580px; }
.slider-track {
  display: flex; height: 100%; width: 100%;
  transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
  will-change: transform;
}
.slide { min-width: 100%; width: 100%; height: 100%; position: relative; flex-shrink: 0; overflow: hidden; }
.slide { min-width: 100%; height: 100%; position: relative; flex-shrink: 0; }
.slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
.slide-caption {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 20px 24px;
  background: linear-gradient(to top, rgba(3,7,18,0.85), transparent);
  display: flex; flex-direction: column; gap: 4px;
}
.slide-caption strong { color: white; font-size: 1.05rem; font-weight: 800; }
.slide-caption span   { color: rgba(255,255,255,0.6); font-size: 0.88rem; }
.slider-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 42px; height: 42px; border-radius: 50%;
  background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15);
  color: white; font-size: 1.5rem; cursor: pointer; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; backdrop-filter: blur(8px); line-height: 1;
}
.slider-btn:hover { background: rgba(var(--accent-rgb),0.6); border-color: var(--neon-blue); }
.slider-btn--prev { right: 14px; }
.slider-btn--next { left: 14px; }
.slider-dots {
  position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 6px; z-index: 2;
}
.slider-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,0.35); border: none; cursor: pointer;
  transition: all 0.2s;
}
.slider-dot.active { background: white; width: 22px; border-radius: 4px; }
.slider-progress {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: rgba(255,255,255,0.15); z-index: 2;
}
.slider-progress-bar {
  height: 100%; width: 0;
  background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple));
  animation: progress-fill 4s linear forwards;
}
.slider-progress-bar.paused { animation-play-state: paused; }
@keyframes progress-fill { from { width: 0; } to { width: 100%; } }

/* ══ Responsive ══ */
@media (max-width: 960px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-stats { flex-direction: row; flex-wrap: wrap; justify-content: center; }
  .stat-card { min-width: 120px; }
  .about-grid { grid-template-columns: 1fr; gap: 64px; }
  .about-img-frame { height: 360px; }
  .about-float-card { left: 12px; top: 12px; }
}
@media (max-width: 768px) {
  .block-image-text, .block-image-text--reverse { grid-template-columns: 1fr; direction: rtl; }
  .bit-img-wrap { height: 260px; }
  .block-cta { padding: 44px 24px; }
  .block-cards-grid { grid-template-columns: repeat(2,1fr) !important; }
  .block-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
}
@media (max-width: 600px) {
  .cta-inner { flex-direction: column; text-align: center; }
  .cta-actions { justify-content: center; }
  .block-cards-grid { grid-template-columns: 1fr !important; }
}
</style>
