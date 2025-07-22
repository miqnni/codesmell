package com.codesmelling.backend.dto.Quiz;

import lombok.Data;

import java.util.List;

@Data
public class QuizFilesDto {
    private String quizName;
    private Long quizId;
    private List<String> codeFilePaths;
}