package com.codesmelling.backend.dto.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class UserAnswerDto {
    private String filePath;
    private int lineNumber;
    private String errorTag;
}