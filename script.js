// ── CONFIG ────────────────────────────────────────────────────────────────
const FIREBASE_URL = "https://ballas-web-default-rtdb.firebaseio.com";

// ── AUTH & SESSION ────────────────────────────────────────────────────────
function restoreSession() {
    const sessionStr = localStorage.getItem('Ballas_Session');
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            applySession(session);
            return session;
        } catch (e) {
            console.error("فشل في قراءة الجلسة:", e);
            localStorage.removeItem('Ballas_Session');
        }
    }
    return null;
}

function applySession(session) {
    if (!session || !session.username) return;
    
    // تحديث الواجهة بناءً على حالة الجلسة
    const userBadge = document.getElementById('username-badge');
    if (userBadge) userBadge.textContent = session.username;

    // إذا كان أدمن، تفعيل لوحة التحكم
    if (session.role === 'admin') {
        // ننتظر قليلاً لضمان أن DOM جاهز
        setTimeout(renderAdminAccounts, 500);
    }
}

// ── LOGIN SYSTEM ──────────────────────────────────────────────────────────
async function handleLogin(e) {
    if (e) e.preventDefault();
    const username = document.getElementById('login-user')?.value.trim();
    const password = document.getElementById('login-pass')?.value;
    const errEl = document.getElementById('login-err');

    if (!username || !password) return;

    try {
        const res = await fetch(`${FIREBASE_URL}/accounts.json`);
        const data = await res.json();
        const accounts = data ? Object.values(data) : [];

        const user = accounts.find(u => u.username === username && u.password === password);

        if (!user) {
            if (errEl) errEl.style.display = 'block';
            return;
        }

        // تسجيل الجلسة
        const session = { username: user.username, role: user.role };
        localStorage.setItem('Ballas_Session', JSON.stringify(session));
        
        window.location.reload(); 
    } catch (err) {
        console.error("خطأ في الاتصال بالسيرفر:", err);
    }
}

// ── RENDER DATA ───────────────────────────────────────────────────────────
async function renderAdminAccounts() {
    const el = document.getElementById('admin-accounts-tbl');
    if (!el) return;

    try {
        const res = await fetch(`${FIREBASE_URL}/accounts.json`);
        const data = await res.json();
        const accounts = data ? Object.values(data) : [];

        if (accounts.length === 0) {
            el.innerHTML = '<p style="padding:10px;">لا توجد حسابات</p>';
            return;
        }

        el.innerHTML = `
            <table class="admin-table">
                <thead><tr><th>المستخدم</th><th>التخصص</th></tr></thead>
                <tbody>
                    ${accounts.map(a => `<tr><td>${a.username || 'N/A'}</td><td>${a.specialty || '—'}</td></tr>`).join('')}
                </tbody>
            </table>`;
    } catch (err) {
        el.innerHTML = '<p>خطأ في تحميل البيانات من السيرفر</p>';
    }
}

// أضف هذه الدالة إلى ملف script.js ليعمل زر الدخول
function openLoginModal() {
    const modal = document.getElementById('login-modal'); // تأكد من مطابقة المعرف (ID) لنموذج الدخول
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("نموذج تسجيل الدخول (login-modal) غير موجود في الصفحة");
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
}

// ── INITIALIZATION (نقطة الربط) ──────────────────────────────────────────
// ملاحظة: نستخدم هذا لربط الأحداث دون حذف دوالك القديمة (initApp)
document.addEventListener('DOMContentLoaded', () => {
    // 1. استعادة الجلسة
    restoreSession();

    // 2. ربط نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.removeEventListener('submit', handleLogin); // تجنب التكرار
        loginForm.addEventListener('submit', handleLogin);
    }
});
