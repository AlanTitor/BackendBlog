document.addEventListener('DOMContentLoaded', function() {
    // --- Управление UI Меню и Авторизацией (без изменений) ---
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        alert('Для создания тура необходимо войти в систему.');
        window.location.href = 'login.html';
        return;
    }
    const userEmail = localStorage.getItem('userEmail');
    const menuNav = document.querySelector('.side-menu .menu-nav');

    if (menuNav) {
        menuNav.innerHTML = '';
        const staticLinksData = [
            { href: "index.html", text: "Главная", icon: "fa-home" },
            { href: "attractions.html", text: "Достопримечательности", icon: "fa-landmark" },
            { href: "tours.html", text: "Туры", icon: "fa-map-signs" },
            { href: "activerecreation.html", text: "Активный отдых", icon: "fa-hiking" },
            { href: "botany.html", text: "Ботаника", icon: "fa-leaf" },
            { href: "#", text: "Охота", icon: "fa-crosshairs" },
            { href: "#", text: "Форум", icon: "fa-comments" }
        ];
        staticLinksData.forEach(linkData => {
            const item = document.createElement('div'); item.classList.add('menu-item');
            item.innerHTML = `<a href="${linkData.href}" class="menu-link"><i class="fas ${linkData.icon}"></i> ${linkData.text}</a>`;
            menuNav.appendChild(item);
        });

        const profile = document.createElement('div'); profile.classList.add('menu-item', 'dynamic-auth-item');
        profile.innerHTML = `<a href="#" id="profileMenuLink" class="menu-link"><i class="fas fa-user-circle"></i> Профиль ${userEmail ? `(${userEmail})` : ''}</a>`;
        menuNav.appendChild(profile);

        const logout = document.createElement('div'); logout.classList.add('menu-item', 'dynamic-auth-item');
        logout.innerHTML = '<a href="#" id="logoutMenuLink" class="menu-link"><i class="fas fa-sign-out-alt"></i> Выход</a>';
        menuNav.appendChild(logout);
        logout.querySelector('#logoutMenuLink').addEventListener('click', e => {
            e.preventDefault(); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('userEmail');
            alert('Вы вышли из системы.'); window.location.href = 'index.html';
        });
    }

    const allMenuLinks = document.querySelectorAll('.side-menu .menu-link');
    allMenuLinks.forEach(link => {
        if (link.dataset.hasClickListener === 'true') return;
        link.dataset.hasClickListener = 'true';
        const linkId = link.getAttribute('id');
        const linkHref = link.getAttribute('href');

        if (linkId === 'logoutMenuLink') return;
        if (linkId === 'profileMenuLink' && linkHref === '#') {
            link.addEventListener('click', e => { e.preventDefault(); alert('Страница профиля в разработке.'); toggleMenu(false); }); return;
        }
        link.addEventListener('click', e => {
            if (linkHref && !linkHref.startsWith('#') && linkHref !== '#') {
                toggleMenu(false);
                return;
            }
            e.preventDefault();
            toggleMenu(false);
            if (linkHref && linkHref.startsWith('#') && linkHref.length > 1) {
                const targetElement = document.querySelector(linkHref);
                if (targetElement) window.scrollTo({top: targetElement.offsetTop - 80, behavior: 'smooth'});
            }
        });
    });
    // --- Конец Управления UI Меню и Авторизацией ---

    // --- Логика Формы Создания Тура (Поста) ---
    const tourForm = document.getElementById('tourForm');
    const titleInput = document.getElementById('tourTitleInput');
    const shortDescriptionInput = document.getElementById('tourShortDescriptionInput');
    const fullDescriptionInput = document.getElementById('tourFullDescriptionInput');

    const imageUrlInput = document.getElementById('tourImageUrlInput');
    const badgeTextInput = document.getElementById('tourBadgeTextInput');
    const durationInput = document.getElementById('tourDurationInput'); // input type="number"
    const difficultyInput = document.getElementById('tourDifficultyInput');
    const groupSizeInput = document.getElementById('tourGroupSizeInput'); // input type="number"
    const priceInput = document.getElementById('tourPriceInput'); // input type="number"

    const itineraryDaysContainer = document.getElementById('itineraryDaysContainer');
    const formErrorMessage = document.getElementById('formErrorMessage');
    const backendSaveUrl = 'http://localhost:8080/api/post/save';

    // Функция для генерации полей программы тура
    function generateItineraryFields() {
        itineraryDaysContainer.innerHTML = ''; // Очищаем предыдущие поля
        const days = parseInt(durationInput.value, 10);

        if (isNaN(days) || days < 1) {
            // Если дней нет или некорректное значение, ничего не генерируем
            return;
        }

        for (let i = 1; i <= days; i++) {
            const dayGroup = document.createElement('div');
            dayGroup.classList.add('form-group'); // Используем существующий класс для стилизации

            const dayLabel = document.createElement('label');
            dayLabel.setAttribute('for', `itineraryDay${i}Input`);
            dayLabel.textContent = `Описание для Дня ${i} (можно использовать HTML):`;

            const dayTextarea = document.createElement('textarea');
            dayTextarea.setAttribute('id', `itineraryDay${i}Input`);
            dayTextarea.setAttribute('name', `itineraryDay${i}`);
            dayTextarea.setAttribute('rows', '6'); // Увеличил немного высоту
            dayTextarea.classList.add('itinerary-day-description'); // Класс для сбора данных
            // dayTextarea.required = true; // Раскомментируйте, если описание каждого дня обязательно

            dayGroup.appendChild(dayLabel);
            dayGroup.appendChild(dayTextarea);
            itineraryDaysContainer.appendChild(dayGroup);
        }
    }

    if (durationInput) {
        durationInput.addEventListener('input', generateItineraryFields); // При каждом изменении
        // durationInput.addEventListener('change', generateItineraryFields); // Если нужно только после потери фокуса
    }


    if (tourForm) {
        tourForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            formErrorMessage.style.display = 'none';

            // Проверка, что основные элементы формы найдены
            if (!titleInput || !shortDescriptionInput || !fullDescriptionInput ||
                !imageUrlInput || !badgeTextInput || !durationInput || !difficultyInput ||
                !groupSizeInput || !priceInput
            ) {
                console.error("Не удалось найти одно или несколько полей ввода. Проверьте ID в HTML.");
                formErrorMessage.textContent = "Ошибка конфигурации формы. Пожалуйста, обновите страницу.";
                formErrorMessage.style.display = 'block';
                return;
            }

            const authorEmail = localStorage.getItem('userEmail');

            // Сбор данных программы тура
            const itineraryDescriptions = [];
            const dayTextareas = itineraryDaysContainer.querySelectorAll('.itinerary-day-description');
            dayTextareas.forEach(textarea => {
                itineraryDescriptions.push(textarea.value || ""); // Сохраняем даже пустые строки, чтобы сохранить порядок дней
            });

            const postData = {
                title: titleInput.value,
                shortDescription: shortDescriptionInput.value,
                fullDescription: fullDescriptionInput.value,
                imageUrl: imageUrlInput.value,
                badgeText: badgeTextInput.value,
                // Преобразуем значения в числа, если они есть, иначе null (для nullable полей в БД)
                duration: durationInput.value ? parseInt(durationInput.value, 10) : null,
                difficulty: difficultyInput.value,
                groupSize: groupSizeInput.value ? parseInt(groupSizeInput.value, 10) : null,
                price: priceInput.value ? parseFloat(priceInput.value) : null,
                itineraryJson: itineraryDescriptions.length > 0 ? JSON.stringify(itineraryDescriptions) : null // Отправляем null, если программа не заполнена
            };

            if (!postData.title || !postData.shortDescription || !postData.fullDescription) {
                formErrorMessage.textContent = 'Название, краткое описание и полное содержание обязательны для заполнения.';
                formErrorMessage.style.display = 'block'; return;
            }
            // Можно добавить валидацию для itineraryDescriptions, если нужно


            const requestUrl = `${backendSaveUrl}?name=${encodeURIComponent(authorEmail)}`;
            try {
                const response = await fetch(requestUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                });
                const responseText = await response.text();
                if (response.status === 201) { // CREATED
                    alert('Тур (пост) успешно создан!');
                    tourForm.reset();
                    itineraryDaysContainer.innerHTML = ''; // Очистить динамические поля после успешной отправки
                    window.location.href = 'tours.html';
                } else {
                    let detailMessage = responseText;
                    try {
                        const errorJson = JSON.parse(responseText);
                        if(errorJson && errorJson.message) { detailMessage = errorJson.message; }
                        else if (errorJson && typeof errorJson === 'string') { detailMessage = errorJson; }
                    } catch (jsonError) { /* Оставляем responseText как есть, если это не JSON */ }

                    console.error('Ошибка создания поста:', response.status, detailMessage);
                    formErrorMessage.textContent = `Ошибка создания: ${detailMessage} (Статус: ${response.status})`;
                    formErrorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Сетевая ошибка или ошибка при отправке:', error);
                formErrorMessage.textContent = 'Произошла сетевая ошибка или ошибка на сервере. Попробуйте позже.';
                formErrorMessage.style.display = 'block';
            }
        });
    }
}); // Конец основного DOMContentLoaded

// --- Логика Бокового Меню (отдельно, т.к. элементы меню создаются в DOMContentLoaded) ---
let menuToggleGlobal, menuCloseGlobal, sideMenuGlobal, menuOverlayGlobal;

document.addEventListener('DOMContentLoaded', () => {
    menuToggleGlobal = document.getElementById('menuToggle');
    menuCloseGlobal = document.getElementById('menuClose');
    sideMenuGlobal = document.getElementById('sideMenu');
    menuOverlayGlobal = document.getElementById('menuOverlay');

    if(menuToggleGlobal) menuToggleGlobal.addEventListener('click', () => toggleMenu(true));
    if(menuCloseGlobal) menuCloseGlobal.addEventListener('click', () => toggleMenu(false));
    if(menuOverlayGlobal) menuOverlayGlobal.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', e => {
        if (sideMenuGlobal && sideMenuGlobal.classList.contains('open') && e.key === 'Escape') {
            toggleMenu(false);
        }
    });
});

function toggleMenu(open) {
    const currentSideMenu = document.getElementById('sideMenu');
    const currentMenuOverlay = document.getElementById('menuOverlay');
    const body = document.body;

    if(!currentSideMenu || !currentMenuOverlay || !body) return;
    currentSideMenu.classList.toggle('open', open);
    currentMenuOverlay.classList.toggle('visible', open);
    body.classList.toggle('menu-open', open);
}