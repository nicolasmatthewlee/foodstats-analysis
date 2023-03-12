import { FoodInterface } from "../interfaces/food-interface";
import { GraphMacros } from "./graph-macros";

interface Props {
  data: FoodInterface;
}

export const Graphs = ({
  data: { dataType, fdcId, description, foodNutrients, publishedDate },
}: Props) => {
  return (
    <div className="p-[30px] space-y-[30px]">
      <p>
        {description} | {fdcId} | {dataType} | {publishedDate}
      </p>
      <div className="flex space-x-[30px]">
        <GraphMacros nutrients={foodNutrients} />
        <GraphMacros nutrients={foodNutrients} />
      </div>
    </div>
  );
};
