package com.codesmelling.backend.dto.Quiz;

import com.codesmelling.backend.dto.User.UserAnswerDto;
import lombok.Data;

import java.util.List;

@Data
public class QuizSubmissionResponseDto {
    private String username;
    private Long quizId;
    private List<UserAnswerDto> correct;
    private List<UserAnswerDto> wrong;
    private List<UserAnswerDto> allCorrect;
}
