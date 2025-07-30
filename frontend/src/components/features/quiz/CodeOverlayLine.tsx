"use client";

import LineHighlight from "@/interfaces/LineHighlight";
import { Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import VisualErrorTagContainer from "./VisualErrorTagContainer";
import PathToLineToTagMap from "@/interfaces/PathToLineToTagMap";
import PathToLineToAnswerStateMap from "@/interfaces/PathToLineToAnswerStateMap";

const conditionalLineBackground = (
  currentUserSelection: LineHighlight[],
  pathToLineToAnswerStateMap: PathToLineToAnswerStateMap,
  filePath: string,
  lineNumber: number
): string => {
  if (
    pathToLineToAnswerStateMap &&
    pathToLineToAnswerStateMap[filePath] &&
    pathToLineToAnswerStateMap[filePath][lineNumber]
  ) {
    switch (pathToLineToAnswerStateMap[filePath][lineNumber]) {
      case "correct":
        return "#00aa0055";
      case "incorrect":
        return "#aa000055";
      case "missing":
        return "#aaaa0055";
    }
  }

  return currentUserSelection.filter(
    (lineHighlight) =>
      lineHighlight.filePath === filePath &&
      lineHighlight.lineNumber === lineNumber
  ).length > 0
    ? "rgba(0,0,255,0.33)"
    : "rgba(255,255,255,0)";
};

export default function CodeOverlayLine(props: {
  lineNumber: number;
  filePath: string;
  stateProps: {
    currentUserSelection: LineHighlight[];
    userSelectionSetter: Dispatch<SetStateAction<LineHighlight[]>>;
    pathToLineToTagMap: PathToLineToTagMap;
    currentMaxNumberWidth: number;
    maxNumberWidthSetter: Dispatch<SetStateAction<number>>;
  };
  pathToLineToAnswerStateMap: PathToLineToAnswerStateMap;
}) {
  const {
    lineNumber,
    filePath,
    stateProps: {
      currentUserSelection: currentUserSelection,
      userSelectionSetter: userSelectionSetter,
      pathToLineToTagMap,
      currentMaxNumberWidth,
    },
    pathToLineToAnswerStateMap,
  } = props;

  const initialHighlightState =
    currentUserSelection.filter(
      (lineHighlight) =>
        lineHighlight.filePath === filePath &&
        lineHighlight.lineNumber === lineNumber
    ).length > 0;
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
      bg={conditionalLineBackground(
        currentUserSelection,
        pathToLineToAnswerStateMap,
        filePath,
        lineNumber
      )}
      onClick={() => {
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
