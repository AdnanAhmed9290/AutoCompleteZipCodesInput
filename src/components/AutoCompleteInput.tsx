import React, { ChangeEvent, useCallback, useRef, useState } from "react";

// src
import { debounce, validateUsZipCode } from "./../utils";
import SuggestionList from "./SuggestionsList";
import { CityZipCode } from "../types";

const USZipCodesFileURL =
  "https://raw.githubusercontent.com/millbj92/US-Zip-Codes-JSON/master/USCities.json";

interface AutoCompleteInputProps {
  placeholder?: string;
  showSuggestions?: boolean;
}

const AutoCompleteInput = (props: AutoCompleteInputProps) => {
  const {
    placeholder = "Enter US ZipCode...",
    showSuggestions = false
  } = props;

  const [error, setError] = useState<string>();
  const [suggestionsList, setSuggestionsList] = useState<CityZipCode[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // load zip code suggestions
  const loadSuggestions = useCallback(async (value: string) => {
    const response = await fetch(USZipCodesFileURL);
    const zipCodesList: CityZipCode[] = await response.json();

    const filteredList = zipCodesList.filter(
      (item) =>
        item.zip_code > 10000 &&
        `${item.zip_code}`.indexOf(value.toLowerCase()) > -1
    );

    return filteredList;
  }, []);

  // handle Input field change
  const handleChangeInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const zipCode = event.target.value.trim();
    const errorMessage = validateUsZipCode(zipCode);

    setError(errorMessage);

    if (zipCode === "") {
      setSuggestionsList([]);
    } else {
      const list = await loadSuggestions(zipCode);
      setSuggestionsList(list);
    }
  };

  const processInput = debounce(handleChangeInput, 700);
  const currentZipCode = inputRef.current?.value;

  const selectZipCode = (value: string) => {
    inputRef.current?.value === value;
  };

  return (
    <div className="autocomplete-input">
      <h4 className="title">US ZipCodes Input with AutoComplete</h4>
      <input
        type="text"
        ref={inputRef}
        onChange={processInput}
        placeholder={placeholder}
        className={error && "has-error"}
      />
      {error && <p className="error">{error}</p>}
      {showSuggestions && suggestionsList.length > 1 && (
        <SuggestionList
          suggestions={suggestionsList}
          selectedZipCode={currentZipCode}
          handleItemClick={selectZipCode}
        />
      )}
    </div>
  );
};

export default AutoCompleteInput;
