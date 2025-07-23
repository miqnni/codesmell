"use client"

import { Code, Box, Button, Text } from "@chakra-ui/react";

import hljs, { Language } from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Dispatch, SetStateAction, useState } from "react";
import CodeOverlayLine from "./CodeOverlayLine";
import LineHighlight from "@/interfaces/LineHighlight";

export default function CodeDisplay(props: { codeContent: string, filePath: string, currentUserAnswer: LineHighlight[], userAnswerSetter: Dispatch<SetStateAction<LineHighlight[]>> }) {
  const { codeContent, filePath, userAnswerSetter, currentUserAnswer } = props

  const dotIdx: number = filePath.lastIndexOf(".")
  const fileExtension: string = dotIdx !== -1 ?
    (dotIdx !== filePath.length - 1 ? filePath.substring(dotIdx + 1).toLowerCase() : "txt")
    : "txt";
  const languageObj: Language | undefined = hljs.getLanguage(fileExtension)
  const languageToken: string = languageObj ? (languageObj.aliases && languageObj.aliases.length > 0 ? languageObj.aliases[0].toLowerCase() : "txt") : "txt";

  const lineCount = 1 + (codeContent.match(/\n/g) || []).length

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
        {[...Array(lineCount)].map((el, i) => (
          <CodeOverlayLine
            key={i + 1}
            lineNumber={i + 1}
            filePath={filePath}
            currentUserAnswer={currentUserAnswer}
            userAnswerSetter={userAnswerSetter}
          />
        ))}
      </Box>
      <Code
        ml="2rem"
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
        dangerouslySetInnerHTML={{ __html: hljs.highlight(codeContent, { language: languageToken }).value }}
      />
    </Box>
  );
}
