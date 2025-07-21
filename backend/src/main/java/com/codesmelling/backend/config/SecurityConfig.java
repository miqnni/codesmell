package com.codesmelling.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Wyłączenie CSRF dla prostoty testów
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                        //.requestMatchers("/import", "/list").permitAll()  // <-- pozwól na /import bez logowania
                        //.anyRequest().authenticated()            // reszta endpointów wymaga autoryzacji
                )
                .formLogin(Customizer.withDefaults()); // nadal będzie działać login form, ale nie dla /import

        return http.build();
    }
}
