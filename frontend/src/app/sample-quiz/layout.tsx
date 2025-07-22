"use client"

import { Flex, Box, TreeCollection, createTreeCollection } from "@chakra-ui/react"
import FileTree from "@/components/features/quiz/FileTree"
import quizJSON from "./data.json"

interface Node {
  id: string
  name: string
  children?: Node[]
}

// const sampleCollection : TreeCollection<Node> = createTreeCollection<Node>({
//   nodeToValue: (node) => node.id,
//   nodeToString: (node) => node.name,
//   rootNode: {
//     id: "ROOT",
//     name: "",
//     children: [
//       {
//         id: "node_modules",
//         name: "node_modules",
//         children: [
//           { id: "node_modules/zag-js", name: "zag-js" },
//           { id: "node_modules/pandacss", name: "panda" },
//           {
//             id: "node_modules/@types",
//             name: "@types",
//             children: [
//               { id: "node_modules/@types/react", name: "react" },
//               { id: "node_modules/@types/react-dom", name: "react-dom" },
//             ],
//           },
//         ],
//       },
//       {
//         id: "src",
//         name: "src",
//         children: [
//           { id: "src/app.tsx", name: "app.tsx" },
//           { id: "src/index.ts", name: "index.ts" },
//         ],
//       },
//       { id: "panda.config", name: "panda.config.ts" },
//       { id: "package.json", name: "package.json" },
//       { id: "renovate.json", name: "renovate.json" },
//       { id: "readme.md", name: "README.md" },
//     ],
//   },
// })

// ASSUMPTION: recentPath ends with "/", parentNode has ID equal to recentPath
function createTreeFromFilePath(recentPath: string, remainingPath: string, parentNode: Node): Node {
  const clone = structuredClone(parentNode)
  console.log({recentPath, remainingPath, clone})
  
  const sepIdx = remainingPath.indexOf("/")
  const isDir = sepIdx !== -1
  const currName = isDir ? remainingPath.slice(0, sepIdx) + "/" : remainingPath
  const currId = recentPath + currName


  if (parentNode.children !== undefined && parentNode.children.length > 0) {
    for (let child of parentNode.children) {
      if (child.id === currId) {
        console.log("The child " + currId + " exists!")
        return createTreeFromFilePath(currId, remainingPath.slice(sepIdx + 1), child);
      }
    }
  }
  
  const currNode: Node = {
    id: currId,
    name: currName
  }

  if (isDir) {
    const nextRemainingPath = remainingPath.slice(sepIdx + 1)
    if (currNode.children !== undefined){
      console.log("Pushing...")
      currNode.children.push(createTreeFromFilePath(currId, nextRemainingPath, currNode))
    } else {
      console.log("Replacing...")
      currNode.children = [ createTreeFromFilePath(currId, nextRemainingPath, currNode) ]
    }
  }

  return currNode
}

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props

  const actualCollectionRootNode: Node = {
    id: "/",
    name: "",
    children: [],
  }

  for (const file of quizJSON) {
    if (actualCollectionRootNode.children)
      actualCollectionRootNode.children.push(createTreeFromFilePath("/", file.path, actualCollectionRootNode))
  }

  // actualCollectionRootNode.children = quizJSON.map(file => createTreeFromFilePath("/", file.path, actualCollectionRootNode))

  console.log(actualCollectionRootNode)

  const actualCollection: TreeCollection<Node> = createTreeCollection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: actualCollectionRootNode
  })

  // console.log(createTreeFromFilePath("/", "a/b/c/d/w.py"))

  // quizJSON.forEach(file => {
  //   actualCollection.push()
  // })

  return (
    <Flex w="100%" h="100%" direction={{base: "column", md: "row"}}>
      <Box bg="#696773" flexBasis="75%" md={{order: 1}} p={4} overflowY="auto">
        {/* <Box bg="linear-gradient(#e66465, #9198e5)" h="190dvh">Code</Box> */}
        { children }
      </Box>
      <Box bg="#505073" p={4} flexBasis="25%" overflowY="auto">
        <FileTree collection={actualCollection} />
      </Box>
    </Flex>
  )
}
