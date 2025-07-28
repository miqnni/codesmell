package com.codesmelling.backend.dto.ErrorTag;

import lombok.Data;

@Data
public class ErrorTagCsvDto {
    private int lineNumber;
    private String type;
    private String fileName;
    private long quizId;
}
