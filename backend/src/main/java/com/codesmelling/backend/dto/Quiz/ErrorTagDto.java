package com.codesmelling.backend.dto.Quiz;

import lombok.Data;

@Data
public class ErrorTagDto {
    private int lineNumber;
    private String tag; // np. TYPO, SYNTAX_ERROR, WRONG_METHOD_CALL
}
