package com.codesmelling.backend.dto.Progress;

import lombok.Data;

@Data
public class UserProgressDto {
    private Long quizId;
    private int correctAnswers;
    private int totalAnswers;
    private double scorePercent;
}
