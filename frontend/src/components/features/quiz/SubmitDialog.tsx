"use client";

import ErrorTag from "@/interfaces/ErrorTag";
import FinalAnswer from "@/interfaces/FinalAnswer";
import PathToLineToTagMap from "@/interfaces/PathToLineToTagMap";
import SubmissionResults from "@/interfaces/SubmissionResults";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

// TODO - move the results feedback to a separate component

// ***********************************************************

export default function SubmitDialog(props: {
  exerciseId: string;
  pathToLineToTagMap: PathToLineToTagMap;
  submissionResults: SubmissionResults | undefined;
  onAnswerSubmit: (nextSubmissionResults: SubmissionResults) => void;
  isAnswerSubmitted: boolean;
}) {
  const {
    exerciseId,
    pathToLineToTagMap,
    submissionResults,
    onAnswerSubmit,
    isAnswerSubmitted,
  } = props;
  const defaultFinalAnswer = {
    username: "(Username not fetched)",
    quizId: exerciseId,
    answers: new Array<{
      filePath: string;
      lineNumber: string;
      errorTag: string;
    }>(),
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<FinalAnswer>({
    ...defaultFinalAnswer,
  });

  // ********* FETCH STATE VARIABLES *********

  // * getUsername state variables
  const [usernameData, setUsernameData] = useState<string>("(no username)");
  const [, setUsernameError] = useState("");
  const [, setIsUsernameLoading] = useState(false);
  const [, setIsUsernameError] = useState(false);

  // * postFinalAnswer state variables

  const [, setSubmissionResultsError] = useState("");
  const [, setIsSubmissionResultsLoading] = useState(false);
  const [, setIsSubmissionResultsError] = useState(false);

  // ********* (end fetch state variables) *********

  // ********* USERNAME FETCH *********

  const getUsernameData = useCallback(
      async (signal: AbortSignal) => {
        setIsUsernameLoading(true);
        setIsUsernameError(false);
        try {
          const token = localStorage.getItem("token")
          const res = await fetch(`http://localhost:8080/api/users/giveMeMyName`, {
            method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
           });
          if (res.ok){
            setIsLoggedIn(true)
            const restext = await res.text();
            setUsernameData(restext);
          }
        } catch (e) {
          setIsLoggedIn(false)
          setIsUsernameError(true);
          if (typeof e === "string") setUsernameError(e);
          else if (e instanceof Error) setUsernameError(e.message);
          else setUsernameError("Error");
        } finally {
          setIsUsernameLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    const controller = new AbortController();
    getUsernameData(controller.signal);
    return () => controller.abort();
  }, [getUsernameData]);

  // ********* (end username fetch) *********

  // ********* FINAL ANSWER / SUBMISSION RESULTS POST FETCH *********

  const postFinalAnswer = useCallback(
    async (signal: AbortSignal, answerToPost: FinalAnswer) => {
      setIsSubmissionResultsLoading(true);
      setIsSubmissionResultsError(false);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/result/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(answerToPost),
        });
        const resJSON = await res.json();
        onAnswerSubmit(resJSON);
      } catch (e) {
        setIsSubmissionResultsError(true);
        if (typeof e === "string") setSubmissionResultsError(e);
        else if (e instanceof Error) setSubmissionResultsError(e.message);
        else setSubmissionResultsError("Error");
      } finally {
        setIsSubmissionResultsLoading(false);
      }
    },
    [onAnswerSubmit]
  );

  // useEffect(() => {
  //   const controller = new AbortController();
  //   postFinalAnswer(controller.signal);
  //   return () => controller.abort();
  // }, [postFinalAnswer]);

  // ********* (end final answer / submission results post fetch) *********

  const usernameDataChecked = usernameData || "(UNKNOWN)";

  const createFinalAnswer = () => {
    const nextFinalAnswer: FinalAnswer = {
      username: usernameDataChecked,
      quizId: exerciseId,
      answers: new Array<ErrorTag>(),
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

    return nextFinalAnswer;
  };

  const [openResult, setOpenResult] = useState(false);

  const handleSubmit = () => {
    const controller = new AbortController();
    const answer = createFinalAnswer();
    setFinalAnswer(answer);
    postFinalAnswer(controller.signal, answer);
    setOpenResult(true);
    return () => controller.abort();
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button
            onClick={() => setFinalAnswer(createFinalAnswer())}
            variant="solid"
            size="sm"
            mt={4}
            disabled={!isLoggedIn}
            hidden={isAnswerSubmitted}
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
                  Your answer applies to <strong>all</strong> the files, not
                  only to the one that is being viewed right now.
                </Text>
                {/* <Box my={4} maxH="50vh" overflowY="auto">
                  <pre>
                    <code>{JSON.stringify(finalAnswer, null, 2)}</code>
                  </pre>
                </Box> */}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button onClick={handleSubmit}>Submit</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Dialog.Root
        open={openResult}
        onOpenChange={({ open }) => setOpenResult(open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Result</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>Score: {submissionResults?.score}</Text>
                <Text>Percentage: {submissionResults?.scorePercent}%</Text>
                <Box my={4} maxH="50vh" overflowY="auto">
                  <pre>
                    <code>{JSON.stringify(submissionResults, null, 2)}</code>
                  </pre>
                </Box>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">OK</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Button
        variant="solid"
        onClick={() => {
          setOpenResult(true);
        }}
        hidden={!isAnswerSubmitted}
      >
        Result
      </Button>
    </>
  );
}
