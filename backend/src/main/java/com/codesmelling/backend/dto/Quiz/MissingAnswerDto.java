package com.codesmelling.backend.dto.Quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MissingAnswerDto {
    private String filePath;
    private int lineNumber;
    private String errorTag;
}