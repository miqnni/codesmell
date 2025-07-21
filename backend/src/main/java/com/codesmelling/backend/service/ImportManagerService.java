package com.codesmelling.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ImportManagerService {
    private final AppUserService userCsvService;
    private final QuizService quizCsvService;
    private final ProgressService progressCsvService;
    private final SequenceResetService sequenceResetService;
    private final ErrorTagService errorTagCsvService;


    public void importAll() throws IOException {
        sequenceResetService.resetAllSequences();
        userCsvService.importUsers();
        quizCsvService.importQuizzes();
        progressCsvService.importProgress();
        errorTagCsvService.importAllErrorTags();
    }
}