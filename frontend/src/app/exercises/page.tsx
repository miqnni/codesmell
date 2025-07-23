"use client"

import { ButtonGroup, IconButton, Pagination, Center, Stack, Flex, Heading, Text, Link } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import SingleExerciseBox from "@/components/features/exercise-list/SingleExerciseBox";
// import listJSON from "./mock-exercises.json"
import { useState, useEffect, useCallback } from "react";

interface Quiz {
  quizId: number,
  quizName: string
}

interface QuizArray extends Array<Quiz> {
  quizzes: Quiz[]
}

export default function Page() {

  const [data, setData] = useState<QuizArray>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getData = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(`http://localhost:8080/api/quiz/short-list`, { signal });
        const resJson = await res.json();
        // console.log(resJson)
        setData(resJson);
      } catch (e) {
        setIsError(true);
        if (typeof e === "string") setError(e);
        else if (e instanceof Error) setError(e.message);
        else setError("Error");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    getData(controller.signal);
    return () => controller.abort();
  }, [getData]);

  const pageSize = 10
  // console.log(data?.length)

  const count = data ? data.length : 0
  // console.log(count)

  const [page, setPage] = useState(1)
  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize
  const visibleItems = data ? data.slice(startRange, endRange) : []

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
          <Link my={2} p={0} key={quizId} href={`/exercises/${quizId}`}>
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