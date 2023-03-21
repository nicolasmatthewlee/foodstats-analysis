import { SearchBar } from "./components/searchbar";
import { Footer } from "./components/footer";
import { useState } from "react";
import { FoodInterface } from "./interfaces/food-interface";
import { Visualizations } from "./components/visualizations";
import { Routes, Route, useParams } from "react-router-dom";
import { FoodPage } from "./pages/food-page";

function App() {
  const [data, setData] = useState<FoodInterface | null>(null);

  return (
    <div>
      <h1 className="text-[40px] text-left pt-[30px] px-[30px]">FoodStat</h1>
      <SearchBar setData={setData} />
      <Routes>
        <Route path="/foods/:id" element={<FoodPage />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
