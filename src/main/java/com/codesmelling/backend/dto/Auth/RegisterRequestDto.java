package com.codesmelling.backend.dto.Auth;

import lombok.Data;

@Data
public class RegisterRequestDto {
    private String username;
    private String password;
    private String email;
}
