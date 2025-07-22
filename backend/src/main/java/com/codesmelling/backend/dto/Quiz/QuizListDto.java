package com.codesmelling.backend.dto.Quiz;

import lombok.Data;

@Data
public class QuizListDto {
    private Long quizId;
    private String quizName;

    public QuizListDto(Long quizId, String quizName) {
        this.quizId = quizId;
        this.quizName = quizName;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }
}
