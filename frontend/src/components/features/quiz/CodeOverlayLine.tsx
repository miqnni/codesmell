"use client";

import LineHighlight from "@/interfaces/LineHighlight";
import { Box, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import VisualErrorTag from "./VisualErrorTag";
import VisualErrorTagContainer from "./VisualErrorTagContainer";

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
      currentUserSelection: currentUserSelection,
      userSelectionSetter: userSelectionSetter,
      pathToLineToTagMap,
      currentMaxNumberWidth,
      maxNumberWidthSetter,
    },
  } = props;

  const initialHighlightState =
    currentUserSelection.filter(
      (lineHighlight) =>
        lineHighlight.filePath === filePath &&
        lineHighlight.lineNumber === lineNumber
    ).length > 0;
  // console.log(`${lineNumber}: ${initialHighlightState ? "iYES" : "iNO"}`)
  const [highlighted, setHighlighted] = useState(initialHighlightState);

  useEffect(() => {
    setHighlighted(
      currentUserSelection.filter(
        (lineHighlight) =>
          lineHighlight.filePath === filePath &&
          lineHighlight.lineNumber === lineNumber
      ).length > 0
    );
  }, [currentUserSelection, filePath, lineNumber]);

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
      maxH={16}
      justifyContent="space-between"
      fontFamily={"mono"}
      bg={
        currentUserSelection.filter(
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
        userSelectionSetter(
          !highlighted
            ? [
                ...currentUserSelection.filter(
                  (lineHighlight) =>
                    !(
                      lineHighlight.filePath === filePath &&
                      lineHighlight.lineNumber === lineNumber
                    )
                ),
                { filePath, lineNumber, errorTag: "DEFAULT" },
              ]
            : currentUserSelection.filter(
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
      <VisualErrorTagContainer
        pathToLineToTagMap={pathToLineToTagMap}
        filePath={filePath}
        lineNumber={lineNumber}
      />
    </Flex>
  );
}
