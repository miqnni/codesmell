package com.codesmelling.backend.service;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.dto.Auth.RegisterRequestDto;
import com.codesmelling.backend.dto.Auth.UserResponseDto;
import com.codesmelling.backend.repository.AppUserRepository;
import com.codesmelling.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;  // tu trzeba bean'a zrobić - czyli cały katalog Auth trza zrobić

    public UserResponseDto register(RegisterRequestDto request) {
        AppUser user = new AppUser();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());

        AppUser saved = userRepository.save(user);

        UserResponseDto response = new UserResponseDto();
        response.setId(saved.getId());
        response.setUsername(saved.getUsername());
        response.setEmail(saved.getEmail());
        return response;
    }

    public AppUser findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
