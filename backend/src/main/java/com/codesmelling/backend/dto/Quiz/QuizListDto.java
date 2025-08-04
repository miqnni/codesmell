package com.codesmelling.backend.dto.Quiz;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class QuizListDto {
    private Long quizId;
    private String quizName;
    private int difficulty;
    private Set<String> languages;
}
