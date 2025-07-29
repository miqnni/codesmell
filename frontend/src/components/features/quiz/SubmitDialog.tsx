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

export default function SubmitDialog(props: {
  finalAnswer: FinalAnswer;
  onClick: VoidFunction;
}) {
  const { finalAnswer, onClick } = props;
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button onClick={onClick} variant="solid" size="sm" mt={4}>
          Submit
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
