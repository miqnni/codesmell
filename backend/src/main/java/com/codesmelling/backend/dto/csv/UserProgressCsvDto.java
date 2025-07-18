package com.codesmelling.backend.dto.csv;

import lombok.Data;

@Data
public class UserProgressCsvDto {
    private Long id;
    private int correctAnswers;
    private int totalAnswers;
    private double scorePercent;
    private boolean completed;
    private Long userId;
    private Long quizId;
}