package com.codesmelling.backend.dto.User;

import lombok.Data;

@Data
public class RegisterUserDto {
    private String username;
    private String email;
    private String password;
}