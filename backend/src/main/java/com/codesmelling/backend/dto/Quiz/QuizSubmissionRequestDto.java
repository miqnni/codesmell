package com.codesmelling.backend.dto.Quiz;

import com.codesmelling.backend.dto.User.UserAnswerDto;
import lombok.Data;

import java.util.List;

@Data
public class QuizSubmissionRequestDto {
    private String username;
    private Long quizId;
    private List<UserAnswerDto> answers;

}
