"use client"

import { ButtonGroup, IconButton, Pagination, Center, Stack, Flex, Heading, Text, Link } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import SingleExerciseBox from "@/components/features/exercise-list/SingleExerciseBox";
import listJSON from "./mock-exercises.json"
import { useState } from "react";

export default function Page() {
  const pageSize = 10
  const count = listJSON.length

  const [page, setPage] = useState(1)
  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize
  const visibleItems = listJSON.slice(startRange, endRange)

  return (
    <Flex direction="column" align="center" >

      {/* Heading and description */}
      <Heading as="h1" size="3xl">Exercise List</Heading>
      <Text as="p" mt={2} color="#C9C7C3">
        Select a CodeSmell exercise
      </Text>

      {/* Exercises */}
      <Stack w="100%" my={4}>
        {/* Custom components: GeneralExerciseBox, SingleExerciseBox, ExerciseGroupBox, etc. */}
        {visibleItems.map(({ quizId, quizName }) => (
          <Link my={2} p={0} key={quizId} href={`/exercises/${quizName}`}>
            <SingleExerciseBox key={quizId} exerciseId={String(quizId)} exerciseName={quizName} />
          </Link>
        ))}
      </Stack>

      {/* Pagination */}
      <Pagination.Root
        count={count}
        pageSize={pageSize}
        // defaultPage={1}
        page={page}
        onPageChange={(e) => setPage(e.page)}
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "solid" }}>
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Flex >
  );
}