import { useState } from "react";
import { Graphs } from "./graphs";
import { FoodInterface } from "../interfaces/food-interface";

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
    <div>
      {selection ? <Graphs data={selection} /> : null}
      <div className="flex">
        <input
          type="text"
          className="border flex-1"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className="border" onClick={searchDatabase}>
          submit
        </button>
      </div>
      {isLoading ? <div>loading...</div> : null}
      <div className="flex flex-col">
        {searchResults.map((e) => (
          <button
            key={e.fdcId}
            className="hover:bg-gray-100 text-left truncate"
            onClick={() => setSelection(e)}
          >
            {e.description}
          </button>
        ))}
      </div>
    </div>
  );
};
