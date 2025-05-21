package org.AlanTitor.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORSWebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Применяет CORS ко всем путям в приложении
                .allowedOrigins("*") // Разрешает запросы от любого источника. В продакшене лучше указать конкретные домены, например, "http://localhost:3000", "https://your-frontend-domain.com"
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Разрешенные HTTP методы
                .allowedHeaders("*") // Разрешает все заголовки в запросе
                .allowCredentials(false) // Установи в 'true', если твой фронтенд должен отправлять куки или заголовки авторизации (например, при использовании сессий). Если 'true', то 'allowedOrigins' не может быть "*" - нужно указать конкретные домены.
                .maxAge(3600); // Время в секундах, на которое результаты pre-flight запроса (OPTIONS) могут быть кэшированы браузером.
    }
}
