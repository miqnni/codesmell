import { Box, Button, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

interface Completed{
    completed: boolean
    quizId: number
    quizName: string
    scorePercent: number
}

export default function DoneTaskList(){
    const [taskListData, setTaskListData] = useState<Completed[]>();
    const [taskListError, setTaskListError] = useState("");
    const [isTaskListLoading, setIsTaskListLoading] = useState(false);
    const [isTaskListError, setIsTaskListError] = useState(false);

    const getTaskListData = useCallback(async (signal: AbortSignal) => {
        setIsTaskListLoading(true);
        setIsTaskListError(false);
        try {
          const token = localStorage.getItem("token")
          if (!token) return;
          const res = await fetch(
            `http://localhost:8080/api/progress/full`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
           }
          );
          const resJson = await res.json();
          setTaskListData(resJson);
        } catch (e) {
          setIsTaskListError(true);
          if (typeof e === "string") setTaskListError(e);
          else if (e instanceof Error) setTaskListError(e.message);
          else setTaskListError("Error");
        } finally {
          setIsTaskListLoading(false);
        }
      }, []);
    
      useEffect(() => {
        const controller = new AbortController();
        getTaskListData(controller.signal);
        return () => controller.abort();
      }, [getTaskListData]);


  return (
    <Box mt={4} w="100%">
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        Twoje zadania:
      </Text>

      {isTaskListLoading ? (
        <Text color="gray.500">Ładowanie...</Text>
      ) : isTaskListError ? (
        <Text color="red.500">Wystąpił problem z ładowaniem listy</Text>
      ) : taskListData && taskListData.length > 0 ? (
        taskListData.slice().reverse().map((task) => (
          <Box key={task.quizId}>
            <Text>{task.quizName}: {task.scorePercent}%</Text>
          </Box>
        ))
      ) : (
        <Text color="gray.500">(Brak zadań)</Text>
      )}
    </Box>
  );
};