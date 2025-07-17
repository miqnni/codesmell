package com.codesmelling.backend.dto.Progress;

import lombok.Data;

@Data
public class SaveProgressRequestDto {
    private Long quizId;
    private int correctAnswers;
    private int totalAnswers;
}
