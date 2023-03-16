import { FoodInterface } from "../interfaces/food-interface";
import { BarGraph } from "./bar-graph";
import { BarGraphStacked } from "./bar-graph-stacked";
import { BarGraphHorizontal } from "./bar-graph-horizontal";

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
    "Alcohol, ethyl",
    "Ash",
  ];
  const minerals = [
    "Calcium, Ca",
    "Iron, Fe",
    "Magnesium, Mg",
    "Phosphorus, P",
    "Potassium, K",
    "Sodium, Na",
    "Zinc, Zn",
    "Copper, Cu",
    "Manganese, Mn",
    "Selenium, Se",
  ];

  const vitamins = [
    "Vitamin C, total ascorbic acid",
    "Thiamin",
    "Riboflavin",
    "Niacin",
    "Pantothenic acid",
    "Vitamin B-6",
    "Folate, total",
    "Folic acid",
    "Folate, food",
    "Folate, DFE",
    "Vitamin B-12",
    "Vitamin B-12, added",
    "Vitamin A, RAE",
    "Retinol",

    "Vitamin A, IU",
    "Vitamin E (alpha-tocopherol)",
    "Vitamin E, added",
    "Vitamin D (D2 + D3), International Units",
    "Vitamin D (D2 + D3)",
    "Vitamin D3 (cholecalciferol)",
    "Vitamin K (phylloquinone)",
    "Vitamin K (Dihydrophylloquinone)",
  ];

  const vitaminE = [
    "Tocopherol, beta",
    "Tocopherol, gamma",
    "Tocopherol, delta",
    "Tocotrienol, alpha",
    "Tocotrienol, beta",
    "Tocotrienol, gamma",
    "Tocotrienol, delta",
  ];

  const otherNutrients = [
    "Choline, total",
    "Betaine",
    "Carotene, beta",
    "Carotene, alpha",
    "Cryptoxanthin, beta",
    "Lycopene",
    "Lutein + zeaxanthin",
  ];

  let [macrosData, macrosUnits, macrosLabels] = getDataUnitsLabels(macros);

  let [mineralsData, mineralsUnits, mineralsLabels] =
    getDataUnitsLabels(minerals);

  let [vitaminsData, vitaminsUnits, vitaminsLabels] =
    getDataUnitsLabels(vitamins);

  let [vitaminEData, vitaminEUnits, vitaminELabels] =
    getDataUnitsLabels(vitaminE);
  let [otherData, otherUnits, otherLabels] = getDataUnitsLabels(otherNutrients);

  return (
    <div className="space-y-[30px] pb-[30px]">
      <p className="truncate">
        {description} | {fdcId} | {dataType} | {publishedDate}
      </p>
      <div className="h-[100px]">
        <BarGraphStacked
          title="Macronutrients"
          data={macrosData}
          units={macrosUnits}
          labels={macrosLabels}
        />
      </div>
      <div
        className="grid gap-y-[30px] gap-x-[60px]
      md:grid-cols-2"
      >
        <BarGraphHorizontal
          title="Vitamins"
          data={vitaminsData}
          units={vitaminsUnits}
          labels={vitaminsLabels}
        />
        <BarGraphHorizontal
          title="Minerals"
          data={mineralsData}
          units={mineralsUnits}
          labels={mineralsLabels}
        />
        {vitaminEData.length > 0 ? (
          <BarGraphHorizontal
            title="Vitamin E"
            data={vitaminEData}
            units={vitaminEUnits}
            labels={vitaminELabels}
          />
        ) : null}
        {otherData.length > 0 ? (
          <BarGraphHorizontal
            title="Other"
            data={otherData}
            units={otherUnits}
            labels={otherLabels}
          />
        ) : null}
      </div>
    </div>
  );
};
