package com.codesmelling.backend.dto.Auth;

import lombok.Data;

@Data
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
}
