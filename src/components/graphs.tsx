import { FoodInterface } from "../interfaces/food-interface";
import { BarGraph } from "./bar-graph";
import { BarGraphStacked } from "./bar-graph-stacked";

interface Props {
  data: FoodInterface;
}

export const Graphs = ({
  data: { dataType, fdcId, description, foodNutrients, publishedDate },
}: Props) => {
  const findNutrientByName = (name: string) => {
    for (let i = 0; i < foodNutrients.length; i++) {
      if (foodNutrients[i].nutrientName === name) return foodNutrients[i];
    }
    return { value: null };
  };

  const getDataUnitsLabels = (
    nutrients: string[]
  ): [number[], string[], string[]] => {
    let data: number[] = [];
    let units: string[] = [];
    let labels: string[] = [];

    for (let n of nutrients) {
      const nutrient = findNutrientByName(n);
      if (nutrient.value !== null) {
        const label =
          nutrient.nutrientName === "Carbohydrate, by difference"
            ? "Carbohydrate"
            : nutrient.nutrientName === "Total lipid (fat)"
            ? "Fat"
            : nutrient.nutrientName;
        labels.push(label);
        data.push(nutrient.value);
        units.push(nutrient.unitName);
      }
    }

    return [data, units, labels];
  };

  const macros = [
    "Total lipid (fat)",
    "Carbohydrate, by difference",
    "Water",
    "Protein",
    "Ash",
  ];

  let [macrosData, macrosUnits, macrosLabels] = getDataUnitsLabels(macros);

  return (
    <div className="space-y-[30px] pb-[30px]">
      <p className="truncate">
        {description} | {fdcId} | {dataType} | {publishedDate}
      </p>
      <div
        className="grid grid-cols-1 space-y-[30px]
      md:grid-cols-2 md:space-x-[30px] md:space-y-[0px]"
      >
        <BarGraph
          title="Macronutrients"
          data={macrosData}
          units={macrosUnits}
          labels={macrosLabels}
        />
        <BarGraphStacked
          title="Macronutrients"
          data={macrosData}
          units={macrosUnits}
          labels={macrosLabels}
        />
      </div>
    </div>
  );
};
