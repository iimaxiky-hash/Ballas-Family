<script src="script.js?v=1.1"></script>
// دالة الدخول الأساسية
async function handleLogin() {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value.trim();
  const errEl = document.getElementById('login-err');

  console.log("جاري محاولة الدخول لـ:", username);

  try {
    const response = await fetch(FIREBASE_URL);
    const data = await response.json();

    console.log("البيانات المستلمة من Firebase:", data); // <--- هذا السطر هو الأهم!

    if (!data) {
      alert('قاعدة البيانات فارغة!');
      return;
    }

    const users = Object.values(data);
    const foundUser = users.find(u => 
        String(u.username).trim() === username && 
        String(u.password).trim() === password
    );

    if (foundUser) {
      console.log("تم العثور على المستخدم:", foundUser);
      alert('تم تسجيل الدخول بنجاح!');
      location.reload(); 
    } else {
      console.log("لم يتم العثور على المستخدم. هل الحقول تطابق البيانات أعلاه؟");
      errEl.style.display = 'block';
    }
  } catch (err) {
    console.error("خطأ:", err);
  }
}
