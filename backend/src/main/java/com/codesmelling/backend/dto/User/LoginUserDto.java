package com.codesmelling.backend.dto.User;

import lombok.Data;

@Data
public class LoginUserDto {
    private String username;
    private String password;
}