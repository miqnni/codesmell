"use client";

import { Box } from "@chakra-ui/react";
import { useState } from "react";

export default function VisualErrorTag(props: {
  colour: string;
  errorCode: string;
}) {
  const { colour, errorCode } = props;
  const [displayVal, setDisplayVal] = useState(true);
  return (
    <Box
      rounded="md"
      bg={colour}
      px={1}
      mx={0.5}
      // hidden={!displayVal}
      opacity={displayVal ? 0.99 : 0.01}
      onMouseEnter={() => setDisplayVal(false)}
      onMouseLeave={() => setDisplayVal(true)}
    >
      {errorCode}
    </Box>
  );
}
