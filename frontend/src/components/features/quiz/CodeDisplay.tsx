import { Code } from "@chakra-ui/react";

import hljs, { Language } from 'highlight.js';
import 'highlight.js/styles/github-dark.css';


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

export default function CodeDisplay(props: {codeContent: string, filePath: string}) {
  const { codeContent, filePath } = props
  let keyIdx = 0;

  const dotIdx: number = filePath.lastIndexOf(".")
  const fileExtension: string = dotIdx !== -1 ?
    (dotIdx !== filePath.length - 1 ? filePath.substring(dotIdx + 1).toLowerCase() : "txt")
    : "txt";
  const languageObj: Language | undefined = hljs.getLanguage(fileExtension)
  const languageToken: string = languageObj ? (languageObj.aliases && languageObj.aliases.length > 0 ? languageObj.aliases[0].toLowerCase() : "txt") : "txt";

  return (
    <Code
      padding={2}
      rounded="md"
      key={keyIdx++}
      display="block"
      whiteSpace="pre"
      backgroundColor="#272727"
      fontSize="md"
      lineHeight={1.75}
      overflow="auto"
      dangerouslySetInnerHTML={{__html: hljs.highlight(codeContent, {language: languageToken}).value}}
    />
  );
}