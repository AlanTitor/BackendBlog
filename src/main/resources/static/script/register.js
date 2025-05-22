// Переключение видимости паролей
    const toggleRegPassword = document.getElementById('toggleRegPassword');
    const regPasswordInput = document.getElementById('regPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    toggleRegPassword.addEventListener('click', function() {
        const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        regPasswordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Обработка формы регистрации
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('regEmail').value;
        const password = regPasswordInput.value;
        const confirmPasswordValue = confirmPasswordInput.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (!firstName || !lastName || !email || !password || !confirmPasswordValue) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        if (password !== confirmPasswordValue) {
            alert('Пароли не совпадают!');
            return;
        }

         if (password.length < 6) { // Пример дополнительной валидации пароля
            alert('Пароль должен содержать не менее 6 символов.');
            return;
        }

        if (!agreeTerms) {
            alert('Вы должны согласиться с условиями использования и политикой конфиденциальности.');
            return;
        }

        // Данные для отправки на бэкенд
        const registrationData = {
            name: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8080/api/user/reg', { // Убедись, что URL правильный
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            const responseText = await response.text();

            if (response.status === 201) { // CREATED
                if (responseText === "Registered") {
                    alert('Регистрация прошла успешно! Теперь вы можете войти.');
                    // Можно перенаправить на страницу входа, например:
                    // window.location.href = 'login.html';
                } else {
                     alert('Успешный ответ от сервера, но неожиданное сообщение: ' + responseText);
                }
            } else {
                // Обработка ошибок от сервера
                let errorMessage = `Ошибка регистрации: ${responseText} (Статус: ${response.status})`;
                if (response.status === 409) { // CONFLICT
                    // Предполагаем, что бэк теперь отвечает "User with this email already exists!"
                    if (responseText.toLowerCase().includes("already exists")) {
                        errorMessage = 'Пользователь с таким email уже существует.';
                    }
                } else if (response.status === 400 || response.status === 404) { // BAD_REQUEST или NOT_FOUND для некорректных данных
                    // Бэк может вернуть "Incorrect data" или сообщение о нехватке полей
                    if (responseText.toLowerCase().includes("incorrect data") || responseText.toLowerCase().includes("required")) {
                         errorMessage = 'Некорректные данные для регистрации или не все поля заполнены.';
                    }
                }
                alert(errorMessage);
            }

        } catch (error) {
            console.error('Ошибка при отправке запроса на регистрацию:', error);
            alert('Произошла ошибка при попытке регистрации. Пожалуйста, проверьте ваше интернет-соединение и попробуйте снова.');
        }
    });

    // Боковое меню (остается без изменений)
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