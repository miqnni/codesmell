package com.codesmelling.backend.dto.Quiz;

import lombok.Data;

@Data
public class QuizListDto {
    private String quizName;  // np. "quiz1"
    private Long quizId;      // może być null jeśli nie łączysz folderu z encją Quiz
}