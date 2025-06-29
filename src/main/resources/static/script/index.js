let menuToggle, menuClose, sideMenu, menuOverlay;
let popularToursGridContainer;
let allPosts = [];
const backendApiPostListUrl = 'http://localhost:8080/api/post/list';

function toggleMenu(open) {
    if (!sideMenu || !menuOverlay || !document.body) return;
    sideMenu.classList.toggle('open', open);
    menuOverlay.classList.toggle('visible', open);
    document.body.classList.toggle('menu-open', open);
}

function createTourCard(post) {
    const tourCard = document.createElement('div');
    tourCard.classList.add('tour-card');

    let displayDate = 'дата не указана';
    if (post.date) {
        try {
            displayDate = new Date(post.date).toLocaleDateString('ru-RU');
        } catch (e) {
            console.warn("Ошибка форматирования даты для поста ID " + post.id, post.date, e);
        }
    }

    tourCard.innerHTML = `
        ${post.imageUrl ? `<div class="card-image"><img src="${post.imageUrl}" alt="${post.title || ''}"></div>` : ''}
        <div class="tour-content">
            <h3 class="tour-title">${post.title || 'Без названия'}</h3>
            ${post.shortDescription ? `<p class="card-description" style="margin-bottom:15px; color:#7f8c8d;">${post.shortDescription}</p>` : ''}
            <div class="tour-info">
                ${post.duration ? `<span class="tour-duration"><i class="fas fa-calendar-alt tour-icon"></i> ${post.duration} дней</span>` : ''}
                ${post.difficulty ? `<span class="tour-difficulty"><i class="fas fa-signal tour-icon"></i> ${post.difficulty}</span>` : ''}
                ${post.author ? `<span><i class="fas fa-user tour-icon"></i> ${post.author.name || 'Автор'}</span>` : ''}
                <span><i class="fas fa-calendar-alt tour-icon"></i> ${displayDate}</span>
            </div>
            ${post.price ? `<p class="tour-price">${post.price} руб.</p>` : ''}
            <a href="post-detail.html?id=${post.id}" class="tour-button">Подробнее</a>
        </div>
    `;

    setTimeout(() => tourCard.classList.add('visible'), 50);
    return tourCard;
}

function displayTours(posts) {
    popularToursGridContainer.innerHTML = '';
    posts.forEach(post => {
        const card = createTourCard(post);
        popularToursGridContainer.appendChild(card);
    });
}

async function fetchAllPosts() {
    if (!popularToursGridContainer) {
        console.warn("Элемент #popularToursGrid не найден на странице.");
        return;
    }
    popularToursGridContainer.innerHTML = '<p class="loading-popular-tours">Загрузка...</p>';
    try {
        const response = await fetch(backendApiPostListUrl);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status}. ${errorText}`);
        }
        const result = await response.json();
        allPosts = result.Data || [];

        if (allPosts.length > 0) {
            const popularPosts = allPosts.slice(0, 3);
            displayTours(popularPosts);
        } else {
            popularToursGridContainer.innerHTML = '<p class="no-popular-tours">Популярные туры и статьи скоро появятся.</p>';
        }
    } catch (error) {
        console.error('fetchAllPosts: Ошибка:', error);
        popularToursGridContainer.innerHTML = `<p class="no-popular-tours">Не удалось загрузить. ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    menuToggle = document.getElementById('menuToggle');
    menuClose = document.getElementById('menuClose');
    sideMenu = document.getElementById('sideMenu');
    menuOverlay = document.getElementById('menuOverlay');
    popularToursGridContainer = document.getElementById('popularToursGrid');

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const menuNav = document.querySelector('.side-menu .menu-nav');

    if (menuNav) {
        menuNav.innerHTML = '';
        const staticLinksData = [
            { href: "index.html", text: "Главная", icon: "fa-home" },
            { href: "#attractions", text: "Достопримечательности", icon: "fa-landmark" },
            { href: "tours.html", text: "Все Туры", icon: "fa-map-signs" },
            { href: "activerecreation.html", text: "Активный отдых", icon: "fa-hiking" },
            { href: "botany.html", text: "Ботаника", icon: "fa-leaf" },
            { href: "#", text: "Охота", icon: "fa-crosshairs" },
            { href: "#", text: "Форум", icon: "fa-comments" }
        ];
        staticLinksData.forEach(linkData => {
            const item = document.createElement('div');
            item.classList.add('menu-item');
            item.innerHTML = `<a href="${linkData.href}" class="menu-link"><i class="fas ${linkData.icon || 'fa-angle-right'}"></i> ${linkData.text}</a>`;
            menuNav.appendChild(item);
        });

        if (isLoggedIn === 'true') {
            const profile = document.createElement('div');
            profile.classList.add('menu-item', 'dynamic-auth-item');
            profile.innerHTML = `<a href="#" id="profileMenuLink" class="menu-link"><i class="fas fa-user-circle"></i> Профиль ${userEmail ? `(${userEmail})` : ''}</a>`;
            menuNav.appendChild(profile);
            const logout = document.createElement('div');
            logout.classList.add('menu-item', 'dynamic-auth-item');
            logout.innerHTML = '<a href="#" id="logoutMenuLink" class="menu-link"><i class="fas fa-sign-out-alt"></i> Выход</a>';
            menuNav.appendChild(logout);
            logout.querySelector('#logoutMenuLink').addEventListener('click', e => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                alert('Вы вышли из системы.');
                window.location.reload();
            });
        } else {
            const login = document.createElement('div');
            login.classList.add('menu-item', 'dynamic-auth-item');
            login.innerHTML = '<a href="login.html" class="menu-link"><i class="fas fa-sign-in-alt"></i> Вход</a>';
            menuNav.appendChild(login);
            const register = document.createElement('div');
            register.classList.add('menu-item', 'dynamic-auth-item');
            register.innerHTML = '<a href="register.html" class="menu-link"><i class="fas fa-user-plus"></i> Регистрация</a>';
            menuNav.appendChild(register);
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
            link.addEventListener('click', e => {
                e.preventDefault();
                alert('Страница профиля в разработке.');
                toggleMenu(false);
            });
            return;
        }

        link.addEventListener('click', e => {
            const targetHref = link.getAttribute('href');
            if (targetHref && !targetHref.startsWith('#') && targetHref !== '#') {
                toggleMenu(false);
                return;
            }
            e.preventDefault();
            toggleMenu(false);
            if (targetHref && targetHref.startsWith('#') && targetHref.length > 1) {
                const targetElement = document.querySelector(targetHref);
                if (targetElement) {
                    let offset = 80;
                    if (targetHref === '#home') offset = 0;
                    window.scrollTo({ top: targetElement.offsetTop - offset, behavior: 'smooth' });
                }
            }
        });
    });

    if (menuToggle) menuToggle.addEventListener('click', () => toggleMenu(true));
    if (menuClose) menuClose.addEventListener('click', () => toggleMenu(false));
    if (menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', e => {
        if (sideMenu && sideMenu.classList.contains('open') && e.key === 'Escape') toggleMenu(false);
    });

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = searchForm.querySelector('.search-input');
            const query = searchInput.value.trim().toLowerCase();

            if (!query) {
                const popularPosts = allPosts.slice(0, 3);
                displayTours(popularPosts);
                searchInput.value = '';
                return;
            }

            const filteredPosts = allPosts.filter(post =>
                post.title.toLowerCase().includes(query)
            );
            if (filteredPosts.length > 0) {
                const firstPost = filteredPosts[0];
                window.location.href = `post-detail.html?id=${firstPost.id}`;
            } else {
                popularToursGridContainer.innerHTML = '<p>Тур не найден.</p>';
            }
            searchInput.value = '';
        });
    }

    const cardsToAnimate = document.querySelectorAll('.attraction-card, .tour-card');
    cardsToAnimate.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    function checkScroll() {
        const windowHeight = window.innerHeight;
        document.querySelectorAll('.attraction-card, #popularToursGrid .tour-card').forEach(card => {
            if (card.style.opacity === '1') return;
            const cardPosition = card.getBoundingClientRect().top;
            if (cardPosition - windowHeight <= -100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    window.addEventListener('scroll', checkScroll);
    checkScroll();

    fetchAllPosts();
});