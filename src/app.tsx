import { SearchBar } from "./components/searchbar";
import { Footer } from "./components/footer";
import { Routes, Route } from "react-router-dom";
import { FoodPage } from "./pages/food-page";

function App() {
  return (
    <div>
      <h1 className="text-[40px] text-left pt-[30px] px-[30px]">FoodStat</h1>
      <SearchBar />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/foods/:id" element={<FoodPage />} />
        <Route
          path="*"
          element={<div className="p-[30px] pt-0">page not found</div>}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
