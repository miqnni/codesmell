"use client"

import LineHighlight from "@/interfaces/LineHighlight";
import { Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

export default function CodeOverlayLine(props: {
  lineNumber: number,
  filePath: string,
  stateProps: {
    currentUserAnswer: LineHighlight[],
    userAnswerSetter: Dispatch<SetStateAction<LineHighlight[]>>
    currentMaxNumberWidth: number,
    maxNumberWidthSetter: Dispatch<SetStateAction<number>>
  }
}) {
  const {
    lineNumber,
    filePath,
    stateProps: {
      currentUserAnswer,
      userAnswerSetter,
      currentMaxNumberWidth,
      maxNumberWidthSetter
    }
  } = props


  const initialHighlightState = currentUserAnswer.filter(lineHighlight => (lineHighlight.filePath === filePath && lineHighlight.lineNumber === lineNumber)).length > 0
  // console.log(`${lineNumber}: ${initialHighlightState ? "iYES" : "iNO"}`)
  const [highlighted, setHighlighted] = useState(initialHighlightState)

  // Here: lineNumber = 1, 2, 3, ...
  const lineNumberDigitCount = Math.floor(Math.log10(lineNumber)) + 1;
  // const possibleNewMaxNumberWidth = Math.max(currentMaxNumberWidth, lineNumberDigitCount)
  // maxNumberWidthSetter(possibleNewMaxNumberWidth)

  const lineNumberIndentVal = currentMaxNumberWidth - lineNumberDigitCount > 0 ? currentMaxNumberWidth - lineNumberDigitCount : 0
  const lineNumberText = " ".repeat(lineNumberIndentVal) + String(lineNumber);

  return (

    <Box
      fontFamily={"mono"}
      bg={(currentUserAnswer.filter(
        lineHighlight => (lineHighlight.filePath === filePath && lineHighlight.lineNumber === lineNumber)
      )).length > 0 ? "rgba(0,0,255,0.33)" : "rgba(255,255,255,0)"}
      onClick={() => {
        // console.log(highlighted ? "YES" : "NO")
        userAnswerSetter(
          !highlighted
            ? [...(currentUserAnswer.filter(lineHighlight => !(lineHighlight.filePath === filePath && lineHighlight.lineNumber === lineNumber))), { filePath, lineNumber, errorTag: "DEFAULT" }]
            : currentUserAnswer.filter(lineHighlight => !(lineHighlight.filePath === filePath && lineHighlight.lineNumber === lineNumber))
        )
        setHighlighted(!highlighted)
      }}
    >
      {lineNumberText}
    </Box>
  )
}