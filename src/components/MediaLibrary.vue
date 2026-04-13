<template>
  <!-- Modal overlay -->
  <div class="ml-overlay" @click.self="$emit('close')">
    <div class="ml-modal">

      <!-- Header -->
      <div class="ml-header">
        <h2>📁 مكتبة الصور</h2>
        <button class="ml-close" @click="$emit('close')">✕</button>
      </div>

      <!-- Upload zone -->
      <div
        class="ml-upload-zone"
        :class="{ 'ml-upload-zone--drag': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="$refs.fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          style="display:none"
          @change="onFileChange"
        />
        <div class="ml-upload-icon">📤</div>
        <p>اسحب الصور هنا أو <span>اضغط للاختيار</span></p>
        <small>JPG, PNG, WebP, GIF — حتى 5MB لكل صورة</small>
      </div>

      <!-- Upload progress -->
      <div class="ml-progress-list" v-if="uploading.length">
        <div class="ml-progress-item" v-for="u in uploading" :key="u.name">
          <span class="ml-progress-name">{{ u.name }}</span>
          <div class="ml-progress-bar">
            <div class="ml-progress-fill" :style="`width:${u.progress}%`"></div>
          </div>
          <span class="ml-progress-pct">{{ u.progress }}%</span>
        </div>
      </div>

      <!-- Tabs: uploaded vs built-in -->
      <div class="ml-tabs">
        <button class="ml-tab" :class="{ active: tab === 'uploaded' }" @click="tab = 'uploaded'">
          صورك المرفوعة <span class="ml-count">{{ images.length }}</span>
        </button>
        <button class="ml-tab" :class="{ active: tab === 'builtin' }" @click="tab = 'builtin'">
          صور افتراضية
        </button>
      </div>

      <!-- Grid -->
      <div class="ml-grid-wrap">
        <div v-if="loading" class="ml-loading">
          <div class="ml-spinner"></div>
        </div>

        <!-- Uploaded images -->
        <div v-else-if="tab === 'uploaded'" class="ml-grid">
          <div v-if="!images.length" class="ml-empty">
            لا توجد صور مرفوعة بعد — ارفع صورة من الأعلى
          </div>
          <div
            v-for="img in images" :key="img.name"
            class="ml-item"
            :class="{ 'ml-item--selected': selected === img.url }"
            @click="select(img.url)"
          >
            <img :src="img.url" :alt="img.name" loading="lazy" />
            <div class="ml-item-overlay">
              <button class="ml-item-del" @click.stop="deleteImage(img)" title="حذف">🗑</button>
            </div>
            <div class="ml-item-check" v-if="selected === img.url">✓</div>
          </div>
        </div>

        <!-- Built-in images -->
        <div v-else class="ml-grid">
          <div
            v-for="bi in builtinImages" :key="bi.key"
            class="ml-item"
            :class="{ 'ml-item--selected': selected === bi.key }"
            @click="select(bi.key)"
          >
            <img :src="bi.url" :alt="bi.label" loading="lazy" />
            <div class="ml-item-label">{{ bi.label }}</div>
            <div class="ml-item-check" v-if="selected === bi.key">✓</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="ml-footer">
        <div class="ml-selected-preview" v-if="selected">
          <img v-if="selectedIsUrl" :src="selected" />
          <span v-else>{{ selected }}</span>
          <span class="ml-selected-label">محدد</span>
        </div>
        <div class="ml-footer-actions">
          <button class="ml-btn-cancel" @click="$emit('close')">إلغاء</button>
          <button class="ml-btn-select" :disabled="!selected" @click="confirm">
            اختيار الصورة
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import { IMAGES } from '../assets/images.js'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'close'])

const tab      = ref('uploaded')
const images   = ref([])
const loading  = ref(false)
const uploading = ref([])
const isDragging = ref(false)
const selected = ref(props.modelValue || '')

const selectedIsUrl = computed(() => selected.value.startsWith('http') || selected.value.startsWith('/'))

const builtinImages = [
  { key: 'hero',     label: 'مظلات شراعية',    url: IMAGES.hero },
  { key: 'about',    label: 'موقع البناء',      url: IMAGES.about },
  { key: 'building', label: 'البناء والتشييد',  url: IMAGES.building },
  { key: 'fence',    label: 'السواتر',          url: IMAGES.fence },
  { key: 'car',      label: 'مظلات السيارات',   url: IMAGES.car },
  { key: 'pergola',  label: 'البرجولات',        url: IMAGES.pergola },
  { key: 'cta',      label: 'خلفية CTA',        url: IMAGES.cta },
]

async function loadImages() {
  loading.value = true
  try {
    const { data } = await api.get('/dashboard/media')
    images.value = data
  } catch { images.value = [] }
  finally { loading.value = false }
}

function select(val) { selected.value = val }

function confirm() {
  emit('update:modelValue', selected.value)
  emit('close')
}

async function uploadFile(file) {
  const item = { name: file.name, progress: 0 }
  uploading.value.push(item)

  const formData = new FormData()
  formData.append('image', file)

  try {
    const { data } = await api.post('/dashboard/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        item.progress = Math.round((e.loaded / e.total) * 100)
      },
    })
    images.value.unshift(data)
    selected.value = data.url
    tab.value = 'uploaded'
  } catch (e) {
    console.error('Upload failed', e)
  } finally {
    uploading.value = uploading.value.filter(u => u !== item)
  }
}

function onFileChange(e) {
  Array.from(e.target.files).forEach(uploadFile)
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  Array.from(e.dataTransfer.files)
    .filter(f => f.type.startsWith('image/'))
    .forEach(uploadFile)
}

async function deleteImage(img) {
  if (!confirm(`حذف "${img.name}"؟`)) return
  await api.delete('/dashboard/media', { data: { name: img.name } })
  images.value = images.value.filter(i => i.name !== img.name)
  if (selected.value === img.url) selected.value = ''
}

onMounted(loadImages)
</script>

<style scoped>
.ml-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  z-index: 500; display: flex; align-items: center; justify-content: center;
  padding: 20px; backdrop-filter: blur(8px);
}
.ml-modal {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 16px; width: 100%; max-width: 860px;
  max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
}
.ml-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.ml-header h2 { font-size: 1rem; font-weight: 800; color: var(--text); }
.ml-close {
  width: 30px; height: 30px; border: 1px solid var(--border); background: var(--glass);
  border-radius: 8px; cursor: pointer; font-size: 0.95rem; color: var(--text-muted);
}
.ml-close:hover { background: rgba(248,113,113,0.1); color: #f87171; }
.ml-upload-zone {
  margin: 14px 22px 0; border: 2px dashed var(--border);
  border-radius: 12px; padding: 18px; text-align: center;
  cursor: pointer; transition: all 0.2s; flex-shrink: 0; background: var(--bg);
}
.ml-upload-zone:hover, .ml-upload-zone--drag { border-color: var(--neon-blue); background: rgba(59,130,246,0.04); }
.ml-upload-icon { font-size: 1.6rem; margin-bottom: 6px; }
.ml-upload-zone p { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 4px; }
.ml-upload-zone p span { color: var(--neon-blue); font-weight: 700; }
.ml-upload-zone small { font-size: 0.73rem; color: var(--text-dim); }
.ml-progress-list { padding: 8px 22px 0; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
.ml-progress-item { display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: var(--text-muted); }
.ml-progress-name { min-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ml-progress-bar { flex: 1; height: 5px; background: var(--glass); border-radius: 3px; overflow: hidden; }
.ml-progress-fill { height: 100%; background: linear-gradient(90deg, var(--neon-blue), var(--neon-cyan)); border-radius: 3px; transition: width 0.2s; }
.ml-progress-pct { font-size: 0.73rem; color: var(--neon-blue); font-weight: 700; min-width: 32px; text-align: left; }
.ml-tabs { display: flex; padding: 10px 22px 0; flex-shrink: 0; border-bottom: 1px solid var(--border); }
.ml-tab {
  padding: 8px 18px; border: none; background: none;
  font-family: 'Tajawal', sans-serif; font-size: 0.86rem; font-weight: 600;
  color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent;
  transition: all 0.2s; display: flex; align-items: center; gap: 6px;
}
.ml-tab.active { color: var(--neon-blue); border-bottom-color: var(--neon-blue); }
.ml-count { background: var(--glass); color: var(--text-muted); font-size: 0.7rem; padding: 1px 7px; border-radius: 50px; border: 1px solid var(--border); }
.ml-grid-wrap { flex: 1; overflow-y: auto; padding: 14px 22px; }
.ml-loading { display: flex; justify-content: center; padding: 40px; }
.ml-spinner { width: 30px; height: 30px; border: 3px solid rgba(59,130,246,0.15); border-top-color: var(--neon-blue); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.ml-empty { text-align: center; color: var(--text-muted); padding: 40px; font-size: 0.88rem; }
.ml-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
.ml-item {
  position: relative; border-radius: 10px; overflow: hidden;
  aspect-ratio: 4/3; cursor: pointer;
  border: 2px solid transparent; transition: all 0.2s; background: var(--bg);
}
.ml-item:hover { border-color: var(--neon-blue); }
.ml-item--selected { border-color: var(--neon-blue); box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.25); }
.ml-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ml-item-label { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.65); color: white; font-size: 0.68rem; padding: 4px 6px; text-align: center; }
.ml-item-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: flex-start; justify-content: flex-end; padding: 6px; opacity: 0; transition: opacity 0.2s; }
.ml-item:hover .ml-item-overlay { opacity: 1; }
.ml-item-del { width: 26px; height: 26px; background: rgba(239,68,68,0.85); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.75rem; }
.ml-item-check { position: absolute; top: 6px; right: 6px; width: 20px; height: 20px; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 900; }
.ml-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 22px; border-top: 1px solid var(--border); flex-shrink: 0; gap: 16px; flex-wrap: wrap; }
.ml-selected-preview { display: flex; align-items: center; gap: 10px; }
.ml-selected-preview img { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); }
.ml-selected-preview span { font-size: 0.8rem; color: var(--text-muted); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ml-selected-label { font-size: 0.7rem; color: var(--neon-blue); font-weight: 700; background: rgba(var(--accent-rgb),0.1); padding: 2px 8px; border-radius: 50px; }
.ml-footer-actions { display: flex; gap: 10px; margin-right: auto; }
.ml-btn-cancel { padding: 8px 18px; background: var(--glass); border: 1px solid var(--border); color: var(--text-muted); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-weight: 700; cursor: pointer; }
.ml-btn-select { padding: 8px 22px; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; border: none; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-weight: 800; cursor: pointer; transition: all 0.2s; }
.ml-btn-select:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(var(--accent-rgb),0.4); }
.ml-btn-select:disabled { opacity: 0.5; cursor: not-allowed; }
@media (max-width: 600px) { .ml-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); } }
</style>