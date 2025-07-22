package com.codesmelling.backend.dto.Quiz;

import lombok.Data;

import java.util.List;

@Data
public class QuizListDto {
    private String quizName;  // np. "quiz1"
    private Long quizId;
    private List<String> codeFilePaths;  // <- dodaj to pole
}