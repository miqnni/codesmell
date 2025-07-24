package com.codesmelling.backend.service;

import com.codesmelling.backend.config.CsvFileConfigLoader;
import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.dto.User.LoginUserDto;
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
        AppUser user = userRepository.findByUsername(dto.getUsername());
        if (!user.getPassword().equals(dto.getPassword())){
            throw new IllegalArgumentException("Bad password");
        }
        String token = jwtService.generateToken(user);
        return token;
    }

    public String giveMeMyNameService(String token) {
        return jwtService.extractUsername(token);
    }
}
