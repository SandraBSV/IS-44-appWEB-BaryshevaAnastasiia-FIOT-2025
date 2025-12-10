// Базова URL-адреса сервера API
const API_BASE_URL = 'http://localhost:3000';

// Очікуємо повного завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const button = form.querySelector('.button');

  // Додаємо обробник кліку на кнопку
  button.addEventListener('click', async () => {
    const inputs = form.querySelectorAll('input');
    const identifier = inputs[0].value.trim();
    const password = inputs[1].value;

    // Просте перевірення: якщо поля порожні — повідомляємо користувача
    if (!identifier || !password) {
      alert('Введіть логін і пароль.');
      return;
    }

    try {
      // Відправляємо POST-запит на бекенд для авторизації
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }) // Тіло запиту з логіном та паролем
      });

      // Отримуємо відповідь у форматі JSON
      const data = await res.json();

      // Якщо сервер повернув помилку, показуємо повідомлення
      if (!res.ok) {
        alert(data.error || 'Помилка при вході');
        return;
      }

      // Очікуємо від сервера { success: true, customerId: X, role: Y }
      // Зберігаємо дані користувача у localStorage для подальшої роботи
      localStorage.setItem('userId', data.customerId);
      localStorage.setItem('userRole', String(data.role));

      // Переадресація користувача залежно від ролі:
      // 1 -> адмін-панель, 2 -> кабінет користувача
      if (Number(data.role) === 1) {
        window.location.href = '../admin/index.html';
      } else {
        window.location.href = '../pages/pageCabinet.html';
      }
    } catch (err) {
      // Якщо запит не вдалося відправити або сервер не відповідає
      console.error(err);
      alert('Не вдалося зв\'язатися з сервером.');
    }
  });
});
