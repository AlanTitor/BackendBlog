let menuToggle, menuClose, sideMenu, menuOverlay;
let postsGridContainer;
const backendPostsListUrl = 'http://localhost:8080/api/post/list';

function toggleMenu(open) {
    if (!sideMenu || !menuOverlay || !document.body) return;
    sideMenu.classList.toggle('open', open);
    menuOverlay.classList.toggle('visible', open);
    document.body.classList.toggle('menu-open', open);
}

async function fetchPosts() {
    if (!postsGridContainer) {
        console.error("Контейнер postsGridContainer не найден!");
        return;
    }
    postsGridContainer.innerHTML = '<p class="loading-posts">Загрузка...</p>';
    console.log("fetchPosts: Запрос на URL:", backendPostsListUrl);

    try {
        const response = await fetch(backendPostsListUrl);
        console.log("fetchPosts: Ответ получен, статус:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("fetchPosts: Ошибка HTTP:", response.status, errorText);
            throw new Error(`Ошибка HTTP: ${response.status}. ${errorText}`);
        }

        const result = await response.json();
        console.log("fetchPosts: Данные JSON получены:", result);

        const posts = result.Data;

        if (posts && Array.isArray(posts) && posts.length > 0) {
            postsGridContainer.innerHTML = '';
            console.log(`fetchPosts: Найдено постов: ${posts.length}`);
            posts.forEach(post => {
                const postCard = document.createElement('div');
                postCard.classList.add('tour-card');

                // --- ФОРМАТИРОВАНИЕ ДАННЫХ ДЛЯ ОТОБРАЖЕНИЯ ---
                let durationText = '';
                if (post.duration && typeof post.duration === 'number' && post.duration > 0) {
                    // Простое добавление "дн." Можно усложнить для правильных склонений (день, дня, дней)
                    durationText = `${post.duration} дн.`;
                }

                let priceText = 'Цена по запросу';
                if (post.price !== null && typeof post.price === 'number') {
                     // Форматирование цены с пробелами как разделителями тысяч
                    priceText = `${new Intl.NumberFormat('ru-RU').format(post.price)} ₽`;
                }

                let groupSizeText = '';
                if (post.groupSize && typeof post.groupSize === 'number' && post.groupSize > 0) {
                    groupSizeText = `До ${post.groupSize} чел.`;
                }
                // --- КОНЕЦ ФОРМАТИРОВАНИЯ ---

                const imageHtml = post.imageUrl
                    ? `<img src="${post.imageUrl}" alt="${post.title || 'Изображение тура'}">`
                    : '<div class="tour-image-placeholder" style="height:200px; display:flex; align-items:center; justify-content:center; background:#f0f0f0; color:#aaa; font-size:0.9em;">Фото отсутствует</div>';

                const badgeHtml = post.badgeText
                    ? `<span class="tour-badge">${post.badgeText}</span>`
                    : '';

                postCard.innerHTML = `
                    <div class="tour-image">
                        ${imageHtml}
                        ${badgeHtml}
                    </div>
                    <div class="tour-content">
                        <h2 class="tour-title">${post.title || 'Без названия'}</h2>
                        <p class="tour-description">${post.shortDescription || 'Краткое описание отсутствует.'}</p>
                        <div class="tour-meta">
                            ${durationText ? `<span><i class="fas fa-calendar-alt tour-icon"></i> ${durationText}</span>` : ''}
                            ${post.difficulty ? `<span><i class="fas fa-signal tour-icon"></i> ${post.difficulty}</span>` : ''}
                            ${groupSizeText ? `<span><i class="fas fa-users tour-icon"></i> ${groupSizeText}</span>` : ''}
                        </div>
                        <div class="tour-price">${priceText}</div>
                        <a href="post-detail.html?id=${post.id}" class="tour-button">Подробнее</a>
                    </div>
                `;
                postsGridContainer.appendChild(postCard);

                 setTimeout(() => {
                    postCard.classList.add('visible');
                 }, 10);
            });
        } else {
            console.log("fetchPosts: Постов не найдено или массив пуст.");
            postsGridContainer.innerHTML = '<p class="no-posts-message">Пока нет ни одного тура.</p>';
        }
    } catch (error) {
        console.error('fetchPosts: Ошибка при загрузке постов:', error);
        if (postsGridContainer) {
            postsGridContainer.innerHTML = `<p class="no-posts-message">Не удалось загрузить данные. ${error.message}</p>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    menuToggle = document.getElementById('menuToggle');
    menuClose = document.getElementById('menuClose');
    sideMenu = document.getElementById('sideMenu');
    menuOverlay = document.getElementById('menuOverlay');
    postsGridContainer = document.getElementById('postsGridContainer');

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const menuNav = document.querySelector('.side-menu .menu-nav');
    const createPostBtnGlobal = document.getElementById('createPostBtnGlobal');

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

        if (isLoggedIn === 'true') {
            if (createPostBtnGlobal) createPostBtnGlobal.style.display = 'inline-block';
            const profile = document.createElement('div'); profile.classList.add('menu-item', 'dynamic-auth-item');
            profile.innerHTML = `<a href="#" id="profileMenuLink" class="menu-link"><i class="fas fa-user-circle"></i> Профиль ${userEmail ? `(${userEmail})` : ''}</a>`;
            menuNav.appendChild(profile);
            const logout = document.createElement('div'); logout.classList.add('menu-item', 'dynamic-auth-item');
            logout.innerHTML = '<a href="#" id="logoutMenuLink" class="menu-link"><i class="fas fa-sign-out-alt"></i> Выход</a>';
            menuNav.appendChild(logout);
            logout.querySelector('#logoutMenuLink').addEventListener('click', e => {
                e.preventDefault(); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('userEmail');
                if (createPostBtnGlobal) createPostBtnGlobal.style.display = 'none';
                alert('Вы вышли из системы.'); window.location.reload();
            });
        } else {
            if (createPostBtnGlobal) createPostBtnGlobal.style.display = 'none';
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
        if (linkId === 'logoutMenuLink') return;
        if (linkId === 'profileMenuLink' && linkHref === '#') {
            link.addEventListener('click', e => { e.preventDefault(); alert('Страница профиля в разработке.'); toggleMenu(false); }); return;
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

    fetchPosts();

    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => console.log('Фильтры (логика не подключена)'));
    });
});