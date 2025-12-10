// =========================
// Універсальний CRUD для всіх типів виробів
// =========================

// Завантаження товарів певного типу з серверу
async function loadProducts() {
    try {
        // Робимо GET-запит до бекенду для отримання всіх товарів певного типу
        const res = await fetch(`http://localhost:3000/products/${PRODUCT_TYPE}`);
        if (!res.ok) throw new Error(`Не вдалося завантажити ${PRODUCT_TYPE}`);
        const products = await res.json();

        // Очищаємо таблицю та створюємо заголовки
        const table = document.getElementById('productTable');
        table.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Ціна</th>
                <th>Тип виробу</th>
                <th>Колір</th>
                <th>Модель</th>
                <th>Опис</th>
                <th>Наявність</th>
                <th>Дії</th>
            </tr>
        `;

        // Додаємо рядки з товарами
        products.forEach(p => addProductRow(p, table));

    } catch (err) {
        console.error(err); // Логування помилки у консоль
    }
}

// Додаємо рядок продукту у таблицю та підключаємо кнопки Оновити/Видалити
function addProductRow(product, table) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.Product_Id}</td>
        <td contenteditable="true">${product.Product_Name}</td>
        <td contenteditable="true">${product.Product_Price}</td>
        <td contenteditable="true">${product.Product_Type}</td>
        <td contenteditable="true">${product.Product_Color}</td>
        <td contenteditable="true">${product.Product_Model}</td>
        <td contenteditable="true">${product.Product_Description}</td>
        <td contenteditable="true">${product.Product_Availability}</td>
        <td>
            <button class="button update">Оновити</button>
            <button class="button delete">Видалити</button>
        </td>
    `;
    table.appendChild(row);

    // Прив’язка функцій до кнопок
    row.querySelector('.update').addEventListener('click', () => updateProduct(product.Product_Id, row));
    row.querySelector('.delete').addEventListener('click', () => deleteProduct(product.Product_Id));
}

// Оновлення товару на сервері
async function updateProduct(id, row) {
    const updatedProduct = {
        Product_Name: row.cells[1].innerText.trim(),
        Product_Price: Number(row.cells[2].innerText),
        Product_Type: row.cells[3].innerText.trim(),
        Product_Color: row.cells[4].innerText.trim(),
        Product_Model: row.cells[5].innerText.trim(),
        Product_Description: row.cells[6].innerText.trim(),
        Product_Availability: row.cells[7].innerText.trim()
    };

    try {
        const res = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        });

        if (!res.ok) alert("Помилка при оновленні");

    } catch (err) {
        console.error(err); // Логування помилки
    }
}

// Видалення товару
async function deleteProduct(id) {
    if (!confirm('Видалити цей товар?')) return; // Підтвердження від користувача

    try {
        const res = await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
        if (!res.ok) alert("Помилка при видаленні");

        loadProducts(); // Оновлення таблиці після видалення
    } catch (err) {
        console.error(err);
    }
}

// Відкриття форми для додавання нового продукту
function showAddProductForm() {
    // Створюємо overlay для модального вікна
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');

    // Створюємо контейнер форми
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    // HTML форми з полями для нового продукту
    formContainer.innerHTML = `
        <h3>Додати новий продукт: ${PRODUCT_TYPE}</h3>
        <label>Назва: <input type="text" id="newName"></label>
        <label>Ціна: <input type="number" id="newPrice"></label>
        <label>Колір: <input type="text" id="newColor"></label>
        <label>Модель: <input type="text" id="newModel"></label>
        <label>Опис: <textarea id="newDescription"></textarea></label>
        <label>Наявність: <input type="text" id="newAvailability"></label>
        <div class="modal-buttons">
            <button id="submitNewProduct">Додати</button>
            <button id="cancelNewProduct">Скасувати</button>
        </div>
    `;

    overlay.appendChild(formContainer);
    document.body.appendChild(overlay);

    // Закриття форми при натисканні "Скасувати"
    formContainer.querySelector('#cancelNewProduct').addEventListener('click', () => overlay.remove());

    // Додавання нового продукту при натисканні "Додати"
    formContainer.querySelector('#submitNewProduct').addEventListener('click', async () => {
        const newProduct = {
            Product_Name: formContainer.querySelector('#newName').value.trim(),
            Product_Price: Number(formContainer.querySelector('#newPrice').value),
            Product_Type: PRODUCT_TYPE,
            Product_Color: formContainer.querySelector('#newColor').value.trim(),
            Product_Model: formContainer.querySelector('#newModel').value.trim(),
            Product_Description: formContainer.querySelector('#newDescription').value.trim(),
            Product_Availability: formContainer.querySelector('#newAvailability').value.trim()
        };

        // Просте валідування
        if (!newProduct.Product_Name || !newProduct.Product_Price) {
            alert('Заповніть назву та ціну!');
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/products/${PRODUCT_TYPE}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });

            if (!res.ok) {
                alert("Помилка при створенні!");
                return;
            }

            overlay.remove(); // Закриваємо форму
            loadProducts(); // Оновлюємо таблицю

        } catch (err) {
            console.error(err);
        }
    });
}

// Ініціалізація: завантаження продуктів та прив’язка кнопки створення
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    const createBtn = document.querySelector('.create button');
    if (createBtn) createBtn.addEventListener('click', showAddProductForm);
});
