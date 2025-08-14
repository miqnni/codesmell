"use client";

import { Button, ButtonGroup, Group } from "@chakra-ui/react";
import SearchBar from "./SearchBar";

import FullSearchAndFilterQuery from "@/interfaces/FullSearchAndFilterQuery";
import { ChangeEvent, FormEventHandler, useState } from "react";
import FilterMenu from "./FilterMenu";

import dataLanguagesJSON from "./data_languages.json";
import dataDiffucultyJSON from "./data_difficulty.json";

const defaultFullSearchAndFilterQuery: FullSearchAndFilterQuery = {
  query: "",
  languages: [],
  difficulties: [],
};

export default function SearchAndFilterGroup() {
  const [userSearchAndFilterQuery, setUserSearchAndFilterQuery] = useState(
    defaultFullSearchAndFilterQuery
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    console.log("submit console log");
    console.log(userSearchAndFilterQuery);
    e.preventDefault();
  };

  const onTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextUserSearchAndFilterQuery = {
      ...userSearchAndFilterQuery,
      query: e.currentTarget.value,
    };
    setUserSearchAndFilterQuery(nextUserSearchAndFilterQuery);
  };

  const onLanguageFilterChange = (currentGroup: string[]) => {
    const nextUserSearchAndFilterQuery = {
      ...userSearchAndFilterQuery,
      languages: currentGroup,
    };
    setUserSearchAndFilterQuery(nextUserSearchAndFilterQuery);
  };

  const onDifficultyFilterChange = (currentGroup: string[]) => {
    const nextUserSearchAndFilterQuery = {
      ...userSearchAndFilterQuery,
      difficulties: currentGroup.map((el) => Number(el)),
    };
    setUserSearchAndFilterQuery(nextUserSearchAndFilterQuery);
  };

  return (
    <form onSubmit={onSubmit}>
      <Group attached w="full" maxW="xl" h={8}>
        <SearchBar onTextInputChange={onTextInputChange} />
        {/* size="sm" variant="outline" bg="bg.subtle" rounded="none" */}
        <ButtonGroup bg="bg.subtle" size="md" variant="outline" attached>
          <FilterMenu
            menuName="Languages"
            menuData={dataLanguagesJSON}
            onFilterChange={onLanguageFilterChange}
          />
          <FilterMenu
            menuName="Difficulty"
            menuData={dataDiffucultyJSON}
            onFilterChange={onDifficultyFilterChange}
          />
          <Button type="submit">Search</Button>
        </ButtonGroup>
      </Group>
    </form>
  );
}
