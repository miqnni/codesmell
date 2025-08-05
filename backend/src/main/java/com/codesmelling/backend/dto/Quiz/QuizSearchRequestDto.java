package com.codesmelling.backend.dto.Quiz;


import lombok.Data;

import java.util.List;

@Data
public class QuizSearchRequestDto {
    private String query;
    private List<String> languages;
    private List<Integer> difficulties;
}