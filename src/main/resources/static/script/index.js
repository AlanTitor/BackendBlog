let menuToggle, menuClose, sideMenu, menuOverlay;
    let popularToursGridContainer; // Для популярных туров на главной
    const backendApiPostListUrl = 'http://localhost:8080/api/post/list'; // ЗАМЕНИ НА СВОЙ URL

    function toggleMenu(open) {
        if (!sideMenu || !menuOverlay || !document.body) return;
        sideMenu.classList.toggle('open', open);
        menuOverlay.classList.toggle('visible', open);
        document.body.classList.toggle('menu-open', open);
    }

    async function fetchPopularTours() {
        if (!popularToursGridContainer) {
            console.warn("Элемент #popularToursGrid не найден на странице.");
            return;
        }
        popularToursGridContainer.innerHTML = '<p class="loading-popular-tours">Загрузка...</p>';
        console.log("fetchPopularTours: Запрос на URL:", backendApiPostListUrl);

        try {
            const response = await fetch(backendApiPostListUrl);
            console.log("fetchPopularTours: Ответ, статус:", response.status, response.statusText);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка HTTP: ${response.status}. ${errorText}`);
            }
            const result = await response.json();
            console.log("fetchPopularTours: Данные JSON:", result);
            const posts = result.Data;

            if (posts && Array.isArray(posts) && posts.length > 0) {
                popularToursGridContainer.innerHTML = '';
                const postsToShow = posts.slice(0, 3); // Показываем первые 3
                console.log(`fetchPopularTours: Отображаем ${postsToShow.length} из ${posts.length} постов.`);

                postsToShow.forEach(post => {
                    const tourCard = document.createElement('div');
                    tourCard.classList.add('tour-card'); // Используем твой класс

                    let displayDate = 'дата не указана';
                    if (post.date) { // Убедись, что поле называется 'date' в PostEntity
                        try { displayDate = new Date(post.date).toLocaleDateString('ru-RU'); }
                        catch (e) { console.warn("Ошибка форматирования даты для поста ID " + post.id, post.date, e); }
                    }

                    // Используем поля, которые есть в твоей PostEntity
                    // и соответствуют старому макету .tour-card
                    // Если полей "duration", "difficulty", "price" нет в PostEntity, они не отобразятся.
                    tourCard.innerHTML = `
                        ${post.imageUrl ? `<div class="card-image"><img src="${post.imageUrl}" alt="${post.title || ''}"></div>` : ''}
                        <div class="tour-content">
                            <h3 class="tour-title">${post.title || 'Без названия'}</h3>
                            <!-- Краткое описание можно добавить, если оно есть в PostEntity -->
                            ${post.shortDescription ? `<p class="card-description" style="margin-bottom:15px; color:#7f8c8d;">${post.shortDescription}</p>` : ''}
                            <div class="tour-info">
                                ${post.duration_placeholder ? `<span class="tour-duration"><i class="fas fa-calendar-alt tour-icon"></i> ${post.duration_placeholder}</span>` : ''}
                                ${post.difficulty_placeholder ? `<span class="tour-difficulty"><i class="fas fa-signal tour-icon"></i> ${post.difficulty_placeholder}</span>` : ''}
                                <!-- Если хочешь показать автора и дату -->
                                ${post.author ? `<span><i class="fas fa-user tour-icon"></i> ${post.author.name || 'Автор'}</span>` : ''}
                                <span><i class="fas fa-calendar-alt tour-icon"></i> ${displayDate}</span>
                            </div>
                            ${post.price_placeholder ? `<p class="tour-price">${post.price_placeholder}</p>` : ''}
                            <a href="post-detail.html?id=${post.id}" class="tour-button">Подробнее</a>
                        </div>
                    `;
                    popularToursGridContainer.appendChild(tourCard);
                    // Анимация появления
                    setTimeout(() => card.classList.add('visible'), 50); // Добавляем 'visible' к tourCard (переменная card)
                });
            } else {
                popularToursGridContainer.innerHTML = '<p class="no-popular-tours">Популярные туры и статьи скоро появятся.</p>';
            }
        } catch (error) {
            console.error('fetchPopularTours: Ошибка:', error);
            if (popularToursGridContainer) popularToursGridContainer.innerHTML = `<p class="no-popular-tours">Не удалось загрузить. ${error.message}</p>`;
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
            menuNav.innerHTML = ''; // Очищаем меню перед заполнением
            const staticLinksData = [
                { href: "index.html", text: "Главная", icon: "fa-home" }, { href: "#attractions", text: "Достопримечательности", icon: "fa-landmark" }, // Изменил на якорь
                { href: "tours.html", text: "Все Туры", icon: "fa-map-signs" }, // Ссылка на страницу со всеми турами/постами
                { href: "activerecreation.html", text: "Активный отдых", icon: "fa-hiking" }, { href: "botany.html", text: "Ботаника", icon: "fa-leaf" },
                { href: "#", text: "Охота", icon: "fa-crosshairs" }, { href: "#", text: "Форум", icon: "fa-comments" }
            ];
            staticLinksData.forEach(linkData => {
                const item = document.createElement('div'); item.classList.add('menu-item');
                item.innerHTML = `<a href="${linkData.href}" class="menu-link"><i class="fas ${linkData.icon || 'fa-angle-right'}"></i> ${linkData.text}</a>`;
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
                    alert('Вы вышли из системы.'); window.location.reload();
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

            if (linkId === 'logoutMenuLink') return;
            if (linkId === 'profileMenuLink' && linkHref === '#') {
                link.addEventListener('click', e => { e.preventDefault(); alert('Страница профиля в разработке.'); toggleMenu(false); }); return;
            }

            link.addEventListener('click', e => {
                const targetHref = link.getAttribute('href'); // Используем targetHref для ясности
                if (targetHref && !targetHref.startsWith('#') && targetHref !== '#') {
                    toggleMenu(false);
                    // Не делаем preventDefault, позволяем перейти на другую страницу
                    // window.location.href = targetHref; // Это не нужно, браузер сам перейдет
                    return;
                }
                e.preventDefault();
                toggleMenu(false);
                if (targetHref && targetHref.startsWith('#') && targetHref.length > 1) {
                    const targetElement = document.querySelector(targetHref);
                    if (targetElement) {
                        let offset = 80; // Стандартный отступ для шапки
                        if (targetHref === '#home') offset = 0; // Для hero-секции скроллим в самый верх
                        window.scrollTo({top: targetElement.offsetTop - offset, behavior: 'smooth'});
                    }
                }
            });
        });

        if (menuToggle) menuToggle.addEventListener('click', () => toggleMenu(true));
        if (menuClose) menuClose.addEventListener('click', () => toggleMenu(false));
        if (menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));
        document.addEventListener('keydown', e => { if (sideMenu && sideMenu.classList.contains('open') && e.key === 'Escape') toggleMenu(false); });

        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const searchInput = searchForm.querySelector('.search-input');
                if (searchInput) {
                    alert(`Вы искали: "${searchInput.value}". Поиск будет реализован на бэкенде.`);
                    searchInput.value = '';
                }
            });
        }

        // Анимации при скролле для .attraction-card и .tour-card
        const cardsToAnimate = document.querySelectorAll('.attraction-card, .tour-card');
        cardsToAnimate.forEach(card => { // Изначально скрываем карточки для анимации
             card.style.opacity = '0';
             card.style.transform = 'translateY(20px)';
             card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        function checkScroll() {
            const windowHeight = window.innerHeight;
            document.querySelectorAll('.attraction-card, #popularToursGrid .tour-card').forEach(card => {
                // Если карточка уже видима, ничего не делаем
                if (card.style.opacity === '1') return;

                const cardPosition = card.getBoundingClientRect().top;
                if (cardPosition - windowHeight <= -100) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        }
        window.addEventListener('scroll', checkScroll);
        checkScroll(); // Первоначальная проверка

        fetchPopularTours(); // Загрузка популярных туров
    });