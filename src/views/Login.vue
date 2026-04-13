<template>
  <div class="login-page">
    <div class="login-orb-1"></div>
    <div class="login-orb-2"></div>
    <div class="login-card">
      <div class="login-logo">🏗</div>
      <h1>لوحة التحكم</h1>
      <p>الرياضي للمقاولات</p>

      <form @submit.prevent="submit" class="login-form">
        <div class="login-field">
          <label>البريد الإلكتروني</label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@riyadhi.com"
            required
            autocomplete="email"
          />
        </div>
        <div class="login-field">
          <label>كلمة المرور</label>
          <div class="pass-wrap">
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
            <button type="button" class="pass-toggle" @click="showPass = !showPass">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="login-error">{{ error }}</div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="login-spinner"></span>
          {{ loading ? 'جاري الدخول...' : 'تسجيل الدخول' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router   = useRouter()
const { login } = useAuth()

const email    = ref('')
const password = ref('')
const loading  = ref(false)
const error    = ref('')
const showPass = ref(false)

async function submit() {
  loading.value = true
  error.value   = ''
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'حدث خطأ، حاول مجدداً'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh; background: var(--bg);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  position: relative; overflow: hidden;
}
.login-page::before {
  content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
  width: 800px; height: 800px; border-radius: 50%;
  background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%);
  pointer-events: none;
}
.login-orb-1 {
  position: absolute; width: 400px; height: 400px; border-radius: 50%;
  background: rgba(59,130,246,0.06); filter: blur(80px);
  top: -100px; right: -100px; pointer-events: none;
  animation: orb-float 8s ease-in-out infinite;
}
.login-orb-2 {
  position: absolute; width: 300px; height: 300px; border-radius: 50%;
  background: rgba(139,92,246,0.06); filter: blur(80px);
  bottom: -80px; left: -80px; pointer-events: none;
  animation: orb-float 10s ease-in-out infinite reverse;
}
@keyframes orb-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }

.login-card {
  background: rgba(10,15,30,0.8);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 44px 36px;
  width: 100%; max-width: 400px;
  text-align: center;
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.05);
  position: relative; z-index: 1;
  animation: float-up 0.6s var(--ease) both;
}
@keyframes float-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

.login-logo {
  width: 60px; height: 60px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; margin: 0 auto 18px;
  box-shadow: 0 8px 24px rgba(59,130,246,0.4);
  animation: glow-pulse 3s ease-in-out infinite;
}
@keyframes glow-pulse { 0%,100%{box-shadow:0 8px 24px rgba(59,130,246,0.4)} 50%{box-shadow:0 8px 40px rgba(59,130,246,0.7)} }

.login-card h1 { color: var(--text); font-size: 1.35rem; font-weight: 900; margin-bottom: 4px; }
.login-card p  { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 28px; }

.login-form { display: flex; flex-direction: column; gap: 14px; text-align: right; }
.login-field { display: flex; flex-direction: column; gap: 6px; }
.login-field label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
.login-field input {
  padding: 12px 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-family: 'Tajawal', sans-serif; font-size: 0.93rem;
  direction: rtl; transition: all 0.2s var(--ease);
}
.login-field input:focus {
  outline: none;
  border-color: var(--neon-blue);
  background: rgba(59,130,246,0.05);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}
.login-field input::placeholder { color: var(--text-dim); }

.pass-wrap { position: relative; }
.pass-wrap input { width: 100%; padding-left: 40px; }
.pass-toggle {
  position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 0.95rem; opacity: 0.4;
  transition: opacity 0.2s;
}
.pass-toggle:hover { opacity: 0.8; }

.login-error {
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.2);
  color: #f87171;
  padding: 10px 12px; border-radius: var(--radius-sm);
  font-size: 0.85rem; text-align: center;
}

.login-btn {
  padding: 13px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  color: white; border: none; border-radius: var(--radius-sm);
  font-family: 'Tajawal', sans-serif; font-size: 0.97rem; font-weight: 800;
  cursor: pointer; transition: all 0.3s var(--ease);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 4px;
}
.login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,0.45); }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.login-spinner {
  width: 17px; height: 17px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
