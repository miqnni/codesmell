"use client";

import { Button, Group } from "@chakra-ui/react";
import SearchBar from "./SearchBar";

import FullSearchAndFilterQuery from "@/interfaces/FullSearchAndFilterQuery";
import { ChangeEvent, FormEventHandler, useState } from "react";
import FilterMenu from "./FilterMenu";

const defaultFullSearchAndFilterQuery: FullSearchAndFilterQuery = {
  query: "",
  languages: [],
  difficulties: [],
};

export default function SearchAndFilterGroup() {
  const [userSearchAndFilterQuery, setUserSearchAndFilterQuery] = useState(
    defaultFullSearchAndFilterQuery
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = () => {
    console.log("submit console log");
    console.log(userSearchAndFilterQuery);
  };

  const onTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextUserSearchAndFilterQuery = {
      ...userSearchAndFilterQuery,
      query: e.currentTarget.value,
    };
    console.log(nextUserSearchAndFilterQuery);
    setUserSearchAndFilterQuery(nextUserSearchAndFilterQuery);
  };

  const onLanguageFilterChange = () => {
    console.log("TODO: onLanguageFilterChange");
  };

  const onDifficultyFilterChange = () => {
    console.log("TODO: onDifficultyFilterChange");
  };

  // TODO: in SearchBar change the onSubmit method so that it sets the state to e.target.value
  return (
    <form onSubmit={onSubmit}>
      <Group attached w="full" maxW="sm" h={8}>
        <SearchBar onTextInputChange={onTextInputChange} />
        <FilterMenu />
        <Button bg="bg.subtle" variant="outline" type="submit">
          Search
        </Button>
      </Group>
    </form>
  );
}
