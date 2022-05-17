import classnames from "classnames";
import React from "react";

// src
import { CityZipCode } from "../types";

interface SuggestionListProps {
  suggestions: CityZipCode[];
  selectedZipCode?: string;
  handleItemClick?: (_: string) => void;
}

const SuggestionList = ({
  suggestions,
  selectedZipCode,
  handleItemClick = () => {}
}: SuggestionListProps) => {
  return (
    <ul className="suggestions-container">
      {suggestions.map((item) => (
        <li
          onClick={() => handleItemClick(`${item.zip_code}`)}
          key={item.zip_code}
          className={classnames({
            "suggestion-item": true,
            selected: `${item.zip_code}` === selectedZipCode
          })}
        >
          {item.zip_code} - {item.city} / {item.state}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
