"use client"
import { useState } from "react"


import { TreeCollection, TreeView, createTreeCollection } from "@chakra-ui/react"
import { LuFile, LuFolder } from "react-icons/lu"

interface Node {
  id: string
  name: string
  children?: Node[]
}

export default function FileTree(props : { collection: TreeCollection<Node> }) {
  const { collection } = props

  const [fileContent, setFileContent] = useState("(no file selected)")
  
  return (
    <TreeView.Root collection={collection} maxW="sm">
      <TreeView.Label>Tree</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node
          indentGuide={<TreeView.BranchIndentGuide />}
          render={({ node, nodeState }) =>
            nodeState.isBranch ? (
              <TreeView.BranchControl>
                <LuFolder />
                <TreeView.BranchText>{node.name}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item>
                <LuFile />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  )
}



