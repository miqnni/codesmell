"use client"

import { Flex, Box, TreeCollection, createTreeCollection } from "@chakra-ui/react"
import FileTree from "@/components/features/quiz/FileTree"
import quizJSON from "./sample-quiz/data.json"

interface Node {
  id: string
  name: string
  children?: Node[]
}

// ASSUMPTION: recentPath ends with "/", parentNode has ID equal to recentPath
function createTreeFromFilePath(recentPath: string, remainingPath: string, parentNode: Node): {newNode: Node, valid: boolean} {
  const sepIdx = remainingPath.indexOf("/")
  const isDir = sepIdx !== -1
  const currName = isDir ? remainingPath.slice(0, sepIdx) + "/" : remainingPath
  const currId = recentPath + currName

  //console.log(structuredClone({currId, parentNode}))

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

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props

  const actualCollectionRootNode: Node = {
    id: "/",
    name: "",
    children: [],
  }

  for (const file of quizJSON) {
    if (actualCollectionRootNode.children){
      const {newNode, valid} = createTreeFromFilePath("/", file.path, actualCollectionRootNode);
      if (valid)
        actualCollectionRootNode.children.push(newNode)
    }
  }

  const actualCollection: TreeCollection<Node> = createTreeCollection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: actualCollectionRootNode
  })

  return (
    <Flex w="100%" h="100%" direction={{base: "column", md: "row"}}>
      <Box bg="#696773" flexBasis="75%" md={{order: 1}} p={4} overflowY="auto">
        {/* <Box bg="linear-gradient(#e66465, #9198e5)" h="190dvh">Code</Box> */}
        { children }
      </Box>
      <Box bg="#505073" p={4} flexBasis="25%" overflowY="auto">
        <FileTree collection={actualCollection} />
        {/* <Box bg="linear-gradient(#e66465, #9198e5)" h="190dvh">Code</Box> */}

      </Box>
    </Flex>
  )
}
