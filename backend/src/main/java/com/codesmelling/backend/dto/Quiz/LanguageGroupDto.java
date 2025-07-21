package com.codesmelling.backend.dto.Quiz;


import lombok.Data;

import java.util.List;

@Data
public class LanguageGroupDto {
    private String language; // np. "java"
    private List<QuizListDto> quizzes;
}