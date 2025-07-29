package com.codesmelling.backend.dto.User;

public record PasswordUpdateDto(String oldPassword, String newPassword) { }
