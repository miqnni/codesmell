"use client"
// import { useState } from "react"


import { TreeCollection, TreeView, createTreeCollection } from "@chakra-ui/react"
import { Dispatch, SetStateAction } from "react"
import { LuFile, LuFolder } from "react-icons/lu"

interface Node {
  id: string
  name: string
  children?: Node[]
}

export default function FileTree(props : { collection: TreeCollection<Node>, stateSetter: Dispatch<SetStateAction<string>> }) {
  const { collection, stateSetter } = props

  // const [fileContent, setFileContent] = useState("(no file selected)")
  
  const nodeNameFontSize: string | number = "lg";

  return (
    <TreeView.Root collection={collection}>
      <TreeView.Label fontSize={nodeNameFontSize} pb={2} borderBottom="1px solid #EFF1F3">Quiz Name</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node
          indentGuide={<TreeView.BranchIndentGuide />}
          render={({ node, nodeState }) =>
            nodeState.isBranch ? (
              <TreeView.BranchControl>
                <LuFolder />
                <TreeView.BranchText fontSize={nodeNameFontSize}>{node.name}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item onClick={() => stateSetter(node.id)}>
                <LuFile />
                <TreeView.ItemText fontSize={nodeNameFontSize}>{node.name}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  )
}
