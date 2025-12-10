// Очікуємо повного завантаження DOM перед виконанням скрипта
document.addEventListener("DOMContentLoaded", () => {

    // Отримуємо кнопку виходу з акаунту
    const logoutButton = document.querySelector(".button");
    // Отримуємо кнопку реєстрації/логіну у шапці
    const rlButton = document.querySelector("#RL");

    // Встановлюємо текст кнопки у шапці залежно від статусу авторизації
    // Якщо користувач авторизований (є userId у localStorage), показуємо "Cabinet"
    // Інакше — стандартний текст "Register/Login"
    if (localStorage.getItem("userId")) {
        rlButton.textContent = "Cabinet";
    } else {
        rlButton.textContent = "Register/Login";
    }

    // Додаємо обробник кліку на кнопку "Вийти"
    logoutButton.addEventListener("click", () => {

        // Видаляємо дані авторизації з localStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        // Повертаємо кнопку у шапці до стану для неавторизованого користувача
        rlButton.textContent = "Register/Login";

        // Переадресація на головну сторінку після виходу
        window.location.href = "../index.html";
    });
});
