package com.codesmelling.backend.dto.Auth;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class RegisterRequestDto {
    private String username;
    private String password;
    private String email;
}
