// ── 1. الإعدادات الأساسية ───────────────────────────────────────────────────
const FIREBASE_URL = "https://ballas-web-default-rtdb.firebaseio.com/accounts.json";
const K = {
  SESSION: 'ballas_session',
  MEMBERS: 'ballas_members',
  REPORTS: 'ballas_reports',
  ACHIEVEMENTS: 'ballas_achievements',
  ANNOUNCE: 'ballas_announce'
};

// ── 2. دوال التخزين المحلي ──────────────────────────────────────────────────
function lsGet(k) { 
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } 
    catch { return null; } 
}
function lsSet(k, v) { 
    try { localStorage.setItem(k, JSON.stringify(v)); } 
    catch (e) { console.error("خطأ في حفظ البيانات:", e); } 
}

// ── 3. دوال الجلسة (Auth) ──────────────────────────────────────────────────
function applySession(session) {
  const loginBtn = document.getElementById('login-btn');
  const userDisplay = document.getElementById('user-display');
  
  if (session && session.username) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userDisplay) userDisplay.style.display = 'flex';
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (userDisplay) userDisplay.style.display = 'none';
  }
}

function restoreSession() {
  const s = lsGet(K.SESSION);
  if (s && s.username) applySession(s);
}

// ── 4. الدالة المحدثة لتسجيل الدخول (مع Firebase) ───────────────────────────
async function handleLogin(e) {
  if (e) e.preventDefault();
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value.trim();
  const errEl = document.getElementById('login-err');

  try {
    const response = await fetch(FIREBASE_URL);
    const data = await response.json();
    
    if (!data) { 
        alert('لا يمكن الاتصال بقاعدة البيانات!'); 
        return; 
    }

    const users = Object.values(data);
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      lsSet(K.SESSION, { username: foundUser.username, role: foundUser.role });
      alert('تم تسجيل الدخول بنجاح!');
      location.reload(); 
    } else {
      if (errEl) errEl.style.display = 'block';
      console.log("بيانات الدخول غير صحيحة");
    }
  } catch (err) {
    console.error("خطأ اتصال:", err);
    alert('حدث خطأ أثناء محاولة الاتصال بالسيرفر');
  }
}

// ── 5. تهيئة التطبيق ────────────────────────────────────────────────────────
function initApp() {
  restoreSession();
  console.log("تم تحميل التطبيق بالكامل");
}

// ── 6. التشغيل (آخر سطر في الملف) ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initApp);
