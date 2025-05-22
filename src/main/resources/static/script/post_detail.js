let menuToggle, menuClose, sideMenu, menuOverlay;
let postDetailContainer;
const backendApiBaseUrl = 'http://localhost:8080/api/post/';

function toggleMenu(open) {
    if (!sideMenu || !menuOverlay || !document.body) return;
    sideMenu.classList.toggle('open', open);
    menuOverlay.classList.toggle('visible', open);
    document.body.classList.toggle('menu-open', open);
}

async function fetchPostDetail() {
    if (!postDetailContainer) {
         console.error("Контейнер postDetailContainer не найден!"); return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postDetailContainer.innerHTML = '<p class="error-message-post-detail">ID поста не указан.</p>'; return;
    }
    const currentPostDetailUrl = `${backendApiBaseUrl}${postId}`;
    console.log("fetchPostDetail: Запрос на URL:", currentPostDetailUrl);

    postDetailContainer.innerHTML = '<p class="loading-post-detail">Загрузка...</p>';
    try {
        const response = await fetch(currentPostDetailUrl);
        console.log("fetchPostDetail: Ответ получен, статус:", response.status, response.statusText);
        if (!response.ok) {
            const errorText = await response.text();
            if (response.status === 404) throw new Error('Пост не найден.');
            throw new Error(`Ошибка HTTP: ${response.status}. ${errorText}`);
        }
        const post = await response.json();
        console.log("fetchPostDetail: Данные JSON:", post);

        document.title = `${post.title || 'Пост'} | Сердце Кавказа`;

        let displayDate = 'дата не указана';
        if (post.date) {
            try {
                displayDate = new Date(post.date).toLocaleDateString('ru-RU', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour:'2-digit', minute:'2-digit'
                });
            } catch (e) { console.warn("Ошибка форматирования даты:", post.date, e); }
        }

        // --- ФОРМАТИРОВАНИЕ ДАННЫХ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ---
        let durationTextDetail = '';
        if (post.duration && typeof post.duration === 'number' && post.duration > 0) {
            durationTextDetail = `${post.duration} дн.`;
        }

        let priceTextDetail = '';
        if (post.price !== null && typeof post.price === 'number') {
            priceTextDetail = `${new Intl.NumberFormat('ru-RU').format(post.price)} ₽`;
        } else if (post.price === 0) { // Если цена явно 0, можно написать "Бесплатно"
            priceTextDetail = 'Бесплатно';
        } else {
            priceTextDetail = 'Цена по запросу';
        }


        let groupSizeTextDetail = '';
        if (post.groupSize && typeof post.groupSize === 'number' && post.groupSize > 0) {
            groupSizeTextDetail = `До ${post.groupSize} чел.`;
        }
        // --- КОНЕЦ ФОРМАТИРОВАНИЯ ---

        const postImageHtml = post.imageUrl ?
            `<div class="post-main-image-container"><img src="${post.imageUrl}" alt="${post.title || 'Изображение поста'}"></div>` : '';

        const badgeDetailHtml = post.badgeText ? `<span class="post-detail-badge">${post.badgeText}</span>` : '';

        let itineraryHtml = '';
        if (post.itineraryJson) {
            try {
                const itineraryDays = JSON.parse(post.itineraryJson);
                if (Array.isArray(itineraryDays) && itineraryDays.length > 0) {
                    itineraryHtml = `<div class="tour-itinerary"><h2>Программа тура</h2>`;
                    itineraryDays.forEach((dayDescription, index) => {
                        // Проверяем, есть ли описание или день находится в пределах post.duration
                        // Это полезно, если itineraryJson может быть короче, чем post.duration
                        // или если некоторые описания дней пустые, но мы все равно хотим показать заголовок дня.
                        if (dayDescription || (post.duration && index < post.duration)) {
                             itineraryHtml += `
                                <div class="itinerary-day">
                                    <div class="day-title">
                                        <i class="fas fa-calendar-day day-icon"></i>
                                        <span>День ${index + 1}</span>
                                    </div>
                                    <div class="day-content">
                                        ${dayDescription || '<p><em>Программа на этот день не указана.</em></p>'}
                                    </div>
                                </div>`;
                        }
                    });
                    itineraryHtml += `</div>`;
                }
            } catch (e) {
                console.error("Ошибка парсинга itineraryJson:", e);
                itineraryHtml = '<p><em>Не удалось загрузить программу тура. Данные повреждены.</em></p>';
            }
        }


        postDetailContainer.innerHTML = `
            ${postImageHtml}
            <div class="post-title-header">
                <h1 class="post-title-detail">${post.title || 'Без названия'}</h1>
                ${badgeDetailHtml}
            </div>
            <div class="post-meta-info-detail">
                ${post.author ? `<span><i class="fas fa-user"></i> ${post.author.name || 'Неизвестен'}</span>` : ''}
                <span><i class="fas fa-calendar-alt"></i> ${displayDate}</span>
                ${durationTextDetail ? `<span><i class="fas fa-clock"></i> ${durationTextDetail}</span>` : ''}
                ${post.difficulty ? `<span><i class="fas fa-signal"></i> ${post.difficulty}</span>` : ''}
                ${priceTextDetail ? `<span><i class="fas fa-ruble-sign"></i> ${priceTextDetail}</span>` : ''}
                ${groupSizeTextDetail ? `<span><i class="fas fa-users"></i> ${groupSizeTextDetail}</span>` : ''}
            </div>
            <div class="post-description-section">
                ${post.shortDescription ? `<h3>Краткое описание</h3><p>${post.shortDescription}</p>` : ''}
                <h3>Полное описание</h3>
                <div>${post.fullDescription || '<p>Содержание поста отсутствует.</p>'}</div>
            </div>
            ${itineraryHtml}
            <a href="tours.html" class="back-to-list-link"><i class="fas fa-arrow-left"></i> Назад к списку</a>
        `;
    } catch (error) {
        console.error('Ошибка загрузки поста:', error);
        postDetailContainer.innerHTML = `<p class="error-message-post-detail">Не удалось загрузить пост. ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    menuToggle = document.getElementById('menuToggle');
    menuClose = document.getElementById('menuClose');
    sideMenu = document.getElementById('sideMenu');
    menuOverlay = document.getElementById('menuOverlay');
    postDetailContainer = document.getElementById('postDetailContentWrapper');

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const menuNav = document.querySelector('.side-menu .menu-nav');

    if (menuNav) {
        menuNav.innerHTML = '';
        const staticLinksData = [
            { href: "index.html", text: "Главная", icon: "fa-home" }, { href: "attractions.html", text: "Достопримечательности", icon: "fa-landmark" },
            { href: "tours.html", text: "Туры", icon: "fa-map-signs" }, { href: "activerecreation.html", text: "Активный отдых", icon: "fa-hiking" },
            { href: "botany.html", text: "Ботаника", icon: "fa-leaf" }, { href: "#", text: "Охота", icon: "fa-crosshairs" }, { href: "#", text: "Форум", icon: "fa-comments" }
        ];
        staticLinksData.forEach(linkData => {
            const item = document.createElement('div'); item.classList.add('menu-item');
            item.innerHTML = `<a href="${linkData.href}" class="menu-link"><i class="fas ${linkData.icon}"></i> ${linkData.text}</a>`;
            menuNav.appendChild(item);
        });

        if (isLoggedIn === 'true') {
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
        } else {
            const login = document.createElement('div'); login.classList.add('menu-item', 'dynamic-auth-item');
            login.innerHTML = '<a href="login.html" class="menu-link"><i class="fas fa-sign-in-alt"></i> Вход</a>'; menuNav.appendChild(login);
            const register = document.createElement('div'); register.classList.add('menu-item', 'dynamic-auth-item');
            register.innerHTML = '<a href="register.html" class="menu-link"><i class="fas fa-user-plus"></i> Регистрация</a>'; menuNav.appendChild(register);
        }
    }

    const allMenuLinks = document.querySelectorAll('.side-menu .menu-link');
    allMenuLinks.forEach(link => {
        if (link.dataset.hasClickListener === 'true') return;
        link.dataset.hasClickListener = 'true';
        const linkId = link.getAttribute('id');
        const linkHref = link.getAttribute('href');
        if (linkId === 'logoutMenuLink' || (linkId === 'profileMenuLink' && linkHref === '#')) {
            if (linkId === 'profileMenuLink') link.addEventListener('click', e => { e.preventDefault(); alert('Страница профиля в разработке.'); toggleMenu(false); });
            return;
        }
        link.addEventListener('click', e => {
            if (linkHref && !linkHref.startsWith('#') && linkHref !== '#') { toggleMenu(false); return; }
            e.preventDefault(); toggleMenu(false);
            if (linkHref && linkHref.startsWith('#') && linkHref.length > 1) {
                const targetElement = document.querySelector(linkHref);
                if (targetElement) window.scrollTo({top: targetElement.offsetTop - 80, behavior: 'smooth'});
            }
        });
    });

    if (menuToggle) menuToggle.addEventListener('click', () => toggleMenu(true));
    if (menuClose) menuClose.addEventListener('click', () => toggleMenu(false));
    if (menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', e => { if (sideMenu && sideMenu.classList.contains('open') && e.key === 'Escape') toggleMenu(false); });

    fetchPostDetail();
});