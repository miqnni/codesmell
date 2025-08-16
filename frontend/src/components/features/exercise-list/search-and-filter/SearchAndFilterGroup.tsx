"use client";

import { Button, ButtonGroup, Group } from "@chakra-ui/react";
import SearchBar from "./SearchBar";

import FullSearchAndFilterQuery from "@/interfaces/FullSearchAndFilterQuery";
import { ChangeEvent, FormEventHandler, useCallback, useEffect, useState } from "react";
import FilterMenu from "./FilterMenu";

import dataDiffucultyJSON from "./data_difficulty.json";

const defaultFullSearchAndFilterQuery: FullSearchAndFilterQuery = {
  query: "",
  languages: [],
  difficulties: [],
};

interface Quiz {
  quizId: number;
  quizName: string;
}

interface QuizArray extends Array<Quiz> {
  quizzes: Quiz[];
}

export default function SearchAndFilterGroup(props: {setSearchData: (response: QuizArray)=>void}) {
  const {setSearchData} = props;

  const [userSearchAndFilterQuery, setUserSearchAndFilterQuery] = useState(
    defaultFullSearchAndFilterQuery
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
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

  const [, setSearchAndFilterResultsError] = useState("");
  const [, setIsSearchAndFilterResultsError] = useState(false);
  const [, setIsSearchAndFilterResultsLoading] = useState(false);

  // Fetch

  const [languagesData, setLanguagesData] = useState<string[]>();
  const [, setLanguagesError] = useState("");
  const [, setIsLanguagesLoading] = useState(false);
  const [, setIsLanguagesError] = useState(false);

  const getLanguagesData = useCallback(async (signal: AbortSignal) => {
    setIsLanguagesLoading(true);
    setIsLanguagesError(false);
    try {
      const res = await fetch(`http://localhost:8080/api/quiz/languages`, {
        signal,
      });
      const resJson = await res.json();
      setLanguagesData(resJson);
    } catch (e) {
      setIsLanguagesError(true);
      if (typeof e === "string") setLanguagesError(e);
      else if (e instanceof Error) setLanguagesError(e.message);
      else setLanguagesError("Error");
    } finally {
      setIsLanguagesLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const controller = new AbortController();
    getLanguagesData(controller.signal);
    return () => controller.abort();
  }, [getLanguagesData]);

  let checkedLanguages : string[]
  if(languagesData){
    checkedLanguages = languagesData
  }else{
    checkedLanguages = ["błąd wczytywania"]
  }

  const postUserSearchAndFilterQuery = useCallback(
    async (
      signal: AbortSignal,
      searchAndFilterQuery: FullSearchAndFilterQuery
    ) => {
      setIsSearchAndFilterResultsLoading(true);
      setIsSearchAndFilterResultsError(false);
      try {
        const res = await fetch(
          `http://localhost:8080/api/quiz/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(searchAndFilterQuery),
          }
        );
        const resJSON = await res.json();
        setSearchData(resJSON);
      } catch (e) {
        setIsSearchAndFilterResultsError(true);
        if (typeof e === "string") setSearchAndFilterResultsError(e);
        else if (e instanceof Error) setSearchAndFilterResultsError(e.message);
        else setSearchAndFilterResultsError("Error");
      } finally {
        setIsSearchAndFilterResultsLoading(false);
      }
    },
    []
  );

  const handleSearch = () => {
    const controller = new AbortController();
    const searchParameters = userSearchAndFilterQuery;
    postUserSearchAndFilterQuery(controller.signal, searchParameters);
    return () => controller.abort();
  };

  return (
    <form onSubmit={onSubmit}>
      <Group attached w="full" maxW="xl" h={8}>
        <SearchBar onTextInputChange={onTextInputChange} />
        {/* size="sm" variant="outline" bg="bg.subtle" rounded="none" */}
        <ButtonGroup bg="bg.subtle" size="md" variant="outline" attached>
          <FilterMenu
            menuName="Languages"
            menuData={checkedLanguages}
            onFilterChange={onLanguageFilterChange}
          />
          <FilterMenu
            menuName="Difficulty"
            menuData={dataDiffucultyJSON}
            onFilterChange={onDifficultyFilterChange}
          />
          <Button type="submit" onClick={handleSearch}>Search</Button>
        </ButtonGroup>
      </Group>
    </form>
  );
}
