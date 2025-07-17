package com.codesmelling.backend.dto.Auth;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
}
