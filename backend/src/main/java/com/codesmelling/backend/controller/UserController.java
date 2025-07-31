package com.codesmelling.backend.controller;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.dto.User.LoginUserDto;
import com.codesmelling.backend.dto.User.RegisterUserDto;
import com.codesmelling.backend.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AppUserService userService;

//    @PostMapping("/register")
//    public ResponseEntity<String> register(@RequestBody RegisterUserDto dto) {
//        try {
//            AppUser newUser = userService.registerNewUser(dto);
//            return ResponseEntity.ok("User registered with ID: " + newUser.getId());
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
//        }
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody LoginUserDto dto) {
//        try {
//            String token = userService.authenticate(dto);
//            return ResponseEntity.ok(token);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
//        }
//    }

    @GetMapping("/giveMeMyName")
    public ResponseEntity<String> giveMeMyName(Authentication authentication) {
        String username = authentication.getName(); // automatycznie z JWT
        return ResponseEntity.ok(username);
    }
}