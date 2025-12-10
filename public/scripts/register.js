// Базова URL-адреса API сервера
const API_BASE_URL = 'http://localhost:3000';

// Очікуємо, поки весь DOM буде завантажено
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const button = form.querySelector('.button');

  // Додаємо обробник кліку на кнопку реєстрації
  button.addEventListener('click', async () => {

    // Забираємо значення полів за атрибутом name
    // Використання name надійніше, ніж querySelectorAll з індексами
    const lastName = form.querySelector('input[name="firstname"]').value.trim(); // Прізвище
    const firstName = form.querySelector('input[name="lastname"]').value.trim();  // Ім'я
    const phone = form.querySelector('input[name="phone"]').value.trim();         // Телефон
    const email = form.querySelector('input[name="email"]').value.trim();         // Email
    const password = form.querySelector('input[name="password"]').value;          // Пароль

    // Проста валідація: перевірка, чи всі поля заповнені
    if (!firstName || !lastName || !phone || !email || !password) {
      alert("Будь ласка, заповніть усі поля.");
      return; 
    }

    try {
      // Відправляємо POST-запит на сервер для реєстрації
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Customer_FirstName: firstName,
          Customer_LastName: lastName,
          Customer_Phone: phone,
          Customer_Email: email,
          Customer_Password: password 
        })
      });

      // Отримуємо відповідь від сервера
      const data = await res.json();

      // Якщо сервер повернув помилку, показуємо повідомлення
      if (!res.ok || !data.success) {
        alert(data.error || "Сталася помилка при реєстрації.");
        return;
      }

      // Зберігаємо ідентифікатор користувача та його роль у localStorage
      // Це дозволяє підтримувати стан авторизації на фронтенді
      localStorage.setItem('userId', data.customerId);
      localStorage.setItem('userRole', String(data.role)); // 2 = User

      // Перехід на сторінку особистого кабінету після успішної реєстрації
      window.location.href = '../pages/pageCabinet.html';

    } catch (err) {
      // Якщо запит не пройшов або сервер недоступний
      console.error(err);
      alert("Не вдалося підключитися до сервера.");
    }
  });
});
