<script src="script.js?v=1.1"></script>
// دالة الدخول الأساسية
async function handleLogin() {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value.trim();
  const errEl = document.getElementById('login-err');

  console.log("جاري محاولة الدخول لـ:", username); // للتأكد في الكونسول

  try {
    const response = await fetch(FIREBASE_URL);
    const data = await response.json();

    if (!data) {
      alert('خطأ في الاتصال بقاعدة البيانات');
      return;
    }

    const users = Object.values(data);
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      errEl.style.display = 'none';
      alert('تم تسجيل الدخول بنجاح!');
      location.reload(); 
    } else {
      errEl.style.display = 'block'; // إظهار رسالة الخطأ
    }
  } catch (err) {
    console.error("خطأ الاتصال:", err);
    alert('فشل الاتصال بالسيرفر');
  }
}

// ربط الزر يدوياً بعد تحميل الصفحة (الحل الجذري)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('login-submit-btn');
  if (btn) {
    btn.addEventListener('click', handleLogin);
  }
});
