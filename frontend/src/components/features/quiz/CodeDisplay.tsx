import { Highlight, themes } from "prism-react-renderer";
import { Code } from "@chakra-ui/react";

import quizJSON from "@/app/exercises/(exercise)/sample-quiz/data.json"

// const codeBlock = `
// const GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {
//   return (
//     <div>
//       <h2>{item.name}</h2>
//       <p>Price: {item.price}</p>
//       <p>Quantity: {item.quantity}</p>
//     </div>
//   );
// }
// `

const codeBlock = quizJSON[1].content

export default function CodeDisplay(props: {codeContent: string}) {
  const { codeContent } = props
  let keyIdx = 0;
  return (
    <Highlight
      language="py"
      code={codeContent}
      theme={themes.okaidia}
    >
    {({ style, tokens, getLineProps, getTokenProps }) => (
    <Code
      padding={2}
      rounded="md"
      key={keyIdx++}
      display="block"
      whiteSpace="pre"
      backgroundColor={style.backgroundColor}
      overflow="auto"
    >
      {tokens.map((line, i) => (
        <div key={i} {...getLineProps({ line })}>
          {line.map((token, key) => (
            <span key={key} {...getTokenProps({ token })} />
          ))}
        </div>
      ))}
    </Code>
  )}
    </Highlight>
  );
}