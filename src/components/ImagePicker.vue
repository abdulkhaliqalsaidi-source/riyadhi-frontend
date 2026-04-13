<template>
  <div class="ip-wrap">
    <!-- Preview + button -->
    <div class="ip-preview" @click="open = true">
      <img v-if="previewUrl" :src="previewUrl" class="ip-thumb" />
      <div v-else class="ip-placeholder">
        <span>🖼️</span>
        <span>اختر صورة</span>
      </div>
      <div class="ip-overlay">
        <span>{{ modelValue ? 'تغيير الصورة' : 'اختر صورة' }}</span>
      </div>
    </div>
    <div class="ip-actions" v-if="modelValue">
      <span class="ip-name">{{ displayName }}</span>
      <button class="ip-clear" @click.stop="clear" title="إزالة الصورة">✕</button>
    </div>

    <!-- Media Library Modal -->
    <MediaLibrary
      v-if="open"
      :model-value="modelValue"
      @update:model-value="onSelect"
      @close="open = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MediaLibrary from './MediaLibrary.vue'
import { IMAGES } from '../assets/images.js'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)

const previewUrl = computed(() => {
  if (!props.modelValue) return ''
  // If it's a URL (uploaded image)
  if (props.modelValue.startsWith('http') || props.modelValue.startsWith('/')) {
    return props.modelValue
  }
  // If it's a built-in key
  return IMAGES[props.modelValue] || ''
})

const displayName = computed(() => {
  if (!props.modelValue) return ''
  if (props.modelValue.startsWith('http') || props.modelValue.startsWith('/')) {
    return props.modelValue.split('/').pop()
  }
  return props.modelValue
})

function onSelect(val) {
  emit('update:modelValue', val)
  open.value = false
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.ip-wrap { display: flex; flex-direction: column; gap: 6px; }
.ip-preview {
  position: relative; width: 100%; height: 120px;
  border: 2px dashed var(--border); border-radius: 10px;
  overflow: hidden; cursor: pointer; background: var(--bg2);
  transition: border-color 0.2s;
}
.ip-preview:hover { border-color: var(--neon-blue); }
.ip-thumb { width: 100%; height: 100%; object-fit: cover; display: block; }
.ip-placeholder {
  width: 100%; height: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 6px; color: var(--text-muted); font-size: 0.85rem;
}
.ip-placeholder span:first-child { font-size: 1.8rem; }
.ip-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.85rem; font-weight: 700;
  opacity: 0; transition: opacity 0.2s;
}
.ip-preview:hover .ip-overlay { opacity: 1; }
.ip-actions { display: flex; align-items: center; gap: 8px; }
.ip-name { flex: 1; font-size: 0.76rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ip-clear { width: 22px; height: 22px; border: none; background: rgba(248,113,113,0.1); color: #f87171; border-radius: 6px; cursor: pointer; font-size: 0.75rem; flex-shrink: 0; }
</style>
