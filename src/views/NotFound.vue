<template>
  <div class="nf-page">
    <div class="nf-content">
      <div class="nf-code">404</div>
      <div class="nf-icon">🏗️</div>
      <h1>الصفحة غير موجودة</h1>
      <p>يبدو أن هذه الصفحة قيد الإنشاء أو تم نقلها!</p>
      <div class="nf-actions">
        <router-link to="/" class="btn btn-primary">العودة للرئيسية</router-link>
        <router-link to="/contact" class="btn btn-dark">تواصل معنا</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSeo } from '../composables/useSeo'
const { setPage } = useSeo()
setPage({ title: '404 — الصفحة غير موجودة | الرياضي للمقاولات' })
</script>

<style scoped>
.nf-page {
  min-height: 100vh;
  background: var(--dark);
  display: flex; align-items: center; justify-content: center;
  padding: 40px 20px;
  background-image:
    linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}
.nf-content { text-align: center; }
.nf-code {
  font-size: clamp(6rem, 20vw, 12rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8px;
}
.nf-icon { font-size: 3rem; margin-bottom: 20px; }
.nf-content h1 { color: white; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; margin-bottom: 12px; }
.nf-content p  { color: rgba(255,255,255,0.5); font-size: 1rem; margin-bottom: 32px; }
.nf-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
</style>
