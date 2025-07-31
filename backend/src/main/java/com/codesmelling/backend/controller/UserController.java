package com.codesmelling.backend.controller;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.dto.User.*;
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

    @PutMapping("/email")
    public ResponseEntity<?> updateEmail(@RequestHeader("Authorization") String token,
                                         @RequestBody EmailUpdateDto dto) {
        userService.updateEmail(cleanToken(token), dto.newEmail());
        return ResponseEntity.ok("Email updated");
    }

    @PutMapping("/username")
    public ResponseEntity<?> updateUsername(@RequestHeader("Authorization") String token,
                                            @RequestBody UsernameUpdateDto dto) {
        userService.updateUsername(cleanToken(token), dto.newUsername());
        return ResponseEntity.ok("Username updated");
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestHeader("Authorization") String token,
                                            @RequestBody PasswordUpdateDto dto) {
        userService.updatePassword(cleanToken(token), dto.oldPassword(), dto.newPassword());
        return ResponseEntity.ok("Password updated");
    }

    // do testów bez autoryzacji
    @PutMapping("/user/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto dto) {
        userService.changePasswordByUsername(dto.getUsername(), dto);
        return ResponseEntity.ok("Password updated.");
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String token) {
        userService.deleteAccount(cleanToken(token));
        return ResponseEntity.ok("Account deleted");
    }

    private String cleanToken(String rawToken) {
        return rawToken.replace("Bearer ", "").trim();
    }

    @GetMapping("/giveMeMyName")
    public ResponseEntity<String> giveMeMyName(Authentication authentication) {
        String username = authentication.getName(); // automatycznie z JWT
        return ResponseEntity.ok(username);
    }
}