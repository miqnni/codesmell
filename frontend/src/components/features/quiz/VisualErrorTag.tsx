import { Box } from "@chakra-ui/react";

export default function VisualErrorTag(props: {
  colour: string;
  errorCode: string;
}) {
  const { colour, errorCode } = props;
  return (
    <Box
      rounded="md"
      bg={colour}
      px={1}
      mx={0.5}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="clip"
    >
      {errorCode}
    </Box>
  );
}
