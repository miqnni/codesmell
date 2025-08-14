import { Input, InputGroup } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { LuSearch } from "react-icons/lu";

export default function SearchBar(props: {
  onTextInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { onTextInputChange } = props;
  return (
    <InputGroup flex="1" startElement={<LuSearch />}>
      <Input
        bg="#000000"
        onChange={onTextInputChange}
        variant="outline"
        placeholder="Search tasks..."
      />
    </InputGroup>
  );
}
