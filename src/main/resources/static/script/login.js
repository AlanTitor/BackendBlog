// Переключение видимости пароля
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Пожалуйста, заполните поля Email и Пароль.');
            return;
        }

        const loginData = {
            email: email,
            password: password
        };

        // ЗАМЕНИТЬ НА АКТУАЛЬНЫЙ URL ТВОЕГО БЭКЕНДА (например, 'http://localhost:8080/api/user/login')
        const backendLoginUrl = 'http://localhost:8080/api/user/login'; // <-- УКАЖИ ПРАВИЛЬНЫЙ URL!

        if (backendLoginUrl === 'YOUR_BACKEND_LOGIN_API_URL_PLACEHOLDER') { // Заглушка, если URL не изменен
            alert('Пожалуйста, укажите правильный URL бэкенда для входа в JavaScript коде (переменная backendLoginUrl).');
            console.error("Необходимо сконфигурировать backendLoginUrl в login.html");
            return;
        }

        try {
            const response = await fetch(backendLoginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const responseText = await response.text();

            if (response.ok) {
                if (responseText === "Logged") {
                    alert('Вход выполнен успешно! Перенаправление на главную страницу...');
                    // 1. Сохраняем информацию о том, что пользователь залогинен
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email); // Можно сохранить email пользователя

                    // 2. Перенаправляем на главную страницу (index.html)
                    window.location.href = 'index.html';
                } else {
                    alert('Успешный ответ от сервера, но неожиданное сообщение: ' + responseText);
                }
            } else {
                let errorMessage = `Ошибка входа (Статус: ${response.status})`;
                if (responseText) {
                    errorMessage += `: ${responseText}`;
                }
                 if (response.status === 404) {
                    if (responseText.includes("No such user!")) {
                         errorMessage = 'Пользователь с таким email не найден или неверный пароль.';
                    } else if (responseText.includes("Incorrect data!")) {
                         errorMessage = 'Неверный email или пароль (некорректные данные).';
                    }
                } else if (response.status === 409) {
                     if (responseText.includes("Incorrect data")) {
                         errorMessage = 'Некорректные данные для входа. Проверьте Email и Пароль.';
                    } else if (responseText.includes("Wrong data!")) {
                         errorMessage = 'Неверный пароль.';
                    }
                }
                alert(errorMessage);
            }

        } catch (error) {
            console.error('Ошибка при отправке запроса на вход:', error);
            alert('Произошла сетевая ошибка при попытке входа. Пожалуйста, проверьте ваше интернет-соединение и правильность URL бэкенда, затем попробуйте снова.');
        }
    });

    // Боковое меню (остается без изменений)
    // ... (код бокового меню)
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    menuToggle.addEventListener('click', () => {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('visible');
        document.body.classList.add('menu-open');
    });

    menuClose.addEventListener('click', () => {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('visible');
        document.body.classList.remove('menu-open');
    });

    menuOverlay.addEventListener('click', () => {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('visible');
        document.body.classList.remove('menu-open');
    });