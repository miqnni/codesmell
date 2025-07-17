package com.codesmelling.backend.service;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository userRepository;
    //private final PasswordEncoder passwordEncoder;

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
