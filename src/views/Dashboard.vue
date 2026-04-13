<template>
  <div class="dash-layout">

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sideOpen }">
      <div class="sidebar-brand">
        <div class="brand-logo">🏗</div>
        <div class="brand-text">
          <span class="name">لوحة التحكم</span>
          <span class="sub">AL-RIYADHI</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <button v-for="item in navItems" :key="item.id"
          class="nav-item" :class="{ active: activeTab === item.id }"
          @click="activeTab = item.id; sideOpen = false">
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span v-if="item.id === 'contacts' && unreadCount > 0" class="nav-badge nav-badge--red">{{ unreadCount }}</span>
          <span v-else-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>
      </nav>
      <a href="/" class="sidebar-back">← العودة للموقع</a>
      <button class="sidebar-change-pass" @click="showChangePassModal = true">🔑 تغيير كلمة المرور</button>
      <button class="sidebar-logout" @click="handleLogout">🚪 تسجيل الخروج</button>
    </aside>

    <div v-if="sideOpen" class="side-overlay" @click="sideOpen = false"></div>

    <div class="dash-main">
      <header class="dash-topbar">
        <button class="menu-toggle" @click="sideOpen = !sideOpen">☰</button>
        <h1 class="topbar-title">{{ currentTitle }}</h1>
        <span class="topbar-date">{{ today }}</span>
      </header>

      <main class="dash-content">

        <!-- ══ OVERVIEW ══ -->
        <div v-if="activeTab === 'overview'">
          <div class="stats-grid">
            <div class="stat-box" v-for="sc in statCards" :key="sc.label">
              <div class="stat-box-icon" :style="`background:${sc.bg}`">{{ sc.icon }}</div>
              <div>
                <div class="stat-box-num">{{ sc.value }}</div>
                <div class="stat-box-label">{{ sc.label }}</div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-head">
              <h2>آخر الرسائل</h2>
              <button class="link-btn" @click="activeTab = 'contacts'">عرض الكل ←</button>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead><tr><th>#</th><th>الاسم</th><th>الجوال</th><th>الرسالة</th><th>التاريخ</th></tr></thead>
                <tbody>
                  <tr v-if="!dashStats.recent_contacts?.length"><td colspan="5" class="empty-row">لا توجد رسائل بعد</td></tr>
                  <tr v-for="c in dashStats.recent_contacts" :key="c.id">
                    <td class="td-id">#{{ c.id }}</td>
                    <td class="td-name">{{ c.name }}</td>
                    <td><a :href="`tel:${c.phone}`" class="phone-link">{{ c.phone }}</a></td>
                    <td class="td-msg">{{ c.message }}</td>
                    <td class="td-date">{{ fmtDate(c.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ══ CONTACTS ══ -->
        <div v-if="activeTab === 'contacts'">
          <div class="page-actions">
            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input v-model="contactSearch" @input="loadContacts(1)" type="text" placeholder="ابحث بالاسم أو الجوال..." class="search-input" />
            </div>
            <button v-if="unreadCount > 0" class="btn-mark-all" @click="markAllRead">
              ✓ تحديد الكل كمقروء ({{ unreadCount }})
            </button>
          </div>
          <div class="card">
            <div class="table-wrap">
              <table class="data-table">
                <thead><tr><th>#</th><th>الاسم</th><th>الجوال</th><th>الرسالة</th><th>التاريخ</th><th>إجراء</th></tr></thead>
                <tbody>
                  <tr v-if="loadingContacts"><td colspan="6" class="empty-row"><div class="spinner"></div></td></tr>
                  <tr v-else-if="!contacts.length"><td colspan="6" class="empty-row">لا توجد نتائج</td></tr>
                  <tr v-for="c in contacts" :key="c.id">
                    <td class="td-id">#{{ c.id }}</td>
                    <td class="td-name">
                      <span v-if="!c.is_read" class="unread-dot" title="غير مقروء"></span>
                      {{ c.name }}
                    </td>
                    <td><a :href="`https://wa.me/966${c.phone.replace(/^0/,'')}`" target="_blank" class="wa-link">📱 {{ c.phone }}</a></td>
                    <td class="td-msg">{{ c.message }}</td>
                    <td class="td-date">{{ fmtDate(c.created_at) }}</td>
                    <td>
                      <div style="display:flex;gap:6px">
                        <button v-if="!c.is_read" class="act-btn edit" @click="markRead(c)" title="تحديد كمقروء">✓</button>
                        <button class="del-btn" @click="deleteContact(c.id)" title="حذف">🗑</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination" v-if="contactPages > 1">
              <button v-for="p in contactPages" :key="p" class="page-btn" :class="{ active: p === contactPage }" @click="loadContacts(p)">{{ p }}</button>
            </div>
          </div>
        </div>

        <!-- ══ SECTIONS ══ -->
        <div v-if="activeTab === 'sections'">
          <div class="page-actions">
            <button class="btn-add" @click="openSectionModal()">+ إضافة قسم</button>
            <span class="hint-text">اسحب لتغيير الترتيب</span>
          </div>
          <div class="sections-list">
            <div v-for="(sec, idx) in allSections" :key="sec.id"
              class="section-row"
              :class="{ dragging: dragIdx === idx, 'drag-over': dragOverIdx === idx }"
              draggable="true"
              @dragstart="onDragStart(idx)"
              @dragover.prevent="onDragOver(idx)"
              @dragend="onDragEnd">
              <div class="drag-handle">⠿</div>
              <div class="sec-order-badge">{{ idx + 1 }}</div>
              <div class="sec-type-icon">{{ typeIcons[sec.type] || '📄' }}</div>
              <div class="sec-info">
                <strong>{{ sec.label }}</strong>
                <span class="sec-type-tag">{{ typeLabels[sec.type] }}</span>
              </div>
              <div class="sec-meta">
                <span class="badge" :class="sec.is_active ? 'badge-green' : 'badge-gray'">{{ sec.is_active ? 'نشط' : 'مخفي' }}</span>
                <span class="badge" :class="sec.show_in_nav ? 'badge-blue' : 'badge-gray'">{{ sec.show_in_nav ? 'في القائمة' : 'مخفي' }}</span>
              </div>
              <div class="sec-actions">
                <button class="act-btn edit" @click="openSectionModal(sec)">✏️ تعديل</button>
                <button class="act-btn del" @click="deleteSection(sec)" :disabled="['hero','about','services','cta'].includes(sec.key)">🗑</button>
              </div>
            </div>
          </div>
          <div class="save-order-bar" v-if="orderChanged">
            <span>تم تغيير الترتيب</span>
            <button class="btn-save" @click="saveOrder" :disabled="savingOrder">{{ savingOrder ? 'جاري...' : '💾 حفظ الترتيب' }}</button>
          </div>
        </div>

        <!-- ══ MEDIA ══ -->
        <div v-if="activeTab === 'media'">
          <div class="page-actions">
            <button class="btn-add" @click="$refs.mediaUploadInput.click()">+ رفع صور جديدة</button>
            <input ref="mediaUploadInput" type="file" accept="image/*" multiple style="display:none" @change="uploadMediaFiles" />
            <span class="hint-text">{{ mediaImages.length }} صورة مرفوعة</span>
          </div>

          <!-- Upload progress -->
          <div class="media-progress-list" v-if="mediaUploading.length">
            <div class="media-progress-item" v-for="u in mediaUploading" :key="u.name">
              <span>{{ u.name }}</span>
              <div class="media-progress-bar"><div class="media-progress-fill" :style="`width:${u.progress}%`"></div></div>
              <span>{{ u.progress }}%</span>
            </div>
          </div>

          <!-- Drop zone -->
          <div class="media-drop-zone"
            :class="{ 'media-drop-zone--drag': mediaDragging }"
            @dragover.prevent="mediaDragging = true"
            @dragleave="mediaDragging = false"
            @drop.prevent="onMediaDrop"
            @click="$refs.mediaUploadInput.click()"
          >
            <span>📤</span>
            <p>اسحب الصور هنا أو <strong>اضغط للاختيار</strong></p>
            <small>JPG, PNG, WebP — حتى 5MB</small>
          </div>

          <!-- Images grid -->
          <div v-if="mediaLoading" class="card" style="padding:40px;text-align:center">
            <div class="spinner"></div>
          </div>
          <div v-else-if="!mediaImages.length" class="empty-state" style="margin-top:16px">
            لا توجد صور مرفوعة بعد
          </div>
          <div v-else class="media-grid">
            <div class="media-item" v-for="img in mediaImages" :key="img.name">
              <img :src="img.url" :alt="img.name" loading="lazy" />
              <div class="media-item-overlay">
                <button class="media-copy-btn" @click="copyUrl(img.url)" title="نسخ الرابط">📋</button>
                <button class="media-del-btn" @click="deleteMediaImage(img)" title="حذف">🗑</button>
              </div>
              <div class="media-item-name">{{ img.name }}</div>
            </div>
          </div>
        </div>

        <!-- ══ USERS ══ -->
        <div v-if="activeTab === 'users'">
          <div class="page-actions">
            <button class="btn-add" @click="openUserModal()">+ إضافة مستخدم</button>
          </div>
          <div class="card">
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>تاريخ الإنشاء</th>
                    <th>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loadingUsers"><td colspan="5" class="empty-row"><div class="spinner"></div></td></tr>
                  <tr v-else-if="!users.length"><td colspan="5" class="empty-row">لا يوجد مستخدمون</td></tr>
                  <tr v-for="u in users" :key="u.id">
                    <td class="td-id">#{{ u.id }}</td>
                    <td class="td-name">
                      <div class="user-avatar">{{ u.name.charAt(0) }}</div>
                      {{ u.name }}
                    </td>
                    <td>{{ u.email }}</td>
                    <td class="td-date">{{ fmtDate(u.created_at) }}</td>
                    <td>
                      <div style="display:flex;gap:6px">
                        <button class="act-btn edit" @click="openUserModal(u)">✏️ تعديل</button>
                        <button class="act-btn del" @click="deleteUser(u)">🗑</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ══ SITE EDITOR ══ -->
        <div v-if="activeTab === 'editor'">
          <div class="editor-tabs">
            <button v-for="t in editorTabs" :key="t.id" class="etab" :class="{ active: editorTab === t.id }" @click="editorTab = t.id">
              {{ t.icon }} {{ t.label }}
            </button>
          </div>

          <!-- ── Company ── -->
          <div v-if="editorTab === 'company'" class="editor-section">
            <div class="editor-section-title">🏢 معلومات الشركة</div>

            <!-- Logo upload -->
            <div class="logo-editor">
              <div class="logo-preview">
                <img v-if="form.logo" :src="form.logo" alt="شعار الشركة" class="logo-preview-img" />
                <div v-else class="logo-preview-placeholder">🏗</div>
              </div>
              <div class="logo-editor-info">
                <div class="logo-editor-label">شعار الشركة</div>
                <div class="logo-editor-hint">يظهر في النافبار والفوتر — يُفضل PNG شفاف</div>
                <div style="display:flex;gap:8px;margin-top:10px">
                  <ImagePicker v-model="form.logo" />
                  <button v-if="form.logo" type="button" class="btn-cancel" style="padding:6px 12px;font-size:0.8rem" @click="removeLogo">حذف الشعار</button>
                </div>
              </div>
            </div>

            <div class="field-list">
              <div class="field-row" v-for="f in companyFields" :key="f.key">
                <div class="field-label">{{ f.label }}</div>
                <div class="field-input-wrap">
                  <input class="field-input" v-model="form[f.key]" :placeholder="f.placeholder || ''" />
                </div>
                <button class="field-save-btn" @click="saveField(f.key)" :disabled="savingField === f.key">
                  {{ savingField === f.key ? '...' : '💾' }}
                </button>
              </div>
            </div>
          </div>

          <!-- ── Hero ── -->
          <div v-if="editorTab === 'hero'" class="editor-section">
            <div class="editor-section-title">🦸 قسم الهيرو</div>
            <div class="field-list">
              <div class="field-row" v-for="f in heroFields" :key="f.key">
                <div class="field-label">{{ f.label }}</div>
                <div class="field-input-wrap">
                  <textarea v-if="f.type === 'textarea'" class="field-input" v-model="form[f.key]" rows="2"></textarea>
                  <input v-else class="field-input" v-model="form[f.key]" />
                </div>
                <button class="field-save-btn" @click="saveField(f.key)" :disabled="savingField === f.key">
                  {{ savingField === f.key ? '...' : '💾' }}
                </button>
              </div>
            </div>
            <div class="editor-section-title" style="margin-top:24px">📊 الإحصائيات</div>
            <div class="stats-editor">
              <div class="stat-editor-row" v-for="n in [1,2,3]" :key="n">
                <div class="stat-editor-num">
                  <label>الرقم</label>
                  <input v-model="form[`stat${n}_num`]" placeholder="+200" />
                </div>
                <div class="stat-editor-label">
                  <label>التسمية</label>
                  <input v-model="form[`stat${n}_label`]" placeholder="مشروع منجز" />
                </div>
                <button class="field-save-btn" @click="saveFields([`stat${n}_num`,`stat${n}_label`])" :disabled="savingField === `stat${n}`">
                  {{ savingField === `stat${n}` ? '...' : '💾' }}
                </button>
              </div>
            </div>
          </div>

          <!-- ── About ── -->
          <div v-if="editorTab === 'about'" class="editor-section">
            <div class="editor-section-title">ℹ️ قسم من نحن</div>
            <div class="field-list">
              <div class="field-row" v-for="f in aboutFields" :key="f.key">
                <div class="field-label">{{ f.label }}</div>
                <div class="field-input-wrap">
                  <textarea v-if="f.type === 'textarea'" class="field-input" v-model="form[f.key]" rows="3"></textarea>
                  <input v-else class="field-input" v-model="form[f.key]" />
                </div>
                <button class="field-save-btn" @click="saveField(f.key)" :disabled="savingField === f.key">
                  {{ savingField === f.key ? '...' : '💾' }}
                </button>
              </div>
            </div>
            <!-- Features CRUD -->
            <div class="editor-section-title" style="margin-top:24px">✅ المميزات</div>
            <div class="features-editor">
              <div class="feature-row" v-for="(feat, idx) in aboutFeaturesList" :key="idx">
                <input class="feature-input" v-model="aboutFeaturesList[idx]" />
                <button class="feat-del-btn" @click="removeFeature(idx)" title="حذف">✕</button>
              </div>
              <div class="feature-add-row">
                <input class="feature-input" v-model="newFeature" placeholder="أضف ميزة جديدة..." @keyup.enter="addFeature" />
                <button class="feat-add-btn" @click="addFeature">+ إضافة</button>
              </div>
              <button class="btn-save-features" @click="saveFeatures" :disabled="savingFeatures">
                {{ savingFeatures ? 'جاري الحفظ...' : '💾 حفظ المميزات' }}
              </button>
            </div>
          </div>

          <!-- ── CTA ── -->
          <div v-if="editorTab === 'cta'" class="editor-section">
            <div class="editor-section-title">📣 قسم الدعوة للتواصل</div>
            <div class="field-list">
              <div class="field-row" v-for="f in ctaFields" :key="f.key">
                <div class="field-label">{{ f.label }}</div>
                <div class="field-input-wrap">
                  <textarea v-if="f.type === 'textarea'" class="field-input" v-model="form[f.key]" rows="2"></textarea>
                  <input v-else class="field-input" v-model="form[f.key]" />
                </div>
                <button class="field-save-btn" @click="saveField(f.key)" :disabled="savingField === f.key">
                  {{ savingField === f.key ? '...' : '💾' }}
                </button>
              </div>
            </div>
            <div class="editor-section-title" style="margin-top:24px">🎨 الألوان والخطوط</div>
            <div class="theme-editor">

              <!-- Live Preview Bar -->
              <div class="theme-preview-bar" :style="previewBarStyle">
                <div class="preview-bar-inner">
                  <span class="preview-dot" :style="`background:${form.color_primary||'#3b82f6'}`"></span>
                  <span class="preview-dot" :style="`background:${form.color_accent||'#8b5cf6'}`"></span>
                  <span class="preview-dot" :style="`background:${form.color_dark||'#030712'}`"></span>
                  <span class="preview-text" :style="`color:${form.color_text||'#f1f5f9'};font-family:'${form.font_family||'Tajawal'}'`">
                    معاينة مباشرة — {{ form.font_family || 'Tajawal' }}
                  </span>
                  <span class="preview-btn-sample" :style="`background:linear-gradient(135deg,${form.color_primary||'#3b82f6'},${form.color_accent||'#8b5cf6'})`">
                    زر تجريبي
                  </span>
                </div>
              </div>

              <!-- Color Presets -->
              <div class="theme-presets-label">ثيمات جاهزة</div>
              <div class="theme-presets">
                <button
                  v-for="preset in colorPresets" :key="preset.name"
                  class="preset-chip"
                  :class="{ active: isActivePreset(preset) }"
                  @click="applyPreset(preset)"
                  :title="preset.name"
                >
                  <span class="preset-swatch" :style="`background:linear-gradient(135deg,${preset.color_primary},${preset.color_accent})`"></span>
                  <span>{{ preset.name }}</span>
                </button>
              </div>

              <!-- Color Pickers -->
              <div class="color-pickers-grid">
                <div class="color-picker-card" v-for="c in colorFields" :key="c.key">
                  <div class="cpc-label">{{ c.label }}</div>
                  <div class="cpc-body">
                    <div class="cpc-swatch-wrap">
                      <input
                        type="color"
                        :value="form[c.key] || c.default"
                        @input="onColorInput(c.key, $event.target.value)"
                        class="cpc-native"
                      />
                      <div class="cpc-swatch" :style="`background:${form[c.key]||c.default}`"></div>
                    </div>
                    <input
                      class="cpc-hex"
                      :value="form[c.key] || c.default"
                      @input="onColorInput(c.key, $event.target.value)"
                      placeholder="#000000"
                      maxlength="7"
                    />
                  </div>
                  <div class="cpc-desc">{{ c.desc }}</div>
                </div>
              </div>

              <!-- Font Family -->
              <div class="font-section">
                <div class="font-section-label">🔤 خط الموقع</div>
                <div class="font-grid">
                  <button
                    v-for="font in fontOptions" :key="font.value"
                    class="font-chip"
                    :class="{ active: (form.font_family || 'Tajawal') === font.value }"
                    :style="`font-family:'${font.value}',sans-serif`"
                    @click="onFontChange(font.value)"
                  >
                    <span class="font-chip-name">{{ font.label }}</span>
                    <span class="font-chip-sample" :style="`font-family:'${font.value}',sans-serif`">أبجد هوز</span>
                  </button>
                </div>
              </div>

              <!-- Save All -->
              <button class="theme-save-btn" @click="saveTheme" :disabled="savingTheme">
                <svg v-if="!savingTheme" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <div v-else class="btn-spinner-sm"></div>
                {{ savingTheme ? 'جاري الحفظ...' : 'حفظ وتطبيق التصميم' }}
              </button>

            </div>
            <div class="editor-section-title" style="margin-top:24px">🔻 الفوتر</div>
            <div class="field-list">
              <div class="field-row">
                <div class="field-label">نص الفوتر</div>
                <div class="field-input-wrap"><input class="field-input" v-model="form.footer_text" /></div>
                <button class="field-save-btn" @click="saveField('footer_text')">💾</button>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>

    <!-- ══ SECTION MODAL ══ -->
    <div v-if="showSectionModal" class="modal-overlay" @click.self="showSectionModal = false">
      <div class="modal modal-wide">
        <div class="modal-head">
          <h2>{{ editingSection ? 'تعديل القسم' : 'إضافة قسم جديد' }}</h2>
          <button class="modal-close" @click="showSectionModal = false">✕</button>
        </div>
        <form @submit.prevent="saveSection" class="modal-form">
          <div class="form-grid">
            <div class="fg">
              <label>اسم القسم في القائمة *</label>
              <input v-model="secForm.label" placeholder="مثال: أعمالنا" required />
            </div>
            <div class="fg">
              <label>نوع القسم *</label>
              <select v-model="secForm.type" :disabled="!!editingSection">
                <option value="hero">🦸 هيرو</option>
                <option value="about">ℹ️ من نحن</option>
                <option value="services">⚙️ الخدمات</option>
                <option value="cta">📣 دعوة للتواصل</option>
                <option value="partners">🤝 شركاؤنا</option>
                <option value="custom">✨ مخصص (Page Builder)</option>
              </select>
            </div>
            <div class="fg" v-if="!editingSection">
              <label>المعرّف الفريد *</label>
              <input v-model="secForm.key" placeholder="مثال: gallery" required />
            </div>
            <div class="fg">
              <label>الترتيب</label>
              <input type="number" v-model.number="secForm.sort_order" min="1" />
            </div>
            <div class="fg">
              <label class="toggle-label">
                <input type="checkbox" v-model="secForm.show_in_nav" />
                <span>إظهار في قائمة التنقل</span>
              </label>
            </div>
            <div class="fg">
              <label class="toggle-label">
                <input type="checkbox" v-model="secForm.is_active" />
                <span>نشط على الموقع</span>
              </label>
            </div>
          </div>

          <!-- ── Dropdown children ── -->
          <template v-if="secForm.show_in_nav">
            <div class="pb-section-title">🔽 قائمة منسدلة (اختياري)</div>
            <div class="children-list">
              <div class="child-row" v-for="(child, ci) in (secForm.content.children || [])" :key="ci">
                <div class="child-fields">
                  <div class="fg">
                    <label>الأيقونة</label>
                    <input v-model="child.icon" placeholder="🏗️" style="width:70px" />
                  </div>
                  <div class="fg" style="flex:2">
                    <label>الاسم *</label>
                    <input v-model="child.label" placeholder="اسم العنصر..." required />
                  </div>
                  <div class="fg" style="flex:2">
                    <label>وصف قصير</label>
                    <input v-model="child.desc" placeholder="وصف اختياري..." />
                  </div>
                  <div class="fg" style="flex:3">
                    <label>الوجهة / الرابط</label>
                    <LinkPicker v-model="child.link" />
                  </div>
                </div>
                <button type="button" class="child-del-btn" @click="removeChild(ci)" title="حذف">✕</button>
              </div>
              <button type="button" class="child-add-btn" @click="addChild">+ إضافة عنصر للقائمة</button>
            </div>
          </template>

          <!-- ── Services section editor ── -->
          <template v-if="secForm.type === 'services'">
            <div class="pb-section-title">⚙️ إدارة الخدمات</div>
            <div class="pb-field-inline" style="margin-bottom:16px">
              <label>عنوان القسم</label>
              <input v-model="secForm.content.title" placeholder="خدماتنا" class="pb-title-input" />
            </div>

            <div class="partners-editor-list">
              <div
                class="partner-editor-row"
                v-for="(sv, si) in (secForm.content.services || [])"
                :key="si"
              >
                <div class="partner-editor-preview">
                  <img v-if="sv.image" :src="sv.image" style="width:100%;height:100%;object-fit:cover;border-radius:8px" />
                  <span v-else style="font-size:1.4rem">{{ emojiMap[sv.icon] || '🔨' }}</span>
                </div>
                <div class="partner-editor-fields">
                  <div class="fg" style="flex:2">
                    <label>الاسم (عربي) *</label>
                    <input v-model="sv.name_ar" placeholder="اسم الخدمة" required />
                  </div>
                  <div class="fg" style="flex:2">
                    <label>الوصف</label>
                    <input v-model="sv.description_ar" placeholder="وصف مختصر..." />
                  </div>
                  <div class="fg">
                    <label>الأيقونة</label>
                    <select v-model="sv.icon">
                      <option value="building">🏗️ بناء</option>
                      <option value="fence">🚧 سواتر</option>
                      <option value="car">🚗 مظلات</option>
                      <option value="pergola">🌿 برجولات</option>
                      <option value="other">🔨 أخرى</option>
                    </select>
                  </div>
                  <div class="fg" style="flex:3">
                    <label>صورة الخدمة</label>
                    <ImagePicker v-model="sv.image" />
                  </div>
                  <div class="fg full">
                    <label>نقاط الخدمة (سطر لكل نقطة)</label>
                    <textarea
                      :value="(sv.points || []).join('\n')"
                      @input="sv.points = $event.target.value.split('\n').map(l=>l.trim()).filter(Boolean)"
                      rows="3"
                      placeholder="نقطة أولى&#10;نقطة ثانية"
                    ></textarea>
                  </div>
                  <div class="fg">
                    <label class="toggle-label">
                      <input type="checkbox" v-model="sv.is_active" />
                      <span>نشط</span>
                    </label>
                  </div>
                </div>
                <button type="button" class="partner-editor-del" @click="removeServiceItem(si)" title="حذف">✕</button>
              </div>
              <div v-if="!(secForm.content.services?.length)" class="partners-editor-empty">
                لا توجد خدمات — أضف خدمة أدناه
              </div>
            </div>
            <button type="button" class="partner-add-btn" @click="addServiceItem">
              + إضافة خدمة
            </button>
          </template>

          <!-- ── Partners section editor ── -->
          <template v-if="secForm.type === 'partners'">
            <div class="pb-section-title">🤝 إدارة الشركاء</div>

            <!-- Section title -->
            <div class="pb-field-inline" style="margin-bottom:16px">
              <label>عنوان القسم</label>
              <input v-model="secForm.content.title" placeholder="شركاؤنا وعملاؤنا" class="pb-title-input" />
            </div>

            <!-- Partners list -->
            <div class="partners-editor-list">
              <div
                class="partner-editor-row"
                v-for="(p, pi) in (secForm.content.partners || [])"
                :key="pi"
              >
                <div class="partner-editor-preview">
                  <img v-if="p.logo" :src="p.logo" :alt="p.name" class="partner-editor-img" />
                  <span v-else class="partner-editor-icon">{{ p.icon || '🏢' }}</span>
                </div>
                <div class="partner-editor-fields">
                  <div class="fg">
                    <label>الاسم *</label>
                    <input v-model="p.name" placeholder="اسم الشريك" required />
                  </div>
                  <div class="fg">
                    <label>أيقونة (إيموجي)</label>
                    <input v-model="p.icon" placeholder="🏢" maxlength="4" style="width:80px" />
                  </div>
                  <div class="fg" style="flex:2">
                    <label>رابط الموقع</label>
                    <input v-model="p.website" type="url" placeholder="https://..." />
                  </div>
                  <div class="fg" style="flex:3">
                    <label>شعار (صورة)</label>
                    <ImagePicker v-model="p.logo" />
                  </div>
                </div>
                <button type="button" class="partner-editor-del" @click="removePartnerItem(pi)" title="حذف">✕</button>
              </div>

              <div v-if="!(secForm.content.partners?.length)" class="partners-editor-empty">
                لا يوجد شركاء — أضف شريكاً أدناه
              </div>
            </div>

            <button type="button" class="partner-add-btn" @click="addPartnerItem">
              + إضافة شريك
            </button>
          </template>

          <!-- ── Page Builder for custom sections ── -->
          <template v-else-if="secForm.type === 'custom'">
            <div class="pb-section-title">🧱 محتوى القسم</div>
            <div class="pb-field-inline">
              <label>عنوان القسم</label>
              <input v-model="secForm.content.title" placeholder="عنوان القسم..." class="pb-title-input" />
            </div>
            <PageBuilder v-model="secForm.content.blocks" />
          </template>

          <!-- ── Simple fields for non-custom sections ── -->
          <template v-else-if="secForm.type !== 'partners' && secForm.type !== 'services'">
            <div class="form-grid" style="margin-top:16px">
              <div class="fg full"><label>العنوان</label><input v-model="secForm.content.title" /></div>
              <div class="fg full"><label>النص / الوصف</label><textarea v-model="secForm.content.text" rows="3"></textarea></div>
              <div class="fg full">
                <label>الصورة</label>
                <ImagePicker v-model="secForm.content.image" />
              </div>
            </div>
          </template>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="showSectionModal = false">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="savingSec">
              {{ savingSec ? 'جاري الحفظ...' : (editingSection ? 'حفظ التعديلات' : 'إضافة القسم') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ══ CHANGE PASSWORD MODAL ══ -->
    <div v-if="showChangePassModal" class="modal-overlay" @click.self="showChangePassModal = false">
      <div class="modal">
        <div class="modal-head">
          <h2>🔑 تغيير كلمة المرور</h2>
          <button class="modal-close" @click="showChangePassModal = false">✕</button>
        </div>
        <form @submit.prevent="submitChangePassword" class="modal-form">
          <div class="form-grid">
            <div class="fg full">
              <label>كلمة المرور الحالية *</label>
              <div class="pass-field-wrap">
                <input v-model="cpForm.current_password" :type="showCp1 ? 'text' : 'password'" placeholder="••••••••" required />
                <button type="button" class="pass-eye" @click="showCp1 = !showCp1">{{ showCp1 ? '🙈' : '👁️' }}</button>
              </div>
            </div>
            <div class="fg full">
              <label>كلمة المرور الجديدة *</label>
              <div class="pass-field-wrap">
                <input v-model="cpForm.new_password" :type="showCp2 ? 'text' : 'password'" placeholder="8 أحرف وأرقام على الأقل" required />
                <button type="button" class="pass-eye" @click="showCp2 = !showCp2">{{ showCp2 ? '🙈' : '👁️' }}</button>
              </div>
            </div>
            <div class="fg full">
              <label>تأكيد كلمة المرور الجديدة *</label>
              <div class="pass-field-wrap">
                <input v-model="cpForm.new_password_confirmation" :type="showCp3 ? 'text' : 'password'" placeholder="••••••••" required />
                <button type="button" class="pass-eye" @click="showCp3 = !showCp3">{{ showCp3 ? '🙈' : '👁️' }}</button>
              </div>
            </div>
          </div>
          <div v-if="cpError" class="user-error">{{ cpError }}</div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="showChangePassModal = false">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="savingCp">
              {{ savingCp ? 'جاري الحفظ...' : '💾 حفظ كلمة المرور' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">{{ toast.msg }}</div>
    </transition>

    <!-- ══ USER MODAL ══ -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="showUserModal = false">
      <div class="modal">
        <div class="modal-head">
          <h2>{{ editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد' }}</h2>
          <button class="modal-close" @click="showUserModal = false">✕</button>
        </div>
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-grid">
            <div class="fg full">
              <label>الاسم الكامل *</label>
              <input v-model="userForm.name" placeholder="اسم المستخدم" required />
            </div>
            <div class="fg full">
              <label>البريد الإلكتروني *</label>
              <input v-model="userForm.email" type="email" placeholder="user@example.com" required />
            </div>
            <div class="fg full">
              <label>{{ editingUser ? 'كلمة المرور الجديدة (اتركها فارغة للإبقاء على الحالية)' : 'كلمة المرور *' }}</label>
              <div class="pass-field-wrap">
                <input
                  v-model="userForm.password"
                  :type="showUserPass ? 'text' : 'password'"
                  :placeholder="editingUser ? '••••••••' : 'كلمة مرور قوية'"
                  :required="!editingUser"
                />
                <button type="button" class="pass-eye" @click="showUserPass = !showUserPass">
                  {{ showUserPass ? '🙈' : '👁️' }}
                </button>
              </div>
              <small class="pass-hint">يجب أن تحتوي على 8 أحرف على الأقل، حروف وأرقام</small>
            </div>
          </div>
          <div v-if="userError" class="user-error">{{ userError }}</div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="showUserModal = false">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="savingUser">
              {{ savingUser ? 'جاري الحفظ...' : (editingUser ? 'حفظ التعديلات' : 'إضافة المستخدم') }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useSettings } from '../composables/useSettings'
import { useSections } from '../composables/useSections'
import { useAuth } from '../composables/useAuth'
import PageBuilder from '../components/PageBuilder.vue'
import ImagePicker from '../components/ImagePicker.vue'
import LinkPicker  from '../components/LinkPicker.vue'

const { refresh: refreshSettings, previewColors } = useSettings()
const { refresh: refreshSections } = useSections()
const { logout, init: initAuth } = useAuth()
const router = useRouter()

initAuth()

async function handleLogout() {
  await logout()
  router.push('/login')
}

// ── Nav ──────────────────────────────────────────────
const activeTab  = ref('overview')
const sideOpen   = ref(false)
const editorTab  = ref('company')

const navItems = computed(() => [
  { id: 'overview',  icon: '📊', label: 'نظرة عامة' },
  { id: 'contacts',  icon: '✉️',  label: 'الرسائل', badge: dashStats.value.total_contacts || null },
  { id: 'sections',  icon: '🗂️',  label: 'أقسام الموقع' },
  { id: 'media',     icon: '🖼️',  label: 'الصور' },
  { id: 'users',     icon: '👥',  label: 'المستخدمون' },
  { id: 'editor',    icon: '✏️',  label: 'تعديل المحتوى' },
])

const editorTabs = [
  { id: 'company', icon: '🏢', label: 'الشركة' },
  { id: 'hero',    icon: '🦸', label: 'الهيرو' },
  { id: 'about',   icon: 'ℹ️', label: 'من نحن' },
  { id: 'cta',     icon: '📣', label: 'CTA & ألوان' },
]

const currentTitle = computed(() => navItems.value.find(n => n.id === activeTab.value)?.label ?? '')
const today = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

// ── Toast ─────────────────────────────────────────────
const toast = ref({ show: false, msg: '', type: 'success' })
function showToast(msg, type = 'success') {
  toast.value = { show: true, msg, type }
  setTimeout(() => toast.value.show = false, 3000)
}

// ── Stats ─────────────────────────────────────────────
const dashStats = ref({ total_contacts: 0, total_services: 0, active_services: 0, today_contacts: 0, recent_contacts: [] })
const statCards = computed(() => [
  { icon: '✉️', label: 'إجمالي الرسائل',  value: dashStats.value.total_contacts,  bg: 'rgba(201,168,76,0.12)' },
  { icon: '📅', label: 'رسائل اليوم',     value: dashStats.value.today_contacts,   bg: 'rgba(34,197,94,0.12)' },
  { icon: '⚙️', label: 'الخدمات النشطة',  value: dashStats.value.active_services,  bg: 'rgba(99,102,241,0.12)' },
  { icon: '📦', label: 'إجمالي الخدمات',  value: dashStats.value.total_services,   bg: 'rgba(239,68,68,0.10)' },
])
async function loadStats() {
  const { data } = await api.get('/dashboard/stats')
  dashStats.value = data
}

// ── Unread notifications polling ─────────────────────
const unreadCount = ref(0)
let pollTimer = null

async function fetchUnreadCount() {
  try {
    const { data } = await api.get('/dashboard/contacts/unread-count')
    unreadCount.value = data.count
  } catch {}
}

async function markRead(contact) {
  await api.patch(`/dashboard/contacts/${contact.id}/mark-read`)
  contact.is_read = true
  unreadCount.value = Math.max(0, unreadCount.value - 1)
}

async function markAllRead() {
  await api.post('/dashboard/contacts/mark-all-read')
  contacts.value.forEach(c => c.is_read = true)
  unreadCount.value = 0
}

// When user opens contacts tab, mark all as read automatically
watch(activeTab, (tab) => {
  if (tab === 'contacts' && unreadCount.value > 0) {
    markAllRead()
  }
})

// ── Change Password ───────────────────────────────────
const showChangePassModal = ref(false)
const savingCp  = ref(false)
const cpError   = ref('')
const showCp1   = ref(false)
const showCp2   = ref(false)
const showCp3   = ref(false)
const cpForm    = ref({ current_password: '', new_password: '', new_password_confirmation: '' })

async function submitChangePassword() {
  savingCp.value = true
  cpError.value  = ''
  try {
    await api.post('/dashboard/users/change-password', cpForm.value)
    showChangePassModal.value = false
    cpForm.value = { current_password: '', new_password: '', new_password_confirmation: '' }
    showToast('تم تغيير كلمة المرور بنجاح ✓')
  } catch (e) {
    cpError.value = e.response?.data?.message || 'حدث خطأ'
  } finally {
    savingCp.value = false
  }
}
const contacts        = ref([])
const loadingContacts = ref(false)
const contactSearch   = ref('')
const contactPage     = ref(1)
const contactPages    = ref(1)

async function loadContacts(page = 1) {
  loadingContacts.value = true
  contactPage.value = page
  const { data } = await api.get(`/dashboard/contacts?page=${page}&q=${contactSearch.value}`)
  contacts.value     = data.data
  contactPages.value = data.last_page
  loadingContacts.value = false
}
async function deleteContact(id) {
  if (!confirm('هل تريد حذف هذه الرسالة؟')) return
  await api.delete(`/dashboard/contacts/${id}`)
  contacts.value = contacts.value.filter(c => c.id !== id)
  dashStats.value.total_contacts--
  showToast('تم حذف الرسالة')
}

// ── Services ──────────────────────────────────────────
const allServices      = ref([])
const showServiceModal = ref(false)
const editingService   = ref(null)
const savingSvc        = ref(false)
const emojiMap = { building: '🏗️', fence: '🚧', car: '🚗', pergola: '🌿', other: '🔨' }
const svcForm      = ref({ name: '', name_ar: '', description_ar: '', icon: 'building', image: '', sort_order: 1, is_active: true, points: [] })
const svcPointsText = ref('')

function openServiceModal(sv = null) {
  editingService.value = sv
  if (sv) {
    svcForm.value = { ...sv }
    svcPointsText.value = (sv.points || []).join('\n')
  } else {
    svcForm.value = { name: '', name_ar: '', description_ar: '', icon: 'building', image: '', sort_order: allServices.value.length + 1, is_active: true, points: [] }
    svcPointsText.value = ''
  }
  showServiceModal.value = true
}
async function saveService() {
  savingSvc.value = true
  svcForm.value.points = svcPointsText.value.split('\n').map(l => l.trim()).filter(Boolean)
  try {
    if (editingService.value) {
      const { data } = await api.put(`/dashboard/services/${editingService.value.id}`, svcForm.value)
      const idx = allServices.value.findIndex(s => s.id === data.id)
      if (idx !== -1) allServices.value[idx] = data
      showToast('تم تعديل الخدمة')
    } else {
      const { data } = await api.post('/dashboard/services', svcForm.value)
      allServices.value.push(data)
      showToast('تمت إضافة الخدمة')
    }
    showServiceModal.value = false
    await loadStats()
  } catch { showToast('حدث خطأ', 'error') }
  finally { savingSvc.value = false }
}
async function deleteService(id) {
  if (!confirm('هل تريد حذف هذه الخدمة؟')) return
  await api.delete(`/dashboard/services/${id}`)
  allServices.value = allServices.value.filter(s => s.id !== id)
  await loadStats()
  showToast('تم حذف الخدمة')
}
async function loadServices() {
  const { data } = await api.get('/dashboard/services')
  allServices.value = data
}

// ── Sections ──────────────────────────────────────────
const allSections      = ref([])
const showSectionModal = ref(false)
const editingSection   = ref(null)
const savingSec        = ref(false)
const savingOrder      = ref(false)
const orderChanged     = ref(false)
const dragIdx          = ref(null)
const dragOverIdx      = ref(null)
const typeIcons  = { hero: '🦸', about: 'ℹ️', services: '⚙️', cta: '📣', custom: '✨', partners: '🤝' }
const typeLabels = { hero: 'هيرو', about: 'من نحن', services: 'الخدمات', cta: 'دعوة للتواصل', custom: 'مخصص', partners: 'شركاؤنا' }
const secForm = ref({ key: '', label: '', type: 'custom', sort_order: 1, show_in_nav: true, is_active: true, content: { title: '', text: '', image: 'hero', btn_text: '', btn_link: '' } })

function openSectionModal(sec = null) {
  editingSection.value = sec
  if (sec) {
    secForm.value = {
      key: sec.key, label: sec.label, type: sec.type,
      sort_order: sec.sort_order, show_in_nav: sec.show_in_nav, is_active: sec.is_active,
      content: {
        title: '', text: '', image: 'hero', btn_text: '', btn_link: '',
        blocks: [], children: [], partners: [], services: [],
        ...(sec.content || {}),
      },
    }
    // Populate services from allServices when editing a services section
    if (sec.type === 'services' && !secForm.value.content.services?.length) {
      secForm.value.content.services = allServices.value.map(sv => ({ ...sv }))
    }
    // Populate partners from allPartners when editing a partners section
    if (sec.type === 'partners' && !secForm.value.content.partners?.length) {
      secForm.value.content.partners = allPartners.value.map(p => ({ ...p }))
    }
  } else {
    secForm.value = {
      key: '', label: '', type: 'custom',
      sort_order: allSections.value.length + 1,
      show_in_nav: true, is_active: true,
      content: { title: '', text: '', image: 'hero', btn_text: '', btn_link: '', blocks: [], children: [], partners: [], services: [] },
    }
  }
  showSectionModal.value = true
}

function addChild() {
  if (!secForm.value.content.children) secForm.value.content.children = []
  secForm.value.content.children.push({ icon: '', label: '', desc: '', link: '' })
}
function removeChild(idx) {
  secForm.value.content.children.splice(idx, 1)
}

function addServiceItem() {
  if (!secForm.value.content.services) secForm.value.content.services = []
  secForm.value.content.services.push({ name_ar: '', description_ar: '', icon: 'building', image: '', points: [], is_active: true })
}
function removeServiceItem(idx) {
  secForm.value.content.services.splice(idx, 1)
}

function addPartnerItem() {  if (!secForm.value.content.partners) secForm.value.content.partners = []
  secForm.value.content.partners.push({ name: '', icon: '🏢', logo: '', website: '' })
}
function removePartnerItem(idx) {
  secForm.value.content.partners.splice(idx, 1)
}
async function saveSection() {
  savingSec.value = true
  try {
    if (editingSection.value) {
      const { data } = await api.put(`/dashboard/sections/${editingSection.value.id}`, secForm.value)
      const idx = allSections.value.findIndex(s => s.id === data.id)
      if (idx !== -1) allSections.value[idx] = data

      // Sync services to the services API if editing a services section
      if (secForm.value.type === 'services') {
        await syncServicesFromSection(secForm.value.content.services || [])
      }

      // Sync partners to the partners API if editing a partners section
      if (secForm.value.type === 'partners') {
        await syncPartnersFromSection(secForm.value.content.partners || [])
      }

      showToast('تم تعديل القسم')
    } else {
      const { data } = await api.post('/dashboard/sections', secForm.value)
      allSections.value.push(data)

      // Sync partners on create too
      if (secForm.value.type === 'partners') {
        await syncPartnersFromSection(secForm.value.content.partners || [])
      }

      showToast('تمت إضافة القسم')
    }
    showSectionModal.value = false
    await refreshSections()
    await loadServices()
    await loadPartners()
  } catch { showToast('حدث خطأ', 'error') }
  finally { savingSec.value = false }
}

async function syncServicesFromSection(services) {
  const existingIds = allServices.value.map(s => s.id)
  const incomingIds = services.filter(s => s.id).map(s => s.id)
  for (const id of existingIds) {
    if (!incomingIds.includes(id)) await api.delete(`/dashboard/services/${id}`)
  }
  for (let i = 0; i < services.length; i++) {
    const sv = { ...services[i], sort_order: i + 1 }
    if (sv.id) await api.put(`/dashboard/services/${sv.id}`, sv)
    else await api.post('/dashboard/services', sv)
  }
  await loadStats()
}

async function syncPartnersFromSection(partners) {
  const existingIds = allPartners.value.map(p => p.id)
  const incomingIds = partners.filter(p => p.id).map(p => p.id)
  for (const id of existingIds) {
    if (!incomingIds.includes(id)) await api.delete(`/dashboard/partners/${id}`)
  }
  for (let i = 0; i < partners.length; i++) {
    const p = { ...partners[i], sort_order: i + 1, is_active: true }
    if (p.id) await api.put(`/dashboard/partners/${p.id}`, p)
    else await api.post('/dashboard/partners', p)
  }
}
async function deleteSection(sec) {
  if (['hero','about','services','cta'].includes(sec.key)) return
  if (!confirm(`هل تريد حذف قسم "${sec.label}"؟`)) return
  await api.delete(`/dashboard/sections/${sec.id}`)
  allSections.value = allSections.value.filter(s => s.id !== sec.id)
  await refreshSections()
  showToast('تم حذف القسم')
}
function onDragStart(idx) { dragIdx.value = idx }
function onDragOver(idx) {
  if (dragIdx.value === null || dragIdx.value === idx) return
  dragOverIdx.value = idx
  const arr = [...allSections.value]
  const [moved] = arr.splice(dragIdx.value, 1)
  arr.splice(idx, 0, moved)
  allSections.value = arr
  dragIdx.value = idx
  orderChanged.value = true
}
function onDragEnd() { dragIdx.value = null; dragOverIdx.value = null }
async function saveOrder() {
  savingOrder.value = true
  const order = allSections.value.map((s, i) => ({ id: s.id, sort_order: i + 1 }))
  await api.post('/dashboard/sections/reorder', { order })
  orderChanged.value = false
  savingOrder.value = false
  await refreshSections()
  showToast('تم حفظ الترتيب')
}
async function loadSections() {
  const { data } = await api.get('/dashboard/sections')
  allSections.value = data
}

// ── Partners ──────────────────────────────────────────
const allPartners      = ref([])
const showPartnerModal = ref(false)
const editingPartner   = ref(null)
const savingPartner    = ref(false)
const partnerForm      = ref({ name: '', logo: '', icon: '🏢', website: '', sort_order: 1, is_active: true })

function openPartnerModal(p = null) {
  editingPartner.value = p
  partnerForm.value = p
    ? { ...p }
    : { name: '', logo: '', icon: '🏢', website: '', sort_order: allPartners.value.length + 1, is_active: true }
  showPartnerModal.value = true
}

async function savePartner() {
  savingPartner.value = true
  try {
    if (editingPartner.value) {
      const { data } = await api.put(`/dashboard/partners/${editingPartner.value.id}`, partnerForm.value)
      const idx = allPartners.value.findIndex(p => p.id === data.id)
      if (idx !== -1) allPartners.value[idx] = data
      showToast('تم تعديل الشريك ✓')
    } else {
      const { data } = await api.post('/dashboard/partners', partnerForm.value)
      allPartners.value.push(data)
      showToast('تمت إضافة الشريك ✓')
    }
    showPartnerModal.value = false
  } catch { showToast('حدث خطأ', 'error') }
  finally { savingPartner.value = false }
}

async function deletePartner(id) {
  if (!confirm('هل تريد حذف هذا الشريك؟')) return
  await api.delete(`/dashboard/partners/${id}`)
  allPartners.value = allPartners.value.filter(p => p.id !== id)
  showToast('تم حذف الشريك')
}

async function loadPartners() {
  const { data } = await api.get('/dashboard/partners')
  allPartners.value = data
}

// ── Content Editor ────────────────────────────────────
const form          = ref({})
const savingField   = ref(null)
const savingFeatures = ref(false)

// Auto-save logo when changed via ImagePicker
watch(() => form.value.logo, (val, old) => {
  if (old === undefined) return // skip initial load
  if (val !== old) saveField('logo')
})
const aboutFeaturesList = ref([])
const newFeature    = ref('')

const companyFields = [
  { key: 'company_name_ar',  label: 'اسم الشركة (عربي)' },
  { key: 'company_name',     label: 'اسم الشركة (إنجليزي)' },
  { key: 'whatsapp_number',  label: 'رقم واتساب', placeholder: '966500000000' },
  { key: 'phone',            label: 'رقم الهاتف' },
  { key: 'location',         label: 'الموقع' },
  { key: 'working_hours',    label: 'ساعات العمل' },
]
const heroFields = [
  { key: 'hero_title',    label: 'العنوان الرئيسي' },
  { key: 'hero_subtitle', label: 'النص التعريفي', type: 'textarea' },
  { key: 'hero_badge',    label: 'نص الشارة (Badge)' },
  { key: 'hero_btn1',     label: 'نص الزر الأول' },
  { key: 'hero_btn2',     label: 'نص الزر الثاني' },
]
const aboutFields = [
  { key: 'about_title', label: 'عنوان القسم' },
  { key: 'about_text',  label: 'النص التعريفي', type: 'textarea' },
  { key: 'about_since', label: 'تاريخ التأسيس', placeholder: 'منذ ٢٠١٤' },
]
const ctaFields = [
  { key: 'cta_title',    label: 'عنوان CTA' },
  { key: 'cta_subtitle', label: 'نص CTA', type: 'textarea' },
]

// ── Theme / Colors ────────────────────────────────────
const savingTheme = ref(false)

const colorFields = [
  { key: 'color_primary', label: 'اللون الأساسي',    default: '#3b82f6', desc: 'لون الأزرار والروابط والـ accents' },
  { key: 'color_accent',  label: 'اللون الثانوي',    default: '#8b5cf6', desc: 'لون التدرج والعناصر الثانوية' },
  { key: 'color_dark',    label: 'لون الخلفية',      default: '#030712', desc: 'الخلفية الرئيسية للموقع' },
  { key: 'color_text',    label: 'لون النص',         default: '#f1f5f9', desc: 'لون النصوص الرئيسية' },
]

const colorPresets = [
  { name: 'نيون أزرق',   color_primary: '#3b82f6', color_accent: '#8b5cf6', color_dark: '#030712', color_text: '#f1f5f9' },
  { name: 'زمردي',       color_primary: '#10b981', color_accent: '#06b6d4', color_dark: '#022c22', color_text: '#ecfdf5' },
  { name: 'ذهبي فاخر',  color_primary: '#f59e0b', color_accent: '#ef4444', color_dark: '#0d0d0d', color_text: '#fef3c7' },
  { name: 'وردي ساطع',  color_primary: '#ec4899', color_accent: '#8b5cf6', color_dark: '#0f0a1e', color_text: '#fdf2f8' },
  { name: 'برتقالي',    color_primary: '#f97316', color_accent: '#eab308', color_dark: '#0c0a09', color_text: '#fff7ed' },
  { name: 'سماوي',      color_primary: '#06b6d4', color_accent: '#3b82f6', color_dark: '#042f2e', color_text: '#ecfeff' },
  { name: 'أحمر',       color_primary: '#ef4444', color_accent: '#f97316', color_dark: '#0c0a09', color_text: '#fef2f2' },
  { name: 'أبيض نظيف',  color_primary: '#6366f1', color_accent: '#8b5cf6', color_dark: '#ffffff', color_text: '#1e1b4b' },
]

const fontOptions = [
  { label: 'تجوال',    value: 'Tajawal' },
  { label: 'كايرو',    value: 'Cairo' },
  { label: 'أميري',    value: 'Amiri' },
  { label: 'إنتر',     value: 'Inter' },
  { label: 'بوبينز',   value: 'Poppins' },
  { label: 'رالوي',    value: 'Raleway' },
]

const previewBarStyle = computed(() => ({
  background: form.value.color_dark || '#030712',
  border: `1px solid ${form.value.color_primary || '#3b82f6'}33`,
}))

function isActivePreset(preset) {
  return (
    form.value.color_primary === preset.color_primary &&
    form.value.color_accent  === preset.color_accent  &&
    form.value.color_dark    === preset.color_dark
  )
}

function applyPreset(preset) {
  form.value.color_primary = preset.color_primary
  form.value.color_accent  = preset.color_accent
  form.value.color_dark    = preset.color_dark
  form.value.color_text    = preset.color_text
  previewColors(form.value)
}

function onColorInput(key, value) {
  form.value[key] = value
  // Live preview on every change
  previewColors(form.value)
}

function onFontChange(fontValue) {
  form.value.font_family = fontValue
  previewColors(form.value)
  // Load font dynamically if not already loaded
  loadGoogleFont(fontValue)
}

function loadGoogleFont(family) {
  const id = `gfont-${family.replace(/\s+/g, '-')}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id   = id
  link.rel  = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700;900&display=swap`
  document.head.appendChild(link)
}

async function saveTheme() {
  savingTheme.value = true
  try {
    const payload = {
      color_primary: form.value.color_primary,
      color_accent:  form.value.color_accent,
      color_dark:    form.value.color_dark,
      color_text:    form.value.color_text,
      font_family:   form.value.font_family,
    }
    await api.put('/dashboard/settings', payload)
    await refreshSettings()
    showToast('تم حفظ التصميم وتطبيقه ✓')
  } catch { showToast('حدث خطأ', 'error') }
  finally { savingTheme.value = false }
}

async function saveField(key) {
  savingField.value = key
  try {
    const val = form.value[key]
    // Send only the specific field, convert null/undefined to empty string
    await api.put('/dashboard/settings', { [key]: val ?? '' })
    await refreshSettings()
    showToast('تم الحفظ ✓')
  } catch { showToast('حدث خطأ', 'error') }
  finally { savingField.value = null }
}

async function removeLogo() {
  form.value.logo = ''
  await saveField('logo')
}

async function saveFields(keys) {
  const groupKey = keys[0].replace(/_num|_label/, '')
  savingField.value = groupKey
  const payload = {}
  keys.forEach(k => payload[k] = form.value[k])
  try {
    await api.put('/dashboard/settings', payload)
    await refreshSettings()
    showToast('تم الحفظ ✓')
  } catch { showToast('حدث خطأ', 'error') }
  finally { savingField.value = null }
}

function addFeature() {
  if (!newFeature.value.trim()) return
  aboutFeaturesList.value.push(newFeature.value.trim())
  newFeature.value = ''
}
function removeFeature(idx) {
  aboutFeaturesList.value.splice(idx, 1)
}
async function saveFeatures() {
  savingFeatures.value = true
  try {
    const val = JSON.stringify(aboutFeaturesList.value.filter(Boolean))
    await api.put('/dashboard/settings', { about_features: val })
    await refreshSettings()
    showToast('تم حفظ المميزات ✓')
  } catch { showToast('حدث خطأ', 'error') }
  finally { savingFeatures.value = false }
}

async function loadSettingsForm() {
  const { data } = await api.get('/settings')
  form.value = { ...data }
  try { aboutFeaturesList.value = JSON.parse(data.about_features || '[]') } catch { aboutFeaturesList.value = [] }
}

// ── Media ──────────────────────────────────────────────
const mediaImages   = ref([])
const mediaLoading  = ref(false)
const mediaUploading = ref([])
const mediaDragging = ref(false)

async function loadMedia() {
  mediaLoading.value = true
  try {
    const { data } = await api.get('/dashboard/media')
    mediaImages.value = data
  } catch { mediaImages.value = [] }
  finally { mediaLoading.value = false }
}

async function uploadMediaFile(file) {
  const item = { name: file.name, progress: 0 }
  mediaUploading.value.push(item)
  const fd = new FormData()
  fd.append('image', file)
  try {
    const { data } = await api.post('/dashboard/media/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => { item.progress = Math.round((e.loaded / e.total) * 100) },
    })
    mediaImages.value.unshift(data)
    showToast('تم رفع الصورة ✓')
  } catch { showToast('فشل رفع الصورة', 'error') }
  finally { mediaUploading.value = mediaUploading.value.filter(u => u !== item) }
}

function uploadMediaFiles(e) {
  Array.from(e.target.files).forEach(uploadMediaFile)
  e.target.value = ''
}

function onMediaDrop(e) {
  mediaDragging.value = false
  Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).forEach(uploadMediaFile)
}

async function deleteMediaImage(img) {
  if (!confirm(`حذف "${img.name}"؟`)) return
  await api.delete('/dashboard/media', { data: { name: img.name } })
  mediaImages.value = mediaImages.value.filter(i => i.name !== img.name)
  showToast('تم الحذف')
}

function copyUrl(url) {
  navigator.clipboard.writeText(url)
  showToast('تم نسخ الرابط 📋')
}

// ── Users ──────────────────────────────────────────────
const users        = ref([])
const loadingUsers = ref(false)
const showUserModal = ref(false)
const editingUser  = ref(null)
const savingUser   = ref(false)
const showUserPass = ref(false)
const userError    = ref('')
const userForm     = ref({ name: '', email: '', password: '' })

async function loadUsers() {
  loadingUsers.value = true
  try {
    const { data } = await api.get('/dashboard/users')
    users.value = data
  } finally {
    loadingUsers.value = false
  }
}

function openUserModal(u = null) {
  editingUser.value = u
  showUserPass.value = false
  userError.value = ''
  userForm.value = u
    ? { name: u.name, email: u.email, password: '' }
    : { name: '', email: '', password: '' }
  showUserModal.value = true
}

async function saveUser() {
  savingUser.value = true
  userError.value = ''
  try {
    const payload = { ...userForm.value }
    if (editingUser.value && !payload.password) delete payload.password

    if (editingUser.value) {
      const { data } = await api.put(`/dashboard/users/${editingUser.value.id}`, payload)
      const idx = users.value.findIndex(u => u.id === data.id)
      if (idx !== -1) users.value[idx] = data
      showToast('تم تعديل المستخدم ✓')
    } else {
      const { data } = await api.post('/dashboard/users', payload)
      users.value.unshift(data)
      showToast('تمت إضافة المستخدم ✓')
    }
    showUserModal.value = false
  } catch (e) {
    const errors = e.response?.data?.errors
    userError.value = errors
      ? Object.values(errors).flat().join(' | ')
      : (e.response?.data?.message || 'حدث خطأ')
  } finally {
    savingUser.value = false
  }
}

async function deleteUser(u) {
  if (!confirm(`هل تريد حذف المستخدم "${u.name}"؟`)) return
  try {
    await api.delete(`/dashboard/users/${u.id}`)
    users.value = users.value.filter(x => x.id !== u.id)
    showToast('تم حذف المستخدم')
  } catch (e) {
    showToast(e.response?.data?.message || 'حدث خطأ', 'error')
  }
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  await Promise.all([loadStats(), loadContacts(), loadServices(), loadSections(), loadPartners(), loadSettingsForm(), loadMedia(), loadUsers()])
  await fetchUnreadCount()
  pollTimer = setInterval(fetchUnreadCount, 30000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
/* ── Layout ── */
.dash-layout { display: flex; min-height: 100vh; background: var(--bg); direction: rtl; }

/* ── Sidebar ── */
.sidebar { width: 256px; background: var(--bg2); border-left: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.sidebar-brand { display: flex; align-items: center; gap: 12px; padding: 20px 16px; border-bottom: 1px solid var(--border); }
.brand-logo { width: 38px; height: 38px; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 4px 14px rgba(59,130,246,0.35); }
.brand-text .name { display: block; color: var(--text); font-size: 0.92rem; font-weight: 800; }
.brand-text .sub  { display: block; color: var(--neon-cyan); font-size: 0.62rem; letter-spacing: 1.5px; opacity: 0.8; }
.sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 3px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 13px; border-radius: 10px; background: none; border: 1px solid transparent; color: var(--text-muted); font-family: 'Tajawal', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s var(--ease); text-align: right; width: 100%; }
.nav-item:hover { background: var(--glass); color: var(--text); border-color: var(--border); }
.nav-item.active { background: rgba(59,130,246,0.1); color: var(--neon-blue); border-color: rgba(59,130,246,0.2); }
.nav-icon { font-size: 1rem; }
.nav-badge { margin-right: auto; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 50px; }
.sidebar-back { display: flex; align-items: center; gap: 8px; padding: 12px 16px; color: var(--text-muted); font-size: 0.82rem; border-top: 1px solid var(--border); transition: color 0.2s; text-decoration: none; }
.sidebar-back:hover { color: var(--neon-blue); }
.sidebar-change-pass {
  display: flex; align-items: center; gap: 8px; padding: 11px 16px;
  color: var(--text-muted); font-size: 0.82rem; border: none;
  background: none; font-family: 'Tajawal', sans-serif; cursor: pointer;
  width: 100%; text-align: right; transition: all 0.2s;
  border-top: 1px solid var(--border);
}
.sidebar-change-pass:hover { color: var(--neon-blue); background: rgba(59,130,246,0.06); }
.sidebar-logout { display: flex; align-items: center; gap: 8px; padding: 11px 16px; color: rgba(248,113,113,0.7); font-size: 0.82rem; border: none; background: none; font-family: 'Tajawal', sans-serif; cursor: pointer; width: 100%; text-align: right; transition: all 0.2s; border-top: 1px solid var(--border); }
.sidebar-logout:hover { color: #f87171; background: rgba(248,113,113,0.06); }
.nav-badge--red { background: #ef4444 !important; color: white !important; animation: pulse-badge 1.5s ease-in-out infinite; }
@keyframes pulse-badge { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
.unread-dot { display: inline-block; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; margin-left: 6px; flex-shrink: 0; box-shadow: 0 0 6px rgba(239,68,68,0.6); }
.btn-mark-all { padding: 8px 16px; background: rgba(74,222,128,0.08); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); border-radius: 10px; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.btn-mark-all:hover { background: rgba(74,222,128,0.14); }

/* ── Main ── */
.dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.dash-topbar { background: var(--bg2); padding: 14px 24px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(12px); }
.menu-toggle { display: none; background: none; border: none; font-size: 1.3rem; cursor: pointer; color: var(--text-muted); }
.topbar-title { font-size: 1.05rem; font-weight: 800; color: var(--text); flex: 1; }
.topbar-date  { font-size: 0.8rem; color: var(--text-muted); }
.dash-content { padding: 24px; flex: 1; }

/* ── Stats ── */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-box { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s var(--ease); }
.stat-box:hover { border-color: rgba(59,130,246,0.3); box-shadow: 0 0 20px rgba(59,130,246,0.08); }
.stat-box-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
.stat-box-num   { font-size: 1.6rem; font-weight: 900; color: var(--text); line-height: 1; }
.stat-box-label { font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; }

/* ── Card ── */
.card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; margin-bottom: 20px; }
.card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.card-head h2 { font-size: 0.97rem; font-weight: 800; color: var(--text); }
.link-btn { background: none; border: none; color: var(--neon-blue); font-family: 'Tajawal', sans-serif; font-size: 0.85rem; font-weight: 700; cursor: pointer; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.data-table th { background: rgba(255,255,255,0.03); padding: 10px 13px; text-align: right; font-weight: 700; color: var(--text-muted); font-size: 0.8rem; white-space: nowrap; border-bottom: 1px solid var(--border); }
.data-table td { padding: 12px 13px; border-bottom: 1px solid var(--border); vertical-align: middle; color: var(--text); }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--glass); }
.td-id { color: var(--text-muted); font-size: 0.8rem; }
.td-name { font-weight: 700; color: var(--text); }
.td-msg { color: var(--text-muted); max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.td-date { color: var(--text-muted); font-size: 0.8rem; white-space: nowrap; }
.empty-row { text-align: center; color: var(--text-muted); padding: 40px; }
.phone-link { color: var(--neon-blue); font-weight: 600; }
.wa-link { color: #4ade80; font-weight: 600; white-space: nowrap; }
.del-btn { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 4px 8px; border-radius: 6px; transition: background 0.2s; }
.del-btn:hover { background: rgba(248,113,113,0.1); }

/* ── Page actions ── */
.page-actions { margin-bottom: 18px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.search-wrap { position: relative; }
.search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.85rem; }
.search-input { padding: 9px 34px 9px 13px; border: 1px solid var(--border); border-radius: 10px; font-family: 'Tajawal', sans-serif; font-size: 0.9rem; direction: rtl; background: var(--bg2); color: var(--text); width: 260px; transition: all 0.2s; }
.search-input:focus { outline: none; border-color: var(--neon-blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.search-input::placeholder { color: var(--text-muted); }
.btn-add { padding: 9px 20px; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; border: none; border-radius: 10px; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s var(--ease); }
.btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.4); }
.hint-text { font-size: 0.8rem; color: var(--text-muted); }

/* ── Pagination ── */
.pagination { display: flex; gap: 6px; justify-content: center; margin-top: 18px; }
.page-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg2); color: var(--text-muted); font-family: 'Tajawal', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.page-btn.active { background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); border-color: transparent; color: white; }
.page-btn:hover:not(.active) { border-color: var(--neon-blue); color: var(--neon-blue); }

/* ── Editor Cards (Services) ── */
.editor-list { display: flex; flex-direction: column; gap: 12px; }
.editor-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all 0.2s var(--ease); }
.editor-card:hover { border-color: rgba(59,130,246,0.25); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.editor-card-header { display: flex; align-items: center; gap: 12px; padding: 16px 18px; flex-wrap: wrap; }
.editor-card-icon { width: 44px; height: 44px; background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; overflow: hidden; }
.svc-thumb { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }
.editor-card-title { flex: 1; min-width: 140px; }
.editor-card-title strong { display: block; font-size: 0.93rem; font-weight: 800; color: var(--text); }
.editor-card-title span { font-size: 0.8rem; color: var(--text-muted); }
.editor-card-badges { display: flex; align-items: center; gap: 8px; }
.editor-card-actions { display: flex; gap: 8px; }
.sort-chip { font-size: 0.72rem; color: var(--text-muted); background: var(--glass); padding: 3px 10px; border-radius: 50px; border: 1px solid var(--border); }
.points-preview { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 18px 14px; }
.point-chip { background: rgba(59,130,246,0.08); color: var(--neon-blue); border: 1px solid rgba(59,130,246,0.15); padding: 3px 10px; border-radius: 50px; font-size: 0.76rem; font-weight: 600; }
.empty-state { text-align: center; color: var(--text-muted); padding: 60px; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); }

/* ── Sections ── */
.sections-list { display: flex; flex-direction: column; gap: 8px; }
.section-row { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; cursor: grab; transition: all 0.2s var(--ease); }
.section-row:active { cursor: grabbing; }
.section-row.dragging { opacity: 0.5; border-color: var(--neon-blue); }
.section-row.drag-over { border-color: var(--neon-blue); background: rgba(59,130,246,0.05); }
.drag-handle { font-size: 1.2rem; color: var(--text-muted); cursor: grab; user-select: none; }
.sec-order-badge { width: 26px; height: 26px; background: var(--glass); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); flex-shrink: 0; }
.sec-type-icon { font-size: 1.3rem; flex-shrink: 0; }
.sec-info { flex: 1; min-width: 120px; }
.sec-info strong { display: block; font-size: 0.93rem; font-weight: 800; color: var(--text); }
.sec-type-tag { font-size: 0.76rem; color: var(--text-muted); }
.sec-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.sec-actions { display: flex; gap: 8px; }
.save-order-bar { display: flex; align-items: center; justify-content: space-between; background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.2); border-radius: 10px; padding: 12px 18px; margin-top: 14px; font-size: 0.88rem; font-weight: 600; color: var(--neon-blue); }

/* ── Badges ── */
.badge { padding: 3px 10px; border-radius: 50px; font-size: 0.72rem; font-weight: 700; }
.badge-green { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
.badge-gray  { background: var(--glass); color: var(--text-muted); border: 1px solid var(--border); }
.badge-blue  { background: rgba(59,130,246,0.1); color: var(--neon-blue); border: 1px solid rgba(59,130,246,0.2); }
.act-btn { padding: 6px 13px; border-radius: 8px; border: none; font-family: 'Tajawal', sans-serif; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.act-btn.edit { background: rgba(59,130,246,0.1); color: var(--neon-blue); }
.act-btn.edit:hover { background: rgba(59,130,246,0.18); }
.act-btn.del  { background: rgba(248,113,113,0.1); color: #f87171; }
.act-btn.del:hover  { background: rgba(248,113,113,0.18); }
.act-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Content Editor ── */
.editor-tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.etab { padding: 9px 18px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg2); font-family: 'Tajawal', sans-serif; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s; color: var(--text-muted); }
.etab.active { background: rgba(59,130,246,0.1); color: var(--neon-blue); border-color: rgba(59,130,246,0.25); }
.editor-section { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
.editor-section-title { font-size: 0.9rem; font-weight: 800; color: var(--text); padding-bottom: 10px; border-bottom: 1px solid var(--border); margin-bottom: 18px; }

/* Logo editor */
.logo-editor { display: flex; align-items: center; gap: 20px; padding: 16px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 20px; }
.logo-preview { width: 80px; height: 80px; flex-shrink: 0; border-radius: 12px; border: 1px solid var(--border); background: var(--bg2); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.logo-preview-img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
.logo-preview-placeholder { font-size: 2.2rem; }
.logo-editor-info { flex: 1; }
.logo-editor-label { font-size: 0.9rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
.logo-editor-hint { font-size: 0.78rem; color: var(--text-muted); }
.field-list { display: flex; flex-direction: column; gap: 10px; }
.field-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--bg); border-radius: 10px; border: 1px solid var(--border); transition: border-color 0.2s; }
.field-row:focus-within { border-color: var(--neon-blue); }
.field-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); min-width: 130px; flex-shrink: 0; }
.field-input-wrap { flex: 1; }
.field-input { width: 100%; padding: 7px 11px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.9rem; color: var(--text); background: var(--bg2); direction: rtl; transition: border-color 0.2s; resize: vertical; }
.field-input:focus { outline: none; border-color: var(--neon-blue); }
.field-save-btn { padding: 7px 13px; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; flex-shrink: 0; transition: all 0.2s; }
.field-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,130,246,0.4); }
.field-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.stats-editor { display: flex; flex-direction: column; gap: 10px; }
.stat-editor-row { display: flex; align-items: flex-end; gap: 10px; padding: 12px 14px; background: var(--bg); border-radius: 10px; border: 1px solid var(--border); }
.stat-editor-num, .stat-editor-label { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.stat-editor-num label, .stat-editor-label label { font-size: 0.76rem; font-weight: 700; color: var(--text-muted); }
.stat-editor-num input, .stat-editor-label input { padding: 7px 11px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.9rem; direction: rtl; background: var(--bg2); color: var(--text); }
.stat-editor-num input:focus, .stat-editor-label input:focus { outline: none; border-color: var(--neon-blue); }
.features-editor { display: flex; flex-direction: column; gap: 8px; }
.feature-row { display: flex; align-items: center; gap: 8px; }
.feature-input { flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.9rem; direction: rtl; background: var(--bg2); color: var(--text); }
.feature-input:focus { outline: none; border-color: var(--neon-blue); }
.feat-del-btn { width: 30px; height: 30px; background: rgba(248,113,113,0.1); color: #f87171; border: none; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 800; flex-shrink: 0; }
.feat-del-btn:hover { background: rgba(248,113,113,0.18); }
.feature-add-row { display: flex; gap: 8px; }
.feat-add-btn { padding: 8px 16px; background: rgba(59,130,246,0.1); color: var(--neon-blue); border: none; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-weight: 700; cursor: pointer; white-space: nowrap; }
.feat-add-btn:hover { background: rgba(59,130,246,0.18); }
.btn-save-features { align-self: flex-start; padding: 9px 22px; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; border: none; border-radius: 10px; font-family: 'Tajawal', sans-serif; font-weight: 800; cursor: pointer; margin-top: 4px; }
.btn-save-features:disabled { opacity: 0.6; cursor: not-allowed; }
.colors-editor { display: flex; flex-direction: column; gap: 10px; }
.color-editor-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg); border-radius: 10px; border: 1px solid var(--border); }
.color-editor-row label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); min-width: 110px; }
.color-picker-lg { width: 44px; height: 34px; padding: 2px; border-radius: 8px; border: 1px solid var(--border); cursor: pointer; flex-shrink: 0; background: none; }
.color-hex-input { flex: 1; padding: 7px 11px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.88rem; background: var(--bg2); color: var(--text); }
.color-hex-input:focus { outline: none; border-color: var(--neon-blue); }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(8px); }
.modal { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; }
.modal-wide { max-width: 820px; }
.pb-section-title { font-size: 0.9rem; font-weight: 800; color: var(--text); padding: 14px 0 8px; border-top: 1px solid var(--border); margin-top: 8px; }
.pb-field-inline { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.pb-field-inline label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); white-space: nowrap; }
.pb-title-input { flex: 1; padding: 9px 13px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.9rem; direction: rtl; background: var(--bg); color: var(--text); }
.pb-title-input:focus { outline: none; border-color: var(--neon-blue); }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid var(--border); }
.modal-head h2 { font-size: 1.05rem; font-weight: 800; color: var(--text); }
.modal-close { background: var(--glass); border: 1px solid var(--border); font-size: 1.1rem; cursor: pointer; color: var(--text-muted); padding: 4px 8px; border-radius: 6px; }
.modal-close:hover { background: rgba(248,113,113,0.1); color: #f87171; }
.modal-form { padding: 22px; }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border); }
.btn-cancel { padding: 9px 20px; background: var(--glass); border: 1px solid var(--border); color: var(--text-muted); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-weight: 700; cursor: pointer; }
.btn-save { padding: 10px 26px; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; border: none; border-radius: 10px; font-family: 'Tajawal', sans-serif; font-weight: 800; font-size: 0.93rem; cursor: pointer; transition: all 0.2s; }
.btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,130,246,0.4); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.fg { display: flex; flex-direction: column; gap: 5px; }
.fg.full { grid-column: 1 / -1; }
.fg label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
.fg input, .fg textarea, .fg select { padding: 9px 13px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.9rem; color: var(--text); background: var(--bg); direction: rtl; transition: all 0.2s; }
.fg input:focus, .fg textarea:focus, .fg select:focus { outline: none; border-color: var(--neon-blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.fg textarea { resize: vertical; }
.fg select option { background: var(--bg2); }
.toggle-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.88rem; font-weight: 600; color: var(--text); }
.toggle-label input { width: 15px; height: 15px; accent-color: var(--neon-blue); }

/* ── Users ── */
.user-avatar { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple)); color: white; font-weight: 900; font-size: 0.82rem; margin-left: 8px; flex-shrink: 0; }
.td-name { display: flex; align-items: center; font-weight: 700; color: var(--text); }
.pass-field-wrap { position: relative; }
.pass-field-wrap input { width: 100%; padding-left: 38px; }
.pass-eye { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 0.95rem; opacity: 0.4; }
.pass-eye:hover { opacity: 0.8; }
.pass-hint { font-size: 0.73rem; color: var(--text-muted); margin-top: 4px; display: block; }
.user-error { background: rgba(248,113,113,0.08); color: #f87171; border: 1px solid rgba(248,113,113,0.2); padding: 9px 13px; border-radius: 8px; font-size: 0.85rem; margin-top: 8px; }

/* ── Toast ── */
.toast { position: fixed; bottom: 28px; right: 28px; padding: 12px 22px; border-radius: var(--radius); font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 0.92rem; z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,0.4); backdrop-filter: blur(12px); }
.toast.success { background: rgba(10,15,30,0.95); color: var(--neon-blue); border: 1px solid rgba(59,130,246,0.3); }
.toast.error   { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px); }

/* ── Media ── */
.media-drop-zone {
  border: 2px dashed var(--border); border-radius: var(--radius); padding: 24px;
  text-align: center; cursor: pointer; transition: all 0.2s;
  background: var(--bg2); margin-bottom: 18px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.media-drop-zone:hover, .media-drop-zone--drag { border-color: var(--neon-blue); background: rgba(59,130,246,0.04); }
.media-drop-zone span { font-size: 1.8rem; }
.media-drop-zone p { font-size: 0.88rem; color: var(--text-muted); }
.media-drop-zone small { font-size: 0.73rem; color: var(--text-dim); }
.media-progress-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.media-progress-item { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; background: var(--bg2); border: 1px solid var(--border); padding: 7px 12px; border-radius: 8px; color: var(--text-muted); }
.media-progress-bar { flex: 1; height: 5px; background: var(--glass); border-radius: 3px; overflow: hidden; }
.media-progress-fill { height: 100%; background: linear-gradient(90deg, var(--neon-blue), var(--neon-cyan)); border-radius: 3px; transition: width 0.2s; }
.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.media-item { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 4/3; background: var(--bg2); border: 1px solid var(--border); }
.media-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.media-item-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  opacity: 0; transition: opacity 0.2s;
}
.media-item:hover .media-item-overlay { opacity: 1; }
.media-copy-btn, .media-del-btn { width: 30px; height: 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }
.media-copy-btn { background: rgba(255,255,255,0.15); color: white; }
.media-del-btn  { background: rgba(239,68,68,0.8); color: white; }
.media-item-name { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: rgba(255,255,255,0.7); font-size: 0.66rem; padding: 3px 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── Children / Dropdown editor ── */
.children-list { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.child-row { display: flex; align-items: flex-end; gap: 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px; }
.child-fields { display: flex; gap: 10px; flex: 1; flex-wrap: wrap; }
.child-del-btn { width: 30px; height: 30px; border: none; background: rgba(248,113,113,0.1); color: #f87171; border-radius: 8px; cursor: pointer; font-size: 0.8rem; flex-shrink: 0; align-self: flex-end; }
.child-del-btn:hover { background: rgba(248,113,113,0.18); }
.child-add-btn { align-self: flex-start; padding: 8px 18px; background: rgba(59,130,246,0.1); color: var(--neon-blue); border: none; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; margin-top: 4px; }
.child-add-btn:hover { background: rgba(59,130,246,0.18); }
.child-link-select { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.88rem; direction: rtl; background: var(--bg2); color: var(--text); }

/* ── Theme Editor ── */
.theme-editor { display: flex; flex-direction: column; gap: 20px; }

.theme-preview-bar {
  border-radius: var(--radius); padding: 14px 18px;
  transition: all 0.3s var(--ease);
}
.preview-bar-inner { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.preview-dot { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.preview-text { font-size: 0.9rem; font-weight: 700; flex: 1; min-width: 120px; }
.preview-btn-sample { padding: 6px 16px; border-radius: 50px; color: white; font-size: 0.8rem; font-weight: 700; font-family: 'Tajawal', sans-serif; }

.theme-presets-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
.theme-presets { display: flex; flex-wrap: wrap; gap: 8px; }
.preset-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 14px; border-radius: 50px;
  border: 1px solid var(--border); background: var(--bg);
  color: var(--text-muted); font-family: 'Tajawal', sans-serif;
  font-size: 0.82rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s var(--ease);
}
.preset-chip:hover { border-color: var(--neon-blue); color: var(--text); }
.preset-chip.active { border-color: var(--neon-blue); color: var(--neon-blue); background: rgba(var(--accent-rgb),0.08); }
.preset-swatch { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; }

.color-pickers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.color-picker-card {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 14px;
  display: flex; flex-direction: column; gap: 8px;
  transition: border-color 0.2s;
}
.color-picker-card:hover { border-color: rgba(var(--accent-rgb),0.3); }
.cpc-label { font-size: 0.8rem; font-weight: 800; color: var(--text); }
.cpc-body { display: flex; align-items: center; gap: 10px; }
.cpc-swatch-wrap { position: relative; width: 40px; height: 40px; flex-shrink: 0; }
.cpc-native { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
.cpc-swatch { width: 40px; height: 40px; border-radius: 10px; border: 2px solid var(--border); pointer-events: none; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.cpc-hex {
  flex: 1; padding: 8px 10px; border: 1px solid var(--border);
  border-radius: 8px; font-family: 'Inter', monospace; font-size: 0.85rem;
  background: var(--bg2); color: var(--text); letter-spacing: 1px;
  transition: border-color 0.2s;
}
.cpc-hex:focus { outline: none; border-color: var(--neon-blue); }
.cpc-desc { font-size: 0.74rem; color: var(--text-muted); }

.font-section { display: flex; flex-direction: column; gap: 10px; }
.font-section-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
.font-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.font-chip {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 12px 8px; border-radius: var(--radius);
  border: 1px solid var(--border); background: var(--bg);
  cursor: pointer; transition: all 0.2s var(--ease);
}
.font-chip:hover { border-color: rgba(var(--accent-rgb),0.3); }
.font-chip.active { border-color: var(--neon-blue); background: rgba(var(--accent-rgb),0.08); }
.font-chip-name { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); font-family: 'Tajawal', sans-serif; }
.font-chip-sample { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.font-chip.active .font-chip-name { color: var(--neon-blue); }

.theme-save-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 28px; width: 100%;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
  color: white; border: none; border-radius: var(--radius);
  font-family: 'Tajawal', sans-serif; font-size: 0.97rem; font-weight: 800;
  cursor: pointer; transition: all 0.3s var(--ease);
  background-size: 200% 200%;
}
.theme-save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(var(--accent-rgb),0.45);
}
.theme-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }

@media (max-width: 600px) {
  .color-pickers-grid { grid-template-columns: 1fr; }
  .font-grid { grid-template-columns: repeat(2, 1fr); }
}
.spinner { width: 26px; height: 26px; border: 3px solid rgba(59,130,246,0.15); border-top-color: var(--neon-blue); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 20px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Partners / Services inline editor ── */
.partners-editor-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }

.partner-editor-row {
  display: flex; align-items: flex-start; gap: 12px;
  background: var(--bg); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 14px;
  transition: border-color 0.2s;
}
.partner-editor-row:hover { border-color: rgba(var(--accent-rgb, 59,130,246), 0.3); }

.partner-editor-preview {
  width: 56px; height: 56px; flex-shrink: 0;
  border-radius: 10px; border: 1px solid var(--border);
  background: var(--bg2);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; font-size: 1.5rem;
}
.partner-editor-img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
.partner-editor-icon { font-size: 1.5rem; }

.partner-editor-fields {
  flex: 1; display: flex; flex-wrap: wrap; gap: 10px;
}
.partner-editor-fields .fg {
  display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 140px;
}
.partner-editor-fields .fg.full { flex-basis: 100%; }
.partner-editor-fields label {
  font-size: 0.75rem; font-weight: 700; color: var(--text-muted);
}
.partner-editor-fields input,
.partner-editor-fields select,
.partner-editor-fields textarea {
  padding: 8px 11px;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text);
  font-family: 'Tajawal', sans-serif; font-size: 0.88rem;
  direction: rtl; transition: border-color 0.2s;
  width: 100%;
}
.partner-editor-fields input:focus,
.partner-editor-fields select:focus,
.partner-editor-fields textarea:focus {
  outline: none; border-color: var(--neon-blue);
  background: rgba(59,130,246,0.04);
}
.partner-editor-fields textarea { resize: vertical; }
.partner-editor-fields .toggle-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.85rem; color: var(--text-muted); cursor: pointer;
}

.partner-editor-del {
  width: 30px; height: 30px; flex-shrink: 0;
  border: none; border-radius: 8px;
  background: rgba(248,113,113,0.1); color: #f87171;
  cursor: pointer; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; margin-top: 2px;
}
.partner-editor-del:hover { background: rgba(248,113,113,0.22); }

.partners-editor-empty {
  text-align: center; color: var(--text-muted);
  padding: 24px; background: var(--bg2);
  border: 1px dashed var(--border); border-radius: var(--radius);
  font-size: 0.88rem;
}

.partner-add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  background: rgba(59,130,246,0.1); color: var(--neon-blue);
  border: 1px dashed rgba(59,130,246,0.35); border-radius: 8px;
  font-family: 'Tajawal', sans-serif; font-size: 0.88rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s; margin-top: 4px;
}
.partner-add-btn:hover {
  background: rgba(59,130,246,0.18);
  border-color: var(--neon-blue);
}

/* ── Mobile ── */
.side-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99; backdrop-filter: blur(4px); }
@media (max-width: 768px) {
  .sidebar { position: fixed; right: 0; top: 0; height: 100vh; z-index: 100; transform: translateX(100%); transition: transform 0.3s var(--ease); }
  .sidebar.open { transform: translateX(0); }
  .menu-toggle { display: block; }
  .dash-content { padding: 14px; }
  .form-grid { grid-template-columns: 1fr; }
  .fg.full { grid-column: 1; }
  .field-row { flex-wrap: wrap; }
  .field-label { min-width: 100%; }
}
</style>
