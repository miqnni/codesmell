"use client"

import LineHighlight from "@/interfaces/LineHighlight";
import { Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

export default function CodeOverlayLine(props: { lineNumber: number, filePath: string, currentUserAnswer: LineHighlight[], userAnswerSetter: Dispatch<SetStateAction<LineHighlight[]>> }) {
  const { lineNumber, filePath, currentUserAnswer, userAnswerSetter } = props



  const [highlighted, setHighlighted] = useState(false)

  return (
    <Box
      bg={(currentUserAnswer.filter(
        lineHighlight => (lineHighlight.filePath === filePath && lineHighlight.lineNumber === lineNumber)
      )).length > 0 ? "rgba(0,0,255,0.33)" : "rgba(255,255,255,0)"}
      onMouseDown={() => {
        userAnswerSetter(
          !highlighted
            ? [...currentUserAnswer, { filePath, lineNumber, errorTag: "DEFAULT" }]
            : currentUserAnswer.filter(lineHighlight => !(lineHighlight.filePath === filePath && lineHighlight.lineNumber === lineNumber))
        )
        setHighlighted(!highlighted)
      }}
    >
      {lineNumber}
    </Box>
  )
}