package com.codesmelling.backend.controller;

import com.codesmelling.backend.dto.Auth.RegisterRequestDto;
import com.codesmelling.backend.dto.Auth.UserResponseDto;
import com.codesmelling.backend.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody RegisterRequestDto request) {
        UserResponseDto response = userService.register(request);
        return ResponseEntity.ok(response);
    }
}
