"use client"

import { ButtonGroup, IconButton, Pagination, Center, Stack, Flex } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"


export default function Page() {
  return (
    <main className="p-8">
      <Stack>
        {/* Custom components: GeneralExerciseBox, SingleExerciseBox, ExerciseGroupBox, etc. */}
      </Stack>
      <Flex direction="column" align="center">
        <h1 className="text-3xl font-bold">Exercise List</h1>
        <p className="mt-4 text-gray-400">
          TODO
        </p>
        <Pagination.Root count={20} pageSize={2} defaultPage={1}>
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
      </Flex>
    </main>
  );
}