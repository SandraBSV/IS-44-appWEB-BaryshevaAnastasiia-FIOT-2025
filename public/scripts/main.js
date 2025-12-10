console.log("Main.js підключено!");

// =====================
// Карусель
// =====================
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const photoPerView = 6;
let currentIndex = 0;

function updateCarouselPosition() {
    const offset = -(currentIndex / photoPerView) * 100;
    track.style.transform = `translateX(${offset}%)`;
}

function nextSlideGroup() {
    if (currentIndex + photoPerView < items.length) {
        currentIndex += photoPerView;
    } else {
        currentIndex = 0;
    }
    updateCarouselPosition();
}

function prevSlideGroup() {
    if (currentIndex - photoPerView >= 0) {
        currentIndex -= photoPerView;
    } else {
        const remaining = items.length % photoPerView;
        currentIndex = items.length - (remaining === 0 ? photoPerView : remaining);
    }
    updateCarouselPosition();
}

nextBtn.addEventListener('click', nextSlideGroup);
prevBtn.addEventListener('click', prevSlideGroup);
updateCarouselPosition();


// =====================
// Пошук товарів
// =====================
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('.searchButton');
const searchResultsContainer = document.querySelector('.search-results');

const API_BASE_URL = 'http://localhost:3000'; // твій бекенд

function displaySearchResults(results) {
    searchResultsContainer.innerHTML = '';
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>Нічого не знайдено</p>';
        return;
    }

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item');
        resultItem.innerHTML = `
            <h3>${item.Product_Name}</h3>
            <h4>Тип: ${item.Product_Type}</h4>
            <p>Ціна: ${item.Product_Price} грн</p>
            <p>${item.Product_Description}</p>
        `;
        searchResultsContainer.appendChild(resultItem);
    });
}

function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    fetch(`${API_BASE_URL}/products?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => displaySearchResults(data))
        .catch(err => {
            console.error('Помилка пошуку:', err);
            searchResultsContainer.innerHTML = '<p>Помилка при пошуку</p>';
        });
}

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

