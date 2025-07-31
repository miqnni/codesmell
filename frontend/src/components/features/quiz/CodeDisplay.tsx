"use client";

import { Code, Box } from "@chakra-ui/react";

import hljs, { Language } from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CodeOverlayLine from "./CodeOverlayLine";
import LineHighlight from "@/interfaces/LineHighlight";
import PathToLineToTagMap from "@/interfaces/PathToLineToTagMap";
import SubmissionResults from "@/interfaces/SubmissionResults";
import PathToLineToAnswerStateMap from "@/interfaces/PathToLineToAnswerStateMap";
import ErrorTag from "@/interfaces/ErrorTag";
import { LineStateInAnswer } from "@/util/types";

const getFileExtension: (filePath: string) => string = (filePath: string) => {
  const dotIdx: number = filePath.lastIndexOf(".");
  const fileExtension: string =
    dotIdx !== -1
      ? dotIdx !== filePath.length - 1
        ? filePath.substring(dotIdx + 1).toLowerCase()
        : "txt"
      : "txt";
  const languageObj: Language | undefined = hljs.getLanguage(fileExtension);

  return languageObj
    ? languageObj.aliases && languageObj.aliases.length > 0
      ? languageObj.aliases[0].toLowerCase()
      : "txt"
    : "txt";
};

const createPathToLineToAnswerStateMap = (
  submissionResults?: SubmissionResults
): PathToLineToAnswerStateMap => {
  if (!submissionResults) return {};

  const res: PathToLineToAnswerStateMap = {};

  const arrayEntries: { lineState: LineStateInAnswer; arr: ErrorTag[] }[] = [
    { lineState: "correct", arr: submissionResults.correctAnswers },
    { lineState: "incorrect", arr: submissionResults.incorrectAnswers },
    { lineState: "missing", arr: submissionResults.missingAnswers }, // If ANY of the line's required tags is missing, the "correct" line state will be overwritten by "missing"
  ];

  for (const { lineState, arr } of arrayEntries) {
    for (const { filePath, lineNumber } of arr) {
      if (!res[filePath]) res[filePath] = {};
      res[filePath][Number(lineNumber)] = lineState;
    }
  }

  return res;
};

export default function CodeDisplay(props: {
  codeContent: string;
  filePath: string;
  pathToLineToTagMap: PathToLineToTagMap;
  currentUserSelection: LineHighlight[];
  userSelectionSetter: Dispatch<SetStateAction<LineHighlight[]>>;
  submissionResults: SubmissionResults | undefined;
}) {
  const {
    codeContent,
    filePath,
    pathToLineToTagMap,
    currentUserSelection: currentUserAnswer,
    userSelectionSetter: userAnswerSetter,
    submissionResults,
  } = props;

  const [maxNumberWidth, setMaxNumberWidth] = useState(1);

  const languageToken: string = getFileExtension(filePath);

  const lineCount = 1 + (codeContent.match(/\n/g) || []).length;

  const pathToLineToAnswerStateMap: PathToLineToAnswerStateMap =
    createPathToLineToAnswerStateMap(submissionResults);

  useEffect(() => {
    setMaxNumberWidth(1);
  }, [filePath]);

  useEffect(() => {
    setMaxNumberWidth(
      Math.max(maxNumberWidth, Math.floor(Math.log10(lineCount)) + 1)
    );
  }, [lineCount, maxNumberWidth]);

  return (
    <Box position="relative">
      <Box // Overlay for highlighting lines of code
        zIndex={3}
        bg="rgba(255,255,255,0.25)"
        width="100%"
        padding={2}
        rounded="md"
        position="absolute"
        fontSize="md"
        lineHeight={1.75}
      >
        {[...Array(lineCount)].map((_el, i) => (
          <CodeOverlayLine
            key={i + 1}
            lineNumber={i + 1}
            filePath={filePath}
            stateProps={{
              currentUserSelection: currentUserAnswer,
              userSelectionSetter: userAnswerSetter,
              pathToLineToTagMap: pathToLineToTagMap,
              currentMaxNumberWidth: maxNumberWidth,
              maxNumberWidthSetter: setMaxNumberWidth,
            }}
            pathToLineToAnswerStateMap={pathToLineToAnswerStateMap}
          />
        ))}
      </Box>
      <Code
        // Dynamic change based on the maximum number of digits
        // in a line number
        ml={`${1 + 0.5 * maxNumberWidth}rem`}
        width="calc(100%-2rem)"
        zIndex={2}
        padding={2}
        rounded="md"
        display="block"
        whiteSpace="pre"
        backgroundColor="#272727"
        fontSize="md"
        lineHeight={1.75}
        overflow="auto"
        dangerouslySetInnerHTML={{
          __html: hljs.highlight(codeContent, { language: languageToken })
            .value,
        }}
      />
    </Box>
  );
}
