package com.codesmelling.backend.service;

import com.codesmelling.backend.config.CsvFileConfigLoader;
import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository userRepository;
    //private final PasswordEncoder passwordEncoder;

    private final CsvParserService parser;
    private final CsvFileConfigLoader loader;

    public void importUsers() throws IOException {
        InputStream in = loader.load("AppUsers.csv");
        List<AppUser> users = parser.parse(AppUser.class, in);
        userRepository.saveAll(users);
    }

    public AppUser createStudentPiwoUser() {
        if (userRepository.findByUsername("StudentPiwo").isPresent()) {
            throw new RuntimeException("Użytkownik StudentPiwo już istnieje.");
        }

        AppUser user = AppUser.builder()
                .username("StudentPiwo")
                .password("haslopiwo")
                .email("student@piwo.pl")
                .role("ROLE_USER")
                .build();

        return userRepository.save(user);
    }
}
