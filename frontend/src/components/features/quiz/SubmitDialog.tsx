"use client";

import FinalAnswer from "@/interfaces/FinalAnswer";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

// ***********************************************************

export default function SubmitDialog(props: {
  exerciseId: string;
  pathToLineToTagMap: PathToLineToTagMap;
}) {
  const { exerciseId, pathToLineToTagMap } = props;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<FinalAnswer>({
    username: "(Username not fetched)",
    quizId: exerciseId,
    answers: new Array<{
      filePath: string;
      lineNumber: string;
      errorTag: string;
    }>(),
  });

  // * getUsername state variables
  const [usernameData, setUsernameData] = useState<string>("(no username)");
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameLoading, setIsUsernameLoading] = useState(false);
  const [isUsernameError, setIsUsernameError] = useState(false);

  // ********* USERNAME FETCH *********

  const getUsernameData = useCallback(async (signal: AbortSignal) => {
    setIsUsernameLoading(true);
    setIsUsernameError(false);
    try {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
      if (token) {
        const res = await fetch(
          `http://localhost:8080/api/users/giveMeMyName?token=${token}`,
          { signal }
        );
        const resText = await res.text();
        setUsernameData(resText);
      }
    } catch (e) {
      setIsUsernameError(true);
      if (typeof e === "string") setUsernameError(e);
      else if (e instanceof Error) setUsernameError(e.message);
      else setUsernameError("Error");
    } finally {
      setIsUsernameLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getUsernameData(controller.signal);
    return () => controller.abort();
  }, [getUsernameData]);

  // ********* (end username fetch) *********

  const usernameDataChecked = usernameData || "(UNKNOWN)";

  const handleClick = () => {
    const nextFinalAnswer: FinalAnswer = {
      username: usernameDataChecked,
      quizId: exerciseId,
      answers: new Array<{
        filePath: string;
        lineNumber: string;
        errorTag: string;
      }>(),
    };

    for (const [path, lineToTagMap] of Object.entries(pathToLineToTagMap)) {
      for (const [lineNumber, errorTagSet] of Object.entries(lineToTagMap)) {
        const errorTagStrs = [...errorTagSet];
        const errorTagObjs = errorTagStrs.map((elStr) => JSON.parse(elStr));
        for (const errorTagObj of errorTagObjs) {
          nextFinalAnswer.answers.push({
            filePath: path,
            lineNumber: lineNumber,
            errorTag: errorTagObj.code,
          });
        }
      }
    }

    setFinalAnswer(nextFinalAnswer);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          onClick={handleClick}
          variant="solid"
          size="sm"
          mt={4}
          disabled={!isLoggedIn}
        >
          {isLoggedIn ? <Text>Submit</Text> : <Text>Log in to submit</Text>}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Are you sure?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                You will not be able to change your answer after submitting.
                Your answer applies to <strong>all</strong> the files, not only
                to the one that is being viewed right now.
              </Text>
              <Box my={4} maxH="50vh" overflowY="auto">
                <pre>
                  <code>{JSON.stringify(finalAnswer, null, 2)}</code>
                </pre>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Submit</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
