package com.codesmelling.backend.service;

import com.codesmelling.backend.config.CsvFileConfigLoader;
import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.dto.User.ChangePasswordDto;
import com.codesmelling.backend.dto.User.LoginUserDto;
import com.codesmelling.backend.dto.User.PasswordUpdateDto;
import com.codesmelling.backend.dto.User.RegisterUserDto;
import com.codesmelling.backend.repository.AppUserRepository;
import com.codesmelling.backend.auth.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository userRepository;
    private final JwtService jwtService;
    //private final PasswordEncoder passwordEncoder;

    private final CsvParserService parser;
    private final CsvFileConfigLoader loader;

    public void importUsers() throws IOException {
        InputStream in = loader.load("AppUsers.csv");
        List<AppUser> users = parser.parse(AppUser.class, in);
        userRepository.saveAll(users);
    }

    public AppUser registerNewUser(RegisterUserDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already taken");
        }

        AppUser user = AppUser.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                //.password(passwordEncoder.encode(dto.getPassword()))
                .password(dto.getPassword())
                .role("ROLE_USER")
                .build();

        return userRepository.save(user);
    }

    public String authenticate(LoginUserDto dto) {
        if (!userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Bad username");
        }
        AppUser user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: "));
        if (!user.getPassword().equals(dto.getPassword())){
            throw new IllegalArgumentException("Bad password");
        }
        String token = jwtService.generateToken(user);
        return token;
    }

    public String giveMeMyNameService(String token) {
        return jwtService.extractUsername(token);
    }

    public void updateEmail(String token, String newEmail) {
        String username = jwtService.extractUsername(token);
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    public void updateUsername(String token, String newUsername) {
        if (userRepository.existsByUsername(newUsername)) {
            throw new IllegalArgumentException("Username already taken");
        }
        String oldUsername = jwtService.extractUsername(token);
        AppUser user = userRepository.findByUsername(oldUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(newUsername);
        userRepository.save(user);
    }

    public void updatePassword(String token, String oldPassword, String newPassword) {
        String username = jwtService.extractUsername(token);
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getPassword().equals(oldPassword)) {
            throw new IllegalArgumentException("Old password incorrect");
        }
        user.setPassword(newPassword); // tu powinno być hashowanie
        userRepository.save(user);
    }

    public void deleteAccount(String token) {
        String username = jwtService.extractUsername(token);
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    // do testów
    public void changePasswordByUsername(String username, ChangePasswordDto dto) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getPassword().equals(dto.getOldPassword())) {
            throw new IllegalArgumentException("Wrong password");
        }
        user.setPassword(dto.getNewPassword());
        userRepository.save(user);
    }
}
