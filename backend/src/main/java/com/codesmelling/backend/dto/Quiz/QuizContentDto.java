package com.codesmelling.backend.dto.Quiz;

import com.codesmelling.backend.dto.ErrorTag.ErrorTagCsvDto;
import lombok.Data;

import java.util.List;

@Data
public class QuizContentDto {
    private List<CodeFileDto> codeFiles;   // pliki z kodem: nazwa + zawartość
    private String errorTagsCsvContent;    // zawartość ErrorTags.csv
    private String solutionContent;        // zawartość Solution.txt

    @Data
    public static class CodeFileDto {
        private String fileName;
        private String content;
    }
}