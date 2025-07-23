package com.codesmelling.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Wyłączenie CSRF dla prostoty testów
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                // .requestMatchers("/import", "/list").permitAll() // <-- pozwól na /import bez
                // logowania
                // .anyRequest().authenticated() // reszta endpointów wymaga autoryzacji
                )
                .formLogin(Customizer.withDefaults());

        return http.build();
    }

    // Bean do konfiguracji CORS
    @Bean
    public WebMvcConfigurer corsConfigurationSource() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // zezwól na wszystkie endpointy
                        .allowedOrigins("http://localhost:3000") // adres frontendu
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
