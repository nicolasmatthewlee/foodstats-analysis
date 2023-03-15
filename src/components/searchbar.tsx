import { useState } from "react";
import { Graphs } from "./graphs";
import { FoodInterface } from "../interfaces/food-interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState<String>("");
  const [searchResults, setSearchResults] = useState<FoodInterface[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [selection, setSelection] = useState<FoodInterface | null>(null);

  const searchDatabase = async () => {
    setSearchResults([]);
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.REACT_APP_KEY}&query=${searchValue}`
      );
      const json = await response.json();

      if (json.foods) setSearchResults(json.foods);

      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-[30px]">
      {selection ? <Graphs data={selection} /> : null}
      <div>
        <form className="flex border-2">
          <div className="flex items-center">
            <FontAwesomeIcon
              className="text-gray-400 pl-[10px] absolute"
              icon={faMagnifyingGlass}
            ></FontAwesomeIcon>
          </div>
          <input
            type="text"
            className="flex-1 py-[3px] pl-[35px] pr-10px"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="search..."
          />
          <button
            className="px-[10px] hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              searchDatabase();
            }}
          >
            <FontAwesomeIcon
              className="text-gray-400"
              icon={faLongArrowAltRight}
            ></FontAwesomeIcon>
          </button>
        </form>
        {isLoading ? <div>loading...</div> : null}
        {searchResults.length > 0 ? (
          <div className="flex flex-col border-2 border-t-0">
            {searchResults.map((e, i) => (
              <button
                key={e.fdcId}
                className={
                  "text-left truncate px-[10px] py-[2px] focus:z-10 focus:bg-amber-200 focus:outline-none hover:bg-amber-200" +
                  (i % 2 === 0 ? " bg-gray-100 " : "")
                }
                onClick={() => setSelection(e)}
              >
                {e.description}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
