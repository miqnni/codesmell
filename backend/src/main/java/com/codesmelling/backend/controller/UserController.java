package com.codesmelling.backend.controller;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.dto.User.RegisterUserDto;
import com.codesmelling.backend.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AppUserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterUserDto dto) {
        try {
            AppUser newUser = userService.registerNewUser(dto);
            return ResponseEntity.ok("User registered with ID: " + newUser.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
}