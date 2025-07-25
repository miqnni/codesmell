"use client"

import { Flex, Box, TreeCollection, createTreeCollection, Text, Button } from "@chakra-ui/react"
import FileTree from "@/components/features/quiz/FileTree"
import CodeDisplay from "@/components/features/quiz/CodeDisplay"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import LineHighlight from "@/interfaces/LineHighlight"

interface Node {
  id: string
  name: string
  children?: Node[]
}

interface Tree {
  quizName: string,
  quizId: Number,
  codeFilePaths: string[],
}

interface Data {
  fileName: string,
  content: string
}


// ASSUMPTION: recentPath ends with "/", parentNode has ID equal to recentPath
function createTreeFromFilePath(recentPath: string, remainingPath: string, parentNode: Node): { newNode: Node, valid: boolean } {
  if (recentPath[recentPath.length - 1] !== "/" || recentPath !== parentNode.id)
    throw new Error("ASSUMPTION: recentPath (" + recentPath + ") ends with \"/\", parentNode has ID (" + parentNode.id + ") equal to recentPath")


  const sepIdx = remainingPath.indexOf("/")
  const isDir = sepIdx !== -1
  const currName = isDir ? remainingPath.slice(0, sepIdx) + "/" : remainingPath
  const currId = recentPath + currName

  // Check if the new path does not already exist in the file tree
  if (parentNode.children !== undefined) {
    for (let child of parentNode.children) {
      if (child.id === currId) {
        if (isDir) {
          const nextRemainingPath = remainingPath.slice(sepIdx + 1);

          // If the array `child.children` exists (== true), then there is no change
          // (assign `child.children` to `child.children`).
          // Otherwise, assign an empty array to it.
          child.children = child.children || [];
          const { newNode, valid } = createTreeFromFilePath(currId, nextRemainingPath, child)
          if (valid)
            child.children.push(newNode);
        }
        return { newNode: { id: "", name: "" }, valid: false };
      }
    }
  }

  const currNode: Node = {
    id: currId,
    name: currName
  }

  if (isDir) {
    const nextRemainingPath = remainingPath.slice(sepIdx + 1)
    currNode.children = [createTreeFromFilePath(currId, nextRemainingPath, currNode).newNode]
  }
  return { newNode: currNode, valid: true }
}



export default function Page(props: { children: React.ReactNode }) {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const numericexerciseId = Number(exerciseId)
  let quizName : string = ""

  const { children } = props

  const [treeData, setTreeData] = useState<Tree>();
  const [tError, setTError] = useState('');
  const [isTLoading, setIsTLoading] = useState(false);
  const [isTError, setIsTError] = useState(false);

  const getTreeData = useCallback(
    async (signal: AbortSignal) => {
      setIsTLoading(true);
      setIsTError(false);
      try {
        const res = await fetch(`http://localhost:8080/api/quiz/${numericexerciseId}/info`, { signal });
        const resJson = await res.json();
        setTreeData(resJson);
      } catch (e) {
        setIsTError(true);
        if (typeof e === "string") setTError(e);
        else if (e instanceof Error) setTError(e.message);
        else setTError("Error");
      } finally {
        setIsTLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    getTreeData(controller.signal);
    return () => controller.abort();
  }, [getTreeData]);

  // Create a root node of the file tree
  const actualCollectionRootNode: Node = {
    id: "/",
    name: "",
    children: [],
  }

  // Add children to the root node using the function `createTreeFromFilePath`
  if (treeData) {
    quizName=treeData.quizName
    for (const file of treeData.codeFilePaths) {
      if (actualCollectionRootNode.children) {
        const { newNode, valid } = createTreeFromFilePath("/", file, actualCollectionRootNode);
        if (valid)
          actualCollectionRootNode.children.push(newNode)
      }
    }
  }
  // Prepare the TreeCollection with the completed root node
  const actualCollection: TreeCollection<Node> = createTreeCollection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: actualCollectionRootNode
  })

  const [selectedFilePath, setSelectedFilePath] = useState("")

  const [data, setData] = useState<Data>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getData = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (selectedFilePath.length === 0 || selectedFilePath[0] !== '/') {
          setData({ fileName: "", content: "(no file selected)" })
          return;
        }
        const res = await fetch(`http://localhost:8080/api/quiz/${numericexerciseId}/file?path=${selectedFilePath}`, { signal });
        const resJson = await res.json();
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
    [selectedFilePath]
  );

  useEffect(() => {
    const controller = new AbortController();
    getData(controller.signal);
    return () => controller.abort();
  }, [getData]);

  const emptyLineHighlightArray: LineHighlight[] = []
  const [userAnswer, setUserAnswer] = useState(emptyLineHighlightArray)

  return (
    <Flex w="100%" minH="85dvh" h="100%" direction={{ base: "column", md: "row" }}>
      <Box bg="#696773" flexBasis="75%" md={{ order: 1 }} p={4} overflowY="auto">
        <CodeDisplay
          codeContent={isLoading ? 'Loading...' : isError ? error : (data ? data.content : "(file not loaded)")}
          filePath={selectedFilePath}
          currentUserAnswer={userAnswer}
          userAnswerSetter={setUserAnswer}
        />
        <Button onClick={() => { console.log(userAnswer) }}> <Text>Console log user answer</Text> </Button>
      </Box>
      <Box bg="#505073" p={4} flexBasis="25%" overflowY="auto">
        <FileTree collection={actualCollection} stateSetter={setSelectedFilePath} quizName={quizName} />
      </Box>
    </Flex>
  )
}
