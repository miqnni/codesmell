package com.codesmelling.backend.dto.Quiz;

import lombok.Data;

import java.util.List;

@Data
public class QuizDetailDto {
    private Long id;
    private String title;
    private String fileContent; // cały plik jako tekst
    private List<ErrorTagDto> errorTags;
}
