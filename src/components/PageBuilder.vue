<template>
  <div class="pb-wrap">
    <div class="pb-blocks" v-if="blocks.length">
      <div v-for="(block, idx) in blocks" :key="block.id" class="pb-block" :class="{ 'pb-block--active': activeBlock === block.id }">
        <div class="pb-block-header" @click="toggleBlock(block.id)">
          <div class="pb-block-left">
            <span class="pb-block-icon">{{ blockMeta[block.type]?.icon }}</span>
            <span class="pb-block-name">{{ blockMeta[block.type]?.label }}</span>
            <span class="pb-block-preview">{{ getPreview(block) }}</span>
          </div>
          <div class="pb-block-actions" @click.stop>
            <!-- Size -->
            <div class="pb-size-btns" title="الحجم">
              <button type="button" v-for="s in sizes" :key="s.v"
                class="pb-size-btn" :class="{ active: (block.layout?.size || 'md') === s.v }"
                @click="setLayout(block, 'size', s.v)" :title="s.l">{{ s.i }}</button>
            </div>
            <!-- Width -->
            <div class="pb-size-btns" title="العرض">
              <button type="button" v-for="w in widths" :key="w.v"
                class="pb-size-btn" :class="{ active: (block.layout?.width || 'full') === w.v }"
                @click="setLayout(block, 'width', w.v)" :title="w.l">{{ w.i }}</button>
            </div>
            <!-- Direction: inline or block -->
            <div class="pb-size-btns" title="الاتجاه">
              <button type="button"
                class="pb-size-btn" :class="{ active: !(block.layout?.inline) }"
                @click="setLayout(block, 'inline', false)" title="تحت بعض">☰</button>
              <button type="button"
                class="pb-size-btn" :class="{ active: block.layout?.inline === '1/2' }"
                @click="setLayout(block, 'inline', '1/2')" title="نصف العرض">⬜⬜</button>
              <button type="button"
                class="pb-size-btn" :class="{ active: block.layout?.inline === '1/3' }"
                @click="setLayout(block, 'inline', '1/3')" title="ثلث العرض">▪▪▪</button>
              <button type="button"
                class="pb-size-btn" :class="{ active: block.layout?.inline === '2/3' }"
                @click="setLayout(block, 'inline', '2/3')" title="ثلثان">▬▪</button>
            </div>
            <button type="button" class="pb-btn-order" @click="moveBlock(idx, -1)" :disabled="idx === 0">↑</button>
            <button type="button" class="pb-btn-order" @click="moveBlock(idx, 1)" :disabled="idx === blocks.length - 1">↓</button>
            <button type="button" class="pb-btn-del" @click="removeBlock(block.id)">✕</button>
          </div>
        </div>

        <div class="pb-block-body" v-if="activeBlock === block.id">

          <!-- TEXT -->
          <template v-if="block.type === 'text'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="العنوان..." /></div>
            <div class="pb-field"><label>النص</label><textarea v-model="block.data.text" rows="4" placeholder="النص..."></textarea></div>
            <div class="pb-field"><label>المحاذاة</label>
              <div class="pb-radio-group">
                <label class="pb-radio" v-for="a in ['right','center','left']" :key="a"><input type="radio" v-model="block.data.align" :value="a" />{{ a==='right'?'يمين':a==='center'?'وسط':'يسار' }}</label>
              </div>
            </div>
          </template>

          <!-- IMAGE_TEXT -->
          <template v-if="block.type === 'image_text'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="العنوان..." /></div>
            <div class="pb-field"><label>النص</label><textarea v-model="block.data.text" rows="3"></textarea></div>
            <div class="pb-field"><label>الصورة</label><ImagePicker v-model="block.data.image" /></div>
            <div class="pb-field"><label>موضع الصورة</label>
              <div class="pb-radio-group">
                <label class="pb-radio"><input type="radio" v-model="block.data.image_side" value="right" />يمين</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.image_side" value="left" />يسار</label>
              </div>
            </div>
            <div class="pb-field"><label>نص الزر</label><input v-model="block.data.btn_text" placeholder="اطلب الخدمة..." /></div>
            <div class="pb-field"><label>رابط الزر</label><LinkPicker v-model="block.data.btn_link" /></div>
          </template>

          <!-- CARDS -->
          <template v-if="block.type === 'cards'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="عنوان البطاقات..." /></div>
            <div class="pb-field"><label>الأعمدة</label>
              <div class="pb-radio-group">
                <label class="pb-radio" v-for="n in [2,3,4]" :key="n"><input type="radio" v-model="block.data.cols" :value="n" />{{ n }}</label>
              </div>
            </div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(card, ci) in block.data.cards" :key="ci">
                <div class="pb-card-item-header"><span>بطاقة {{ ci+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removeCard(block,ci)">✕</button></div>
                <div class="pb-field"><label>الأيقونة</label><select v-model="card.icon"><option v-for="ic in iconOptions" :key="ic.v" :value="ic.v">{{ ic.v }} {{ ic.l }}</option></select></div>
                <div class="pb-field"><label>العنوان</label><input v-model="card.title" /></div>
                <div class="pb-field"><label>النص</label><textarea v-model="card.text" rows="2"></textarea></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addCard(block)">+ إضافة بطاقة</button>
          </template>

          <!-- STATS -->
          <template v-if="block.type === 'stats'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="إنجازاتنا..." /></div>
            <div class="pb-field"><label>الأعمدة</label>
              <div class="pb-radio-group">
                <label class="pb-radio" v-for="n in [2,3,4,5]" :key="n"><input type="radio" v-model="block.data.cols" :value="n" />{{ n }}</label>
              </div>
            </div>
            <div class="pb-stats-list">
              <div class="pb-stat-item" v-for="(stat, si) in block.data.stats" :key="si">
                <div class="pb-stat-row">
                  <div class="pb-field pb-field--sm"><label>الرقم</label><input v-model="stat.num" placeholder="+200" /></div>
                  <div class="pb-field pb-field--sm"><label>التسمية</label><input v-model="stat.label" /></div>
                  <div class="pb-field pb-field--sm"><label>الأيقونة</label><select v-model="stat.icon"><option v-for="ic in iconOptions" :key="ic.v" :value="ic.v">{{ ic.v }}</option></select></div>
                  <button type="button" class="pb-btn-del-sm" @click="removeStat(block,si)">✕</button>
                </div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addStat(block)">+ إضافة إحصاء</button>
          </template>

          <!-- CTA_BUTTON -->
          <template v-if="block.type === 'cta_button'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" /></div>
            <div class="pb-field"><label>النص</label><textarea v-model="block.data.text" rows="2"></textarea></div>
            <div class="pb-field"><label>نص الزر الأول</label><input v-model="block.data.btn1_text" /></div>
            <div class="pb-field"><label>رابط الزر الأول</label><LinkPicker v-model="block.data.btn1_link" /></div>
            <div class="pb-field"><label>نص الزر الثاني</label><input v-model="block.data.btn2_text" /></div>
            <div class="pb-field"><label>رابط الزر الثاني</label><LinkPicker v-model="block.data.btn2_link" /></div>
            <div class="pb-field"><label>الخلفية</label><select v-model="block.data.bg"><option value="dark">داكن</option><option value="gold">ذهبي</option><option value="light">فاتح</option></select></div>
          </template>

          <!-- SLIDER -->
          <template v-if="block.type === 'slider'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="معرض أعمالنا..." /></div>
            <div class="pb-field"><label>الارتفاع</label>
              <div class="pb-radio-group">
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="sm" />صغير</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="md" />متوسط</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="lg" />كبير</label>
              </div>
            </div>
            <div class="pb-field"><label class="pb-radio"><input type="checkbox" v-model="block.data.autoplay" />تشغيل تلقائي</label></div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(slide, si) in block.data.slides" :key="si">
                <div class="pb-card-item-header"><span>شريحة {{ si+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removeSlide(block,si)">✕</button></div>
                <div class="pb-field"><label>الصورة</label><ImagePicker v-model="slide.image" /></div>
                <div class="pb-field"><label>العنوان</label><input v-model="slide.title" /></div>
                <div class="pb-field"><label>النص</label><input v-model="slide.text" /></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addSlide(block)">+ إضافة شريحة</button>
          </template>

          <!-- GALLERY -->
          <template v-if="block.type === 'gallery'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="معرض أعمالنا..." /></div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(img, gi) in block.data.images" :key="gi">
                <div class="pb-card-item-header"><span>صورة {{ gi+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removeGalleryImage(block,gi)">✕</button></div>
                <div class="pb-field"><label>الصورة</label><ImagePicker v-model="img.image" /></div>
                <div class="pb-field"><label>تعليق</label><input v-model="img.caption" /></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addGalleryImage(block)">+ إضافة صورة</button>
          </template>

          <!-- VIDEO -->
          <template v-if="block.type === 'video'">
            <div class="pb-field"><label>العنوان (اختياري)</label><input v-model="block.data.title" placeholder="شاهد أعمالنا..." /></div>
            <div class="pb-field"><label>رابط يوتيوب أو فيديو</label><input v-model="block.data.url" placeholder="https://www.youtube.com/watch?v=..." /></div>
            <div class="pb-field"><label>الارتفاع</label>
              <div class="pb-radio-group">
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="sm" />صغير (300px)</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="md" />متوسط (480px)</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="lg" />كبير (600px)</label>
              </div>
            </div>
          </template>

          <!-- MAP -->
          <template v-if="block.type === 'map'">
            <div class="pb-field"><label>العنوان (اختياري)</label><input v-model="block.data.title" placeholder="موقعنا..." /></div>
            <div class="pb-field"><label>رابط Google Maps Embed</label><input v-model="block.data.url" placeholder="https://www.google.com/maps/embed?pb=..." /></div>
            <div class="pb-field"><label>الارتفاع</label>
              <div class="pb-radio-group">
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="sm" />صغير</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="md" />متوسط</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.height" value="lg" />كبير</label>
              </div>
            </div>
          </template>

          <!-- FAQ -->
          <template v-if="block.type === 'faq'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="الأسئلة الشائعة..." /></div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(item, fi) in block.data.items" :key="fi">
                <div class="pb-card-item-header"><span>سؤال {{ fi+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removeFaq(block,fi)">✕</button></div>
                <div class="pb-field"><label>السؤال</label><input v-model="item.q" placeholder="ما هي خدماتكم؟" /></div>
                <div class="pb-field"><label>الجواب</label><textarea v-model="item.a" rows="3" placeholder="الجواب..."></textarea></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addFaq(block)">+ إضافة سؤال</button>
          </template>

          <!-- TIMELINE -->
          <template v-if="block.type === 'timeline'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="مراحل المشروع..." /></div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(step, ti) in block.data.steps" :key="ti">
                <div class="pb-card-item-header"><span>مرحلة {{ ti+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removeStep(block,ti)">✕</button></div>
                <div class="pb-field"><label>الأيقونة</label><select v-model="step.icon"><option v-for="ic in iconOptions" :key="ic.v" :value="ic.v">{{ ic.v }} {{ ic.l }}</option></select></div>
                <div class="pb-field"><label>العنوان</label><input v-model="step.title" placeholder="الاستشارة والتخطيط..." /></div>
                <div class="pb-field"><label>الوصف</label><textarea v-model="step.text" rows="2"></textarea></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addStep(block)">+ إضافة مرحلة</button>
          </template>

          <!-- TEAM -->
          <template v-if="block.type === 'team'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="فريق العمل..." /></div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(member, mi) in block.data.members" :key="mi">
                <div class="pb-card-item-header"><span>عضو {{ mi+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removeMember(block,mi)">✕</button></div>
                <div class="pb-field"><label>الصورة</label><ImagePicker v-model="member.image" /></div>
                <div class="pb-field"><label>الاسم</label><input v-model="member.name" placeholder="محمد أحمد..." /></div>
                <div class="pb-field"><label>المنصب</label><input v-model="member.role" placeholder="مدير المشاريع..." /></div>
                <div class="pb-field"><label>وصف مختصر</label><input v-model="member.bio" placeholder="خبرة 10 سنوات..." /></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addMember(block)">+ إضافة عضو</button>
          </template>

          <!-- TESTIMONIALS -->
          <template v-if="block.type === 'testimonials'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="آراء عملائنا..." /></div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(t, ti) in block.data.items" :key="ti">
                <div class="pb-card-item-header"><span>تقييم {{ ti+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removeTestimonial(block,ti)">✕</button></div>
                <div class="pb-field"><label>اسم العميل</label><input v-model="t.name" placeholder="أحمد محمد..." /></div>
                <div class="pb-field"><label>المنصب / الشركة</label><input v-model="t.role" placeholder="مدير شركة..." /></div>
                <div class="pb-field"><label>التقييم (1-5)</label>
                  <div class="pb-radio-group">
                    <label class="pb-radio" v-for="n in [1,2,3,4,5]" :key="n"><input type="radio" v-model="t.stars" :value="n" />{{ n }}⭐</label>
                  </div>
                </div>
                <div class="pb-field"><label>التعليق</label><textarea v-model="t.text" rows="3" placeholder="خدمة ممتازة..."></textarea></div>
                <div class="pb-field"><label>صورة العميل (اختياري)</label><ImagePicker v-model="t.image" /></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addTestimonial(block)">+ إضافة تقييم</button>
          </template>

          <!-- COUNTER -->
          <template v-if="block.type === 'counter'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="أرقامنا تتحدث..." /></div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(c, ci) in block.data.counters" :key="ci">
                <div class="pb-card-item-header"><span>عداد {{ ci+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removeCounter(block,ci)">✕</button></div>
                <div class="pb-stat-row">
                  <div class="pb-field pb-field--sm"><label>الأيقونة</label><select v-model="c.icon"><option v-for="ic in iconOptions" :key="ic.v" :value="ic.v">{{ ic.v }}</option></select></div>
                  <div class="pb-field pb-field--sm"><label>الرقم النهائي</label><input type="number" v-model.number="c.target" placeholder="200" /></div>
                  <div class="pb-field pb-field--sm"><label>البادئة</label><input v-model="c.prefix" placeholder="+" style="width:50px" /></div>
                  <div class="pb-field pb-field--sm"><label>اللاحقة</label><input v-model="c.suffix" placeholder="%" style="width:50px" /></div>
                </div>
                <div class="pb-field"><label>التسمية</label><input v-model="c.label" placeholder="مشروع منجز..." /></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addCounter(block)">+ إضافة عداد</button>
          </template>

          <!-- PRICE_LIST -->
          <template v-if="block.type === 'price_list'">
            <div class="pb-field"><label>العنوان</label><input v-model="block.data.title" placeholder="باقاتنا وأسعارنا..." /></div>
            <div class="pb-cards-list">
              <div class="pb-card-item" v-for="(pkg, pi) in block.data.packages" :key="pi">
                <div class="pb-card-item-header"><span>باقة {{ pi+1 }}</span><button type="button" class="pb-btn-del-sm" @click="removePackage(block,pi)">✕</button></div>
                <div class="pb-field"><label>اسم الباقة</label><input v-model="pkg.name" placeholder="الباقة الأساسية..." /></div>
                <div class="pb-field"><label>السعر</label><input v-model="pkg.price" placeholder="500 ريال" /></div>
                <div class="pb-field"><label>الوصف</label><input v-model="pkg.desc" placeholder="مناسب للمشاريع الصغيرة..." /></div>
                <div class="pb-field"><label>المميزات (سطر لكل ميزة)</label><textarea v-model="pkg.features" rows="4" placeholder="ميزة أولى&#10;ميزة ثانية"></textarea></div>
                <div class="pb-field"><label>نص الزر</label><input v-model="pkg.btn" placeholder="اطلب الآن" /></div>
                <div class="pb-field"><label>رابط الزر</label><LinkPicker v-model="pkg.link" /></div>
                <div class="pb-field"><label class="pb-radio"><input type="checkbox" v-model="pkg.featured" />مميزة (تبرز عن الباقي)</label></div>
              </div>
            </div>
            <button type="button" class="pb-add-card-btn" @click="addPackage(block)">+ إضافة باقة</button>
          </template>

          <!-- DIVIDER -->
          <template v-if="block.type === 'divider'">
            <div class="pb-field"><label>النمط</label>
              <div class="pb-radio-group">
                <label class="pb-radio"><input type="radio" v-model="block.data.style" value="line" />خط</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.style" value="space" />مسافة</label>
                <label class="pb-radio"><input type="radio" v-model="block.data.style" value="gold" />خط ذهبي</label>
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>

    <div v-else class="pb-empty">لا توجد عناصر — أضف عنصراً من القائمة أدناه</div>

    <div class="pb-toolbar">
      <span class="pb-toolbar-label">إضافة عنصر:</span>
      <button type="button" v-for="bt in blockTypes" :key="bt.type" class="pb-add-btn" @click="addBlock(bt.type)" :title="bt.label">
        {{ bt.icon }} {{ bt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ImagePicker from './ImagePicker.vue'
import LinkPicker from './LinkPicker.vue'

const props = defineProps({ modelValue: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue'])

const blocks      = ref(JSON.parse(JSON.stringify(props.modelValue || [])))
const activeBlock = ref(null)
let syncing = false

watch(() => props.modelValue, (v) => {
  if (syncing) return
  const incoming = JSON.stringify(v || [])
  if (incoming !== JSON.stringify(blocks.value)) blocks.value = JSON.parse(incoming)
}, { deep: true })

watch(blocks, (v) => {
  syncing = true
  emit('update:modelValue', JSON.parse(JSON.stringify(v)))
  nextTick(() => nextTick(() => { syncing = false }))
}, { deep: true })

const blockMeta = {
  text:         { icon: '📝', label: 'نص وعنوان' },
  image_text:   { icon: '🖼️', label: 'صورة ونص' },
  cards:        { icon: '🃏', label: 'بطاقات' },
  stats:        { icon: '📊', label: 'إحصائيات' },
  cta_button:   { icon: '📣', label: 'زر دعوة' },
  slider:       { icon: '🎠', label: 'سلايدر' },
  gallery:      { icon: '🎞️', label: 'معرض متحرك' },
  video:        { icon: '🎬', label: 'فيديو' },
  map:          { icon: '🗺️', label: 'خريطة' },
  faq:          { icon: '❓', label: 'أسئلة شائعة' },
  timeline:     { icon: '📅', label: 'تايملاين' },
  team:         { icon: '👥', label: 'فريق العمل' },
  testimonials: { icon: '💬', label: 'آراء العملاء' },
  counter:      { icon: '🔢', label: 'عداد أرقام' },
  price_list:   { icon: '💰', label: 'قائمة أسعار' },
  divider:      { icon: '➖', label: 'فاصل' },
}

const blockTypes = [
  { type: 'text',         icon: '📝', label: 'نص' },
  { type: 'image_text',   icon: '🖼️', label: 'صورة+نص' },
  { type: 'cards',        icon: '🃏', label: 'بطاقات' },
  { type: 'stats',        icon: '📊', label: 'إحصائيات' },
  { type: 'counter',      icon: '🔢', label: 'عداد' },
  { type: 'cta_button',   icon: '📣', label: 'زر دعوة' },
  { type: 'slider',       icon: '🎠', label: 'سلايدر' },
  { type: 'gallery',      icon: '🎞️', label: 'معرض متحرك' },
  { type: 'video',        icon: '🎬', label: 'فيديو' },
  { type: 'map',          icon: '🗺️', label: 'خريطة' },
  { type: 'faq',          icon: '❓', label: 'أسئلة شائعة' },
  { type: 'timeline',     icon: '📅', label: 'تايملاين' },
  { type: 'team',         icon: '👥', label: 'فريق العمل' },
  { type: 'testimonials', icon: '💬', label: 'آراء العملاء' },
  { type: 'price_list',   icon: '💰', label: 'أسعار' },
  { type: 'divider',      icon: '➖', label: 'فاصل' },
]

const iconOptions = [
  { v: '🏗️', l: 'بناء' }, { v: '🚧', l: 'سواتر' }, { v: '🚗', l: 'مظلات' },
  { v: '🌿', l: 'برجولات' }, { v: '⭐', l: 'نجمة' }, { v: '✅', l: 'صح' },
  { v: '🏆', l: 'كأس' }, { v: '🔨', l: 'مطرقة' }, { v: '📞', l: 'هاتف' },
  { v: '📍', l: 'موقع' }, { v: '🕐', l: 'وقت' }, { v: '💡', l: 'فكرة' },
  { v: '🛡️', l: 'حماية' }, { v: '⚡', l: 'سرعة' }, { v: '🎯', l: 'هدف' },
  { v: '👷', l: 'عامل' }, { v: '🏠', l: 'منزل' }, { v: '🔧', l: 'أدوات' },
]

const defaultData = {
  text:         { title: '', text: '', align: 'right' },
  image_text:   { title: '', text: '', image: 'about', image_side: 'right', btn_text: '', btn_link: '' },
  cards:        { title: '', cols: 3, cards: [{ icon: '⭐', title: '', text: '' }] },
  stats:        { title: '', cols: 4, stats: [{ num: '+100', label: 'مشروع', icon: '🏆' }] },
  cta_button:   { title: '', text: '', btn1_text: 'تواصل معنا', btn1_link: '/contact', btn2_text: '', btn2_link: '', bg: 'dark' },
  slider:       { title: '', height: 'md', autoplay: true, slides: [{ image: '', title: '', text: '' }] },
  gallery:      { title: '', images: [{ image: '', caption: '' }] },
  video:        { title: '', url: '', height: 'md' },
  map:          { title: '', url: '', height: 'md' },
  faq:          { title: 'الأسئلة الشائعة', items: [{ q: '', a: '' }] },
  timeline:     { title: 'مراحل العمل', steps: [{ icon: '🎯', title: '', text: '' }] },
  team:         { title: 'فريق العمل', members: [{ image: '', name: '', role: '', bio: '' }] },
  testimonials: { title: 'آراء عملائنا', items: [{ name: '', role: '', stars: 5, text: '', image: '' }] },
  counter:      { title: '', counters: [{ icon: '🏆', target: 200, prefix: '+', suffix: '', label: 'مشروع منجز' }] },
  price_list:   { title: 'باقاتنا', packages: [{ name: '', price: '', desc: '', features: '', btn: 'اطلب الآن', link: '/contact', featured: false }] },
  divider:      { style: 'line' },
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }

const sizes  = [{ v:'sm', i:'S', l:'صغير' }, { v:'md', i:'M', l:'متوسط' }, { v:'lg', i:'L', l:'كبير' }]
const widths = [{ v:'narrow', i:'▥', l:'ضيق' }, { v:'full', i:'▬', l:'كامل' }, { v:'wide', i:'⬛', l:'واسع' }]

function setLayout(block, key, val) {
  const idx = blocks.value.findIndex(b => b.id === block.id)
  if (idx === -1) return
  blocks.value[idx] = {
    ...blocks.value[idx],
    layout: { ...(blocks.value[idx].layout || { size: 'md', width: 'full' }), [key]: val }
  }
}
function addBlock(type) {
  const block = { id: uid(), type, layout: { size: 'md', width: 'full' }, data: JSON.parse(JSON.stringify(defaultData[type])) }
  blocks.value.push(block)
  activeBlock.value = block.id
}
function removeBlock(id) { blocks.value = blocks.value.filter(b => b.id !== id); if (activeBlock.value === id) activeBlock.value = null }
function toggleBlock(id) { activeBlock.value = activeBlock.value === id ? null : id }
function moveBlock(idx, dir) {
  const arr = [...blocks.value], t = idx + dir
  if (t < 0 || t >= arr.length) return
  ;[arr[idx], arr[t]] = [arr[t], arr[idx]]
  blocks.value = arr
}
function addCard(b)    { b.data.cards.push({ icon: '⭐', title: '', text: '' }) }
function removeCard(b, i) { b.data.cards.splice(i, 1) }
function addStat(b)    { b.data.stats.push({ num: '+0', label: '', icon: '⭐' }) }
function removeStat(b, i) { b.data.stats.splice(i, 1) }
function addSlide(b)   { b.data.slides.push({ image: '', title: '', text: '' }) }
function removeSlide(b, i) { b.data.slides.splice(i, 1) }
function addGalleryImage(b) { b.data.images.push({ image: '', caption: '' }) }
function removeGalleryImage(b, i) { b.data.images.splice(i, 1) }
function addFaq(b)     { b.data.items.push({ q: '', a: '' }) }
function removeFaq(b, i) { b.data.items.splice(i, 1) }
function addStep(b)    { b.data.steps.push({ icon: '🎯', title: '', text: '' }) }
function removeStep(b, i) { b.data.steps.splice(i, 1) }
function addMember(b)  { b.data.members.push({ image: '', name: '', role: '', bio: '' }) }
function removeMember(b, i) { b.data.members.splice(i, 1) }
function addTestimonial(b) { b.data.items.push({ name: '', role: '', stars: 5, text: '', image: '' }) }
function removeTestimonial(b, i) { b.data.items.splice(i, 1) }
function addCounter(b) { b.data.counters.push({ icon: '⭐', target: 100, prefix: '+', suffix: '', label: '' }) }
function removeCounter(b, i) { b.data.counters.splice(i, 1) }
function addPackage(b) { b.data.packages.push({ name: '', price: '', desc: '', features: '', btn: 'اطلب الآن', link: '/contact', featured: false }) }
function removePackage(b, i) { b.data.packages.splice(i, 1) }

function getPreview(block) {
  const t = block.data.title || block.data.text || ''
  return t ? (t.length > 35 ? t.slice(0, 35) + '...' : t) : ''
}
</script>

<style scoped>
.pb-wrap { display: flex; flex-direction: column; gap: 12px; }
.pb-blocks { display: flex; flex-direction: column; gap: 8px; }
.pb-block { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; transition: border-color 0.2s; }
.pb-block--active { border-color: var(--neon-blue); }
.pb-block-header { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: var(--bg2); cursor: pointer; user-select: none; }
.pb-block-header:hover { background: var(--glass); }
.pb-block-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.pb-block-icon { font-size: 1.1rem; }
.pb-block-name { font-weight: 700; font-size: 0.88rem; color: var(--text); white-space: nowrap; }
.pb-block-preview { font-size: 0.78rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pb-block-actions { display: flex; gap: 4px; flex-shrink: 0; align-items: center; }
.pb-size-btns { display: flex; gap: 2px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 2px; }
.pb-size-btn { width: 24px; height: 24px; border: none; background: transparent; color: var(--text-muted); border-radius: 4px; cursor: pointer; font-size: 0.72rem; font-weight: 800; transition: all 0.15s; }
.pb-size-btn:hover { background: var(--glass); color: var(--text); }
.pb-size-btn.active { background: var(--neon-blue); color: white; }
.pb-btn-order { width: 28px; height: 28px; border: 1px solid var(--border); background: var(--glass); color: var(--text-muted); border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.15s; }
.pb-btn-order:hover:not(:disabled) { background: var(--glass-hover); color: var(--text); }
.pb-btn-order:disabled { opacity: 0.3; cursor: not-allowed; }
.pb-btn-del { width: 28px; height: 28px; border: none; background: rgba(248,113,113,0.1); color: #f87171; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
.pb-btn-del:hover { background: rgba(248,113,113,0.2); }
.pb-block-body { padding: 14px; background: var(--bg); border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; }
.pb-field { display: flex; flex-direction: column; gap: 5px; }
.pb-field label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }
.pb-field input, .pb-field textarea, .pb-field select { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.9rem; direction: rtl; background: var(--bg2); color: var(--text); transition: border-color 0.2s; }
.pb-field input:focus, .pb-field textarea:focus, .pb-field select:focus { outline: none; border-color: var(--neon-blue); }
.pb-field textarea { resize: vertical; }
.pb-field--sm { flex: 1; }
.pb-radio-group { display: flex; gap: 16px; flex-wrap: wrap; }
.pb-radio { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; cursor: pointer; color: var(--text-muted); }
.pb-radio input { accent-color: var(--neon-blue); }
.pb-cards-list { display: flex; flex-direction: column; gap: 10px; }
.pb-card-item { border: 1px solid var(--border); border-radius: 8px; padding: 12px; background: var(--bg2); display: flex; flex-direction: column; gap: 8px; }
.pb-card-item-header { display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; font-weight: 700; color: var(--text-muted); }
.pb-btn-del-sm { width: 24px; height: 24px; border: none; background: rgba(248,113,113,0.1); color: #f87171; border-radius: 6px; cursor: pointer; font-size: 0.75rem; }
.pb-stats-list { display: flex; flex-direction: column; gap: 8px; }
.pb-stat-item { border: 1px solid var(--border); border-radius: 8px; padding: 10px; background: var(--bg2); }
.pb-stat-row { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }
.pb-add-card-btn { align-self: flex-start; padding: 7px 16px; background: rgba(59,130,246,0.1); color: var(--neon-blue); border: none; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; }
.pb-add-card-btn:hover { background: rgba(59,130,246,0.18); }
.pb-empty { text-align: center; color: var(--text-muted); padding: 32px; background: var(--bg2); border-radius: 10px; border: 1px dashed var(--border); font-size: 0.9rem; }
.pb-toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 12px 14px; background: var(--bg2); border-radius: 10px; border: 1px dashed var(--border); }
.pb-toolbar-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); white-space: nowrap; }
.pb-add-btn { padding: 6px 14px; background: var(--glass); border: 1px solid var(--border); border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; }
.pb-add-btn:hover { border-color: var(--neon-blue); color: var(--neon-blue); background: rgba(59,130,246,0.08); }
</style>
