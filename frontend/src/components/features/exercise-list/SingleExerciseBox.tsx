"use client"

import { Box } from "@chakra-ui/react"
import { useState } from "react"

export default function SingleExerciseBox(props: { exerciseId: string, exerciseName: string, marginY?: string | number }) {
  const { exerciseId, exerciseName } = props
  const [bgColor, setBgColor] = useState("#696773")
  const [textColor, setTextColor] = useState("#EFF1F3")
  return (
    <Box
      my={props.marginY ?? 0}
      px={2}
      py={2}
      bg={bgColor}
      color={textColor}
      rounded="md"
      borderWidth={2}
      borderColor="#EFF1F3"
      onMouseOver={() => { setBgColor("#EFF1F3"); setTextColor("#272727") }}
      onMouseOut={() => { setBgColor("#696773"); setTextColor("#EFF1F3") }}
      w="100%"
    >
      {exerciseId}: {exerciseName}
    </Box>
  )
}