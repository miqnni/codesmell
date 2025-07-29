"use client";

import { Box, Flex, Group } from "@chakra-ui/react";
import VisualErrorTag from "./VisualErrorTag";
import { useState } from "react";

export default function VisualErrorTagContainer(props: {
  pathToLineToTagMap: { [key: string]: { [key: number]: Set<string> } };
  filePath: string;
  lineNumber: number;
}) {
  const { pathToLineToTagMap, filePath, lineNumber } = props;

  const [displayVal, setDisplayVal] = useState(true);

  return (
    <Group
      opacity={displayVal ? 1.0 : 0.175}
      onMouseEnter={() => setDisplayVal(false)}
      onMouseLeave={() => setDisplayVal(true)}
      m={0}
      p={0}
      overflow="hidden"
      attached
    >
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
              const errorTagObj = JSON.parse(errorTagStr);
              return (
                <VisualErrorTag
                  key={filePath + ":" + lineNumber + ":" + errorTagObj.code}
                  colour={errorTagObj.colorHex + "99"}
                  errorCode={errorTagObj.code}
                />
              );
            })}
    </Group>
  );
}
