import React from "react";
import { SearchBar } from "./components/searchbar";
import { Footer } from "./components/footer";

function App() {
  return (
    <div>
      <h1 className="text-[40px] text-left pt-[30px] px-[30px]">FoodStat</h1>
      <SearchBar />
      <Footer />
    </div>
  );
}

export default App;
