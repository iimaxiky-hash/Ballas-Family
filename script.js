// ── CONFIG ────────────────────────────────────────────────────────────────
const FIREBASE_URL = "https://ballas-web-default-rtdb.firebaseio.com";

// ── LOGIN SYSTEM ──────────────────────────────────────────────────────────
async function handleLogin(e) {
    if (e) e.preventDefault();
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;
    const errEl = document.getElementById('login-err');

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
        
        window.location.reload(); // إعادة تحميل الصفحة لتفعيل صلاحيات الأدمن
    } catch (err) {
        console.error("خطأ في تسجيل الدخول:", err);
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

        if (!accounts.length) {
            el.innerHTML = '<p>لا توجد حسابات</p>';
            return;
        }

        el.innerHTML = `
            <table class="admin-table">
                <thead><tr><th>المستخدم</th><th>التخصص</th></tr></thead>
                <tbody>
                    ${accounts.map(a => `<tr><td>${a.username}</td><td>${a.specialty}</td></tr>`).join('')}
                </tbody>
            </table>`;
    } catch (err) {
        el.innerHTML = '<p>خطأ في تحميل البيانات</p>';
    }
}

// ── INITIALIZATION ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // ربط نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // التحقق من الجلسة
    const session = localStorage.getItem('Ballas_Session');
    if (session) {
        const s = JSON.parse(session);
        if (s.role === 'admin') renderAdminAccounts();
    }
});
