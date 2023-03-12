import { useEffect, useRef, useState } from "react";
import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";
import { NutrientInterface } from "../interfaces/nutrient-interface";
import ResizeObserver from "resize-observer-polyfill";

export const GraphMacros = ({
  nutrients,
}: {
  nutrients: NutrientInterface[];
}) => {
  const findNutrientByName = (name: string) => {
    for (let i = 0; i < nutrients.length; i++) {
      if (nutrients[i].nutrientName === name) return nutrients[i];
    }
    return { value: null };
  };

  const useResizeObserver = (ref: React.RefObject<SVGSVGElement>) => {
    const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);
    useEffect(() => {
      const observeTarget = ref.current;
      const resizeObserver = new ResizeObserver((entries) => {
        // set resized dimensions
        setDimensions(entries[0].contentRect);
      });
      if (observeTarget) resizeObserver.observe(observeTarget);

      // cleanup
      return () => {
        if (observeTarget) resizeObserver.unobserve(observeTarget);
      };
    }, [ref]);
    return dimensions;
  };

  const labels: string[] = [];
  const data: number[] = [];
  const dataUnits: string[] = [];
  for (let n of [
    "Total lipid (fat)",
    "Carbohydrate, by difference",
    "Water",
    "Protein",
    "Ash",
  ]) {
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
      dataUnits.push(nutrient.unitName);
    }
  }

  const svgRef = useRef<SVGSVGElement>(null);

  const dimensions = useResizeObserver(svgRef);

  useEffect(() => {
    if (!dimensions) return;

    const svg = select(svgRef.current);

    const xScale = scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, dimensions?.width])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([0, dimensions?.height]);
    const yAxisScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([dimensions?.height, 0]);

    const xAxis = axisBottom(xScale).tickFormat((n: number) => labels[n]);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions?.height}px)`)
      .call(xAxis);

    const yAxis = axisLeft(yAxisScale).tickSizeOuter(0);
    svg.select(".y-axis").call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")

      .attr("class", "bar")
      .style("transform", "scale(1,-1)")
      .attr("x", (_: any, i: number) => xScale(i))
      .attr("y", dimensions ? -dimensions.height : 0)
      .attr("width", xScale.bandwidth())
      .attr("height", (v: number) => yScale(v))
      .on("mouseenter", (event: any, value: number) => {
        svg
          .selectAll(".data-label")
          .data([value])
          .join("text")
          .attr("class", "data-label")
          .text((v: number, i: number) => `${v} ${dataUnits[i]}`)
          .attr("x", event.target.x.baseVal.value + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("y", yAxisScale(value) - 5)
          .style("font-size", "10px");
      })
      .on("mouseleave", () => svg.selectAll(".data-label").remove());
  }, [data, labels, dimensions]);

  return (
    <div className="pb-[40px] w-full space-y-[10px]">
      <p className="text-[10px]">Macronutrients</p>
      <svg ref={svgRef} className="w-full h-full overflow-visible pl-[20px] ">
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
