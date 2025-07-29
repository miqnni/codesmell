package com.codesmelling.backend.dto.User;

import lombok.Data;

@Data
public class ChangePasswordDto {
    private String username;
    private String oldPassword;
    private String newPassword;
}