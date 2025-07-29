package com.codesmelling.backend.dto.Quiz;

import com.codesmelling.backend.dto.User.UserAnswerDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizEvaluationResultDto {
    private List<UserAnswerDto> correctAnswers;
    private List<UserAnswerDto> incorrectAnswers;
    private List<MissingAnswerDto> missingAnswers;
    private int score;
    private double scorePercent;
}