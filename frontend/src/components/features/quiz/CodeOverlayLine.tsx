"use client";

import LineHighlight from "@/interfaces/LineHighlight";
import { Box, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import VisualErrorTag from "./VisualErrorTag";

export default function CodeOverlayLine(props: {
  lineNumber: number;
  filePath: string;
  stateProps: {
    currentUserSelection: LineHighlight[];
    userSelectionSetter: Dispatch<SetStateAction<LineHighlight[]>>;
    pathToLineToTagMap: {
      [key: string]: { [key: number]: Set<string> };
    };
    currentMaxNumberWidth: number;
    maxNumberWidthSetter: Dispatch<SetStateAction<number>>;
  };
}) {
  const {
    lineNumber,
    filePath,
    stateProps: {
      currentUserSelection: currentUserAnswer,
      userSelectionSetter: userAnswerSetter,
      pathToLineToTagMap,
      currentMaxNumberWidth,
      maxNumberWidthSetter,
    },
  } = props;

  const initialHighlightState =
    currentUserAnswer.filter(
      (lineHighlight) =>
        lineHighlight.filePath === filePath &&
        lineHighlight.lineNumber === lineNumber
    ).length > 0;
  // console.log(`${lineNumber}: ${initialHighlightState ? "iYES" : "iNO"}`)
  const [highlighted, setHighlighted] = useState(initialHighlightState);

  // Here: lineNumber = 1, 2, 3, ...
  const lineNumberDigitCount = Math.floor(Math.log10(lineNumber)) + 1;
  // const possibleNewMaxNumberWidth = Math.max(currentMaxNumberWidth, lineNumberDigitCount)
  // maxNumberWidthSetter(possibleNewMaxNumberWidth)

  const lineNumberIndentVal =
    currentMaxNumberWidth - lineNumberDigitCount > 0
      ? currentMaxNumberWidth - lineNumberDigitCount
      : 0;
  const lineNumberText = " ".repeat(lineNumberIndentVal) + String(lineNumber);

  return (
    <Flex
      justifyContent="space-between"
      fontFamily={"mono"}
      bg={
        currentUserAnswer.filter(
          (lineHighlight) =>
            lineHighlight.filePath === filePath &&
            lineHighlight.lineNumber === lineNumber
        ).length > 0
          ? "rgba(0,0,255,0.33)"
          : "rgba(255,255,255,0)"
      }
      onClick={() => {
        // console.log(highlighted ? "YES" : "NO")
        // if (
        //   pathToLineToTagMap[filePath] &&
        //   pathToLineToTagMap[filePath][lineNumber]
        // )
        // console.log(Array.from(pathToLineToTagMap[filePath][lineNumber]));
        userAnswerSetter(
          !highlighted
            ? [
                ...currentUserAnswer.filter(
                  (lineHighlight) =>
                    !(
                      lineHighlight.filePath === filePath &&
                      lineHighlight.lineNumber === lineNumber
                    )
                ),
                { filePath, lineNumber, errorTag: "DEFAULT" },
              ]
            : currentUserAnswer.filter(
                (lineHighlight) =>
                  !(
                    lineHighlight.filePath === filePath &&
                    lineHighlight.lineNumber === lineNumber
                  )
              )
        );
        setHighlighted(!highlighted);
      }}
    >
      {lineNumberText}
      <Flex>
        {/* A container for a visual representation of error tags */}
        {/* <VisualErrorTag colour="#dd0000" errorCode="ERRR1" />
        <VisualErrorTag colour="#dddd00" errorCode="ER2" /> */}
        {!pathToLineToTagMap[filePath]
          ? null
          : !pathToLineToTagMap[filePath][lineNumber]
          ? null
          : Array.from(pathToLineToTagMap[filePath][lineNumber])
              .toSorted()
              .map((errorTagStr) => {
                // console.log(filePath + ":" + lineNumber + ":" + errorTag.code);
                const errorTagObj = JSON.parse(errorTagStr);
                return (
                  <VisualErrorTag
                    key={filePath + ":" + lineNumber + ":" + errorTagObj.code}
                    colour={errorTagObj.colour}
                    errorCode={errorTagObj.code}
                  />
                );
              })}
      </Flex>
    </Flex>
  );
}
