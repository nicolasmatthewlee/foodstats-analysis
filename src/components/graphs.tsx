import { FoodInterface } from "../interfaces/food-interface";

interface Props {
  data: FoodInterface;
}

export const Graphs = ({
  data: { dataType, fdcId, description, foodNutrients, publishedDate },
}: Props) => {
  return (
    <div className="bg-red-100">
      <p>{description}</p>
      <p>{fdcId}</p>
      <p>{dataType}</p>
      <p>{publishedDate}</p>
      {foodNutrients.map((e) => (
        <div key={e.nutrientId}>
          {e.nutrientName}: {e.value} {e.unitName}
        </div>
      ))}
    </div>
  );
};
