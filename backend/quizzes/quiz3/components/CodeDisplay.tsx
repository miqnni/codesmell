"use client"

import { Code, Box, Button, Text } from "@chakra-ui/react";

import hljs, { Language } from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CodeOverlayLine from "./CodeOverlayLine";
import LineHighlight from "@/interfaces/LineHighlight";

export default function CodeDisplay(props: {
  codeContent: string,
  filePath: string,
  currentUserAnswer: LineHighlight[],
  userAnswerSetter: Dispatch<SetStateAction<LineHighlight[]>>
}) {
  const { codeContent, filePath, userAnswerSetter, currentUserAnswer } = props

  const dotIdx: number = filePath.lastIndexOf(".")
  const fileExtension: string = dotIdx !== -1 ?
    (dotIdx !== filePath.length - 1 ? filePath.substring(dotIdx + 1).toLowerCase() : "txt")
    : "txt";
  const languageObj: Language | undefined = hljs.getLanguage(fileExtension)
  const languageToken: string = languageObj ? (languageObj.aliases && languageObj.aliases.length > 0 ? languageObj.aliases[0].toLowerCase() : "txt") : "txt";

  const lineCount = 1 + (codeContent.match(/\n/g) || []).length

  const [maxNumberWidth, setMaxNumberWidth] = useState(1)

  useEffect(() => { setMaxNumberWidth(1) }, [filePath])

  useEffect(() => {
    setMaxNumberWidth(Math.max(
      maxNumberWidth,
      Math.floor(Math.log10(lineCount)
      ) + 1))
  }, [lineCount])

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
              currentUserAnswer,
              userAnswerSetter,
              currentMaxNumberWidth: maxNumberWidth,
              maxNumberWidthSetter: setMaxNumberWidth
            }}
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
        dangerouslySetInnerHTML={{ __html: hljs.highlight(codeContent, { language: languageToken }).value }}
      />
    </Box>
  );
}
