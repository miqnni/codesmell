import { Button, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

interface Completed{
    completedCount : number
    totalCount : number
}

export default function TaskStats(){
    const [taskCountData, setTaskCountData] = useState<Completed>(
        {
            completedCount: 0,
            totalCount: 0
        }
    );
    const [taskCountError, setTaskCountError] = useState("");
    const [isTaskCountLoading, setIsTaskCountLoading] = useState(false);
    const [isTaskCountError, setIsTaskCountError] = useState(false);

    const getTaskCountData = useCallback(async (signal: AbortSignal) => {
        setIsTaskCountLoading(true);
        setIsTaskCountError(false);
        try {
          const token = localStorage.getItem("token")
          if (!token) return;
          const res = await fetch(
            `http://localhost:8080/api/progress/summary`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
           }
          );
          const resJson = await res.json();
          setTaskCountData(resJson);
        } catch (e) {
          setIsTaskCountError(true);
          if (typeof e === "string") setTaskCountError(e);
          else if (e instanceof Error) setTaskCountError(e.message);
          else setTaskCountError("Error");
        } finally {
          setIsTaskCountLoading(false);
        }
      }, []);
    
      useEffect(() => {
        const controller = new AbortController();
        getTaskCountData(controller.signal);
        return () => controller.abort();
      }, [getTaskCountData]);


  return (
    <Text fontSize="md" color="gray.600">
          Rozwiązane zadania: {taskCountData.completedCount}{taskCountData.totalCount ? `/${taskCountData.totalCount}` : ""}
    </Text>
  );
};