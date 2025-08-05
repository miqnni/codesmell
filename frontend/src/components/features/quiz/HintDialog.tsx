import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

interface Hint{
    content: string
}

export default function HintDialog(props:{exerciseId:string}){
    const {
        exerciseId
    } = props

    const [hintData, setHintData] = useState<Hint>();
    const [, setHintError] = useState("");
    const [, setIsHintLoading] = useState(false);
    const [, setIsHintError] = useState(false);

    const getHintData = useCallback(async (signal: AbortSignal) => {
        setIsHintLoading(true);
        setIsHintError(false);
        try {
          const res = await fetch(
              `http://localhost:8080/api/quiz/${exerciseId}/file?path=Hints.txt`,
              { signal }
          );
          const resJSON = await res.json();
          setHintData(resJSON);
        } catch (e) {
          setIsHintError(true);
          if (typeof e === "string") setHintError(e);
          else if (e instanceof Error) setHintError(e.message);
          else setHintError("Error");
        } finally {
          setIsHintLoading(false);
        }
      }, []);
    
      useEffect(() => {
        const controller = new AbortController();
        getHintData(controller.signal);
        return () => controller.abort();
      }, [getHintData]);

    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button
                disabled={!hintData}
                >Hint</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Hint</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>
                                {hintData ? hintData.content : "Brak podpowiedzi"}
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Close</Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}