"use client"

import { Flex, Box, TreeCollection, createTreeCollection } from "@chakra-ui/react"
import FileTree from "@/components/features/quiz/FileTree"
import quizJSON from "./data.json"
import CodeDisplay from "@/components/features/quiz/CodeDisplay"
import { useCallback, useEffect, useState } from "react"

interface Node {
  id: string
  name: string
  children?: Node[]
}

// ASSUMPTION: recentPath ends with "/", parentNode has ID equal to recentPath
function createTreeFromFilePath(recentPath: string, remainingPath: string, parentNode: Node): {newNode: Node, valid: boolean} {
  if (recentPath[recentPath.length - 1] !== "/" || recentPath !== parentNode.id)
    throw new Error("ASSUMPTION: recentPath (" + recentPath + ") ends with \"/\", parentNode has ID (" + parentNode.id + ") equal to recentPath")


  const sepIdx = remainingPath.indexOf("/")
  const isDir = sepIdx !== -1
  const currName = isDir ? remainingPath.slice(0, sepIdx) + "/" : remainingPath
  const currId = recentPath + currName

  // Check if the new path does not already exist in the file tree
  if (parentNode.children !== undefined) {
    for (let child of parentNode.children) {
      if (child.id === currId){
        if (isDir) {
          const nextRemainingPath = remainingPath.slice(sepIdx + 1);

          // If the array `child.children` exists (== true), then there is no change
          // (assign `child.children` to `child.children`).
          // Otherwise, assign an empty array to it.
          child.children = child.children || [];
          const {newNode, valid} = createTreeFromFilePath(currId, nextRemainingPath, child)
          if (valid)
            child.children.push(newNode);
        }
        return {newNode: {id: "", name: ""}, valid: false};
      }
    }
  }
  
  const currNode: Node = {
    id: currId,
    name: currName
  }

  if (isDir) {
    const nextRemainingPath = remainingPath.slice(sepIdx + 1)
    currNode.children = [ createTreeFromFilePath(currId, nextRemainingPath, currNode).newNode ]
  }
  return {newNode: currNode, valid: true}
}

interface Data {
  fileName: string,
  content: string
}

export default function Page(props: { children: React.ReactNode }) {
  const { children } = props

  // Create a root node of the file tree
  const actualCollectionRootNode: Node = {
    id: "/",
    name: "",
    children: [],
  }

  // Add children to the root node using the function `createTreeFromFilePath`
  for (const file of quizJSON) {
    if (actualCollectionRootNode.children){
      const {newNode, valid} = createTreeFromFilePath("/", file.path, actualCollectionRootNode);
      if (valid)
        actualCollectionRootNode.children.push(newNode)
    }
  }

  // Prepare the TreeCollection with the completed root node
  const actualCollection: TreeCollection<Node> = createTreeCollection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: actualCollectionRootNode
  })

  const [ selectedFilePath, setSelectedFilePath ] = useState("(no file path selected)")

  const [data, setData] = useState<Data>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getData = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch("http://localhost:8080/api/quiz/1/file?path=Main.java", { signal });
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

  return (
    <Flex w="100%" h="100%" direction={{base: "column", md: "row"}}>
      <Box bg="#696773" flexBasis="75%" md={{order: 1}} p={4} overflowY="auto">
        {/* TODO: Using the database, turn the selectedFilePath into file content */}
        <CodeDisplay codeContent={isLoading ? 'Loading...' : isError ? error : (data ? data.content : "(file not loaded)")} />
      </Box>
      <Box bg="#505073" p={4} flexBasis="25%" overflowY="auto">
        <FileTree collection={actualCollection} stateSetter={setSelectedFilePath} />
      </Box>
    </Flex>
  )
}
