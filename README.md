# Study Room Application 📚

تطبيق غرفة الدراسة هو منصة ويب تفاعلية تهدف إلى مساعدة الطلاب على تتبع أوقات دراستهم وإدارة موادهم الدراسية بفعالية.

## ✨ الميزات الجديدة المضافة

### 🗑️ 1. حذف المواد الدراسية
- **الوصف**: إمكانية حذف أي مادة دراسية من النظام نهائياً
- **كيفية الاستخدام**:
  1. انتقل إلى الصفحة الرئيسية
  2. اضغط على أيقونة الحذف (🗑️) بجانب المادة المراد حذفها
  3. ستظهر نافذة تأكيد
  4. اضغط "Delete" لتأكيد الحذف أو "Cancel" للإلغاء
- **الآمان**: النظام يطلب تأكيد قبل الحذف لتجنب الحذف العرضي

### ⏰ 2. تعديل أوقات الدراسة
- **الوصف**: إمكانية تعديل الوقت المسجل لأي مادة دراسية
- **كيفية الاستخدام**:
  1. اضغط على أيقونة التعديل (✏️) بجانب المادة
  2. ستظهر نافذة تحتوي على خانات للساعات والدقائق والثواني
  3. أدخل الوقت المطلوب (ساعات: 0-23، دقائق/ثواني: 0-59)
  4. اضغط "Save" لحفظ التغييرات
- **التحقق**: النظام يتحقق من صحة القيم المدخلة

### 🔐 3. تسجيل الدخول بـ Google
- **الوصف**: إمكانية تسجيل الدخول أو إنشاء حساب باستخدام حساب Google
- **المزايا**:
  - تسجيل دخول سريع وآمن
  - لا حاجة لحفظ كلمات مرور إضافية
  - استخدام بيانات Google للملف الشخصي
- **كيفية الاستخدام**:
  1. في صفحة تسجيل الدخول أو إنشاء الحساب
  2. اضغط على "Continue with Google" أو "Sign up with Google"
  3. اختر حساب Google المطلوب
  4. سيتم تسجيل الدخول تلقائياً

## 🎯 الملفات المضافة/المحدثة

### ملفات جديدة:
- `README.md` - دليل المشروع الشامل
- `features-demo.html` - صفحة توضيحية للميزات الجديدة
- `scripts/enhanced-utils.js` - دوال مساعدة محسنة
- `scripts/enhanced-time-utils.js` - دوال تعامل محسنة مع الوقت
- `static/enhanced-features.css` - أنماط CSS للميزات الجديدة

### ملفات محدثة:
- `pages/home.html` - إضافة نماذج التعديل والحذف
- `pages/login.html` - إضافة زر Google Sign-In
- `pages/signup.html` - إضافة زر Google Sign-Up
- `scripts/home.js` - منطق الحذف والتعديل
- `scripts/login.js` - دعم Google Authentication
- `scripts/signup.js` - دعم Google Authentication
- `scripts/firebase-config.js` - إضافة Firebase Auth
- `scripts/subject-list.js` - تحديث عرض المواد مع أزرار التحكم
- `static/home.css` - أنماط للميزات الجديدة
- `static/login.css` - أنماط زر Google
- `static/signup.css` - أنماط زر Google

## 🚀 طريقة تشغيل المشروع

### متطلبات التشغيل
- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- اتصال بالإنترنت (للاتصال بـ Firebase)

### خطوات التشغيل

#### 1. تحميل المشروع
```bash
git clone https://github.com/MariamHasanat/Study-Room-Application.git
cd Study-Room-Application
```

#### 2. تشغيل الخادم المحلي
يمكنك استخدام أي من الطرق التالية:

**أ. استخدام Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**ب. استخدام Node.js:**
```bash
npx http-server
```

**ج. استخدام VS Code:**
- قم بتثبيت امتداد "Live Server"
- انقر بالزر الأيمن على `index.html`
- اختر "Open with Live Server"

#### 3. الوصول للتطبيق
افتح المتصفح وانتقل إلى: `http://localhost:8000`

## 🏗️ بنية المشروع

```
Study-Room-Application/
├── index.html              # الصفحة الرئيسية
├── pages/                  # صفحات التطبيق
│   ├── home.html          # صفحة المواد الدراسية
│   ├── login.html         # صفحة تسجيل الدخول
│   ├── signup.html        # صفحة إنشاء الحساب
│   └── study.html         # صفحة الدراسة والمؤقت
├── scripts/               # ملفات JavaScript
│   ├── firebase-config.js # إعدادات Firebase
│   ├── home.js           # منطق الصفحة الرئيسية
│   ├── login.js          # منطق تسجيل الدخول
│   ├── signup.js         # منطق إنشاء الحساب
│   ├── study.js          # منطق صفحة الدراسة
│   └── ...              # ملفات مساعدة أخرى
├── static/               # ملفات CSS
│   ├── style.css         # الأنماط العامة
│   ├── home.css          # أنماط الصفحة الرئيسية
│   ├── login.css         # أنماط تسجيل الدخول
│   └── ...              # ملفات CSS أخرى
├── assets/              # الصور والأيقونات
└── README.md            # هذا الملف
```

## 🔧 التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Firestore, Realtime Database, Authentication)
- **UI Icons**: Google Material Symbols
- **Authentication**: Firebase Auth + Google OAuth
- **Features**: 
  - Responsive Design
  - Progressive Web App capabilities
  - Enhanced UX/UI
  - Real-time data synchronization
  - Offline data caching

## 📱 التوافق

التطبيق متوافق مع:
- أجهزة الكمبيوتر (Desktop)
- الأجهزة اللوحية (Tablet)
- الهواتف الذكية (Mobile)

## 🔐 الأمان والخصوصية

- جميع البيانات محفوظة بشكل آمن في Firebase
- تشفير الاتصالات باستخدام HTTPS
- مصادقة آمنة عبر Google OAuth
- عدم تخزين كلمات المرور بشكل مكشوف

## 🐛 حل المشاكل الشائعة

### مشكلة عدم ظهور البيانات
- تأكد من الاتصال بالإنترنت
- تحقق من إعدادات Firebase
- امسح ذاكرة التخزين المؤقت للمتصفح

### مشكلة تسجيل الدخول بـ Google
- تأكد من تفعيل النوافذ المنبثقة في المتصفح
- تحقق من إعدادات Google OAuth في Firebase Console

### نصائح للحصول على أفضل تجربة
- استخدم متصفح حديث (Chrome, Firefox, Safari, Edge)
- تأكد من تفعيل JavaScript
- للحصول على أفضل أداء، أغلق التبويبات غير المستخدمة

## 🎓 ميزات تعليمية

هذا المشروع يوضح العديد من المفاهيم الهامة في تطوير الويب:
- **Firebase Integration**: Firestore, Realtime Database, Authentication
- **Modern JavaScript**: ES6 Modules, Async/Await, Arrow Functions
- **Responsive Design**: Mobile-first approach
- **User Experience**: Progressive enhancement, Loading states
- **Security**: Input validation, Secure authentication

## 📈 التطوير المستقبلي

خطط لميزات إضافية:
- 📱 تطبيق موبايل باستخدام PWA
- 🌙 وضع الليل (Dark Mode)
- 📊 تقارير وإحصائيات مفصلة
- 🔔 تنبيهات ومذكرات
- 👥 مشاركة المواد مع الأصدقاء
- 🎯 تحديد أهداف دراسية

## 👨‍💻 المطور

**شادي صبيح** - طالب في البرنامج التدريبي

## 📄 الترخيص

هذا المشروع مطور لأغراض تعليمية في إطار البرنامج التدريبي.

---

**ملاحظة**: تأكد من تحديث إعدادات Firebase في ملف `firebase-config.js` بالبيانات الصحيحة لمشروعك.
