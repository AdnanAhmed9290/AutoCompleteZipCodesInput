import React, { ChangeEvent, useCallback, useState } from "react";
import classnames from "classnames";

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
  const [zipCode, setZipCode] = useState<string>();
  const [suggestionsList, setSuggestionsList] = useState<CityZipCode[]>([]);

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

  const processInput = debounce(async (zipCode: string) => {
    const errorMessage = validateUsZipCode(zipCode);

    setError(errorMessage);

    if (zipCode === "") {
      setSuggestionsList([]);
    } else {
      const list = await loadSuggestions(zipCode);
      setSuggestionsList(list);
    }
  }, 700);

  // handle Input field change
  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const zipCode = event.target.value.trim();
    setZipCode(event.target.value);

    processInput(zipCode);
  };

  const selectZipCode = (code: string) => {
    setZipCode(code);
    setSuggestionsList([]);
    setError(undefined);
  };

  return (
    <div className="autocomplete-input">
      <h4 className="title">US ZipCodes Input with AutoComplete</h4>
      <input
        type="text"
        value={zipCode}
        onChange={handleChangeInput}
        placeholder={placeholder}
        className={classnames({
          "has-error": error
        })}
      />
      {error && <p className="error">{error}</p>}
      {showSuggestions && suggestionsList.length > 1 && (
        <SuggestionList
          suggestions={suggestionsList}
          selectedZipCode={zipCode}
          handleItemClick={selectZipCode}
        />
      )}
    </div>
  );
};

export default AutoCompleteInput;
