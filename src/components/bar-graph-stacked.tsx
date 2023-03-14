import { useEffect, useRef } from "react";
import { useResizeObserver } from "./graph-utilities";
import { select, cumsum, scaleLinear } from "d3";

interface Props {
  title: string;
  data: number[];
  units: string[];
  labels: string[];
}

export const BarGraphStacked = ({ title, data, units, labels }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useResizeObserver(svgRef);

  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);

    const cumSum = [0].concat(...cumsum(data));

    // domain is [0,100] because max position is 100 (for a 100g sample)
    const xScale = scaleLinear().domain([0, 100]).range([0, dimensions.width]);

    svg
      .selectAll(".bar")
      .data(data)
      .join("g")
      .attr("data-index", (v: number, i: number) => i)
      .attr(
        "transform",
        (_: any, i: number) => `translate(${xScale(cumSum[i])},0)`
      )
      .on("mouseenter", function (event: any, value: number) {
        select(event.target)
          .append("text")
          .attr("class", "data-label")
          .text((v: number) => `${v} ${units[0]}`)
          .attr("x", (v: number) => xScale(v / 2))
          .attr("y", dimensions.height / 2 + 5)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .attr(
            "fill",
            (_: any, i: number) =>
              `hsl(0,0%,${
                event.target.dataset.index * (100 / data.length) > 50 ? 0 : 100
              }%)`
          );
      })
      .on("mouseleave", () => svg.selectAll(".data-label").remove())
      .append("rect")
      .attr("class", "bar")
      .attr("width", (v: number) => xScale(v))
      .attr("height", dimensions.height)
      .attr(
        "fill",
        (_: any, i: number) => `hsl(0,0%,${i * (100 / data.length)}%)`
      );

    return () => {
      svg.selectAll("rect").remove();
    };
  });

  return (
    <div className="w-full space-y-[10px]">
      <p className="text-[10px]">{title}</p>
      <svg ref={svgRef} className="w-full h-full overflow-visible border">
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
